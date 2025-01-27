import { Component, OnInit, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DropDownService } from '../../services/drop-down.service'
import { UsersService } from '../../services/users.service';
import { ApiService } from '../../services/api.service';
import { EstimateService } from '../../services/estimate.service';

import { Room } from '../../models/room';
import { Service } from '../../models/service';
import { ItemClean } from '../../models/item-clean';
import { DryCleaning } from '../../models/dry-cleaning';
import { HardSurface } from '../../models/hard-surface';
import { Method } from '../../models/method';
import { CalendarEventService } from '../../services/calendar-event.service';

@Component({
  selector: 'app-job-scheduling-management',
  standalone: false,
  templateUrl: './job-scheduling-management.component.html',
  styleUrl: './job-scheduling-management.component.scss'
})
export class JobSchedulingManagementComponent {
  EventsService = inject(CalendarEventService);
  fb = inject(FormBuilder);
  dropForm!: FormGroup;

  visible: any;
  usersService = inject(UsersService);
  router = inject(Router)
  userData!: any;
  userArray!: any;
  visible2: any;
  estArray: any;
  estData: any;
  eventData: any;
  eventArray: any;
  selectedJobId: any;

  toggleLiveDemo2() {
    this.visible2 = !this.visible2;
  }

  handleLiveDemoChange2(event2: any) {
    this.visible2 = event2;
  }

  toggleLiveDemo() {
    this.visible = !this.visible;
  }

  handleLiveDemoChange(event: any) {
    this.visible = event;
  }

  rooms: Room[] = [];
  services: Service[] = [];
  itemCleans: ItemClean[] = [];
  dryCleanings: DryCleaning[] = [];
  hardSurfaces: HardSurface[] = [];
  methods: Method[] = [];

  estimates: { room: string, length: number, width: number, totalSquareFoot: number, selectedServices: { service: string, itemClean: string,subItem?: string, dryCleaning: string, hardSurface: string, method: string, estimatedCost: number }[] }[] = [];

  constructor(private apiService: ApiService, private estimateService: EstimateService) { }

  ngOnInit(): void {
    this.apiService.getRooms().subscribe(data => this.rooms = data);
    this.apiService.getServices().subscribe(data => this.services = data);
    this.apiService.getItemCleans().subscribe(data => this.itemCleans = data);
    this.apiService.getDryCleanings().subscribe(data => this.dryCleanings = data);
    this.apiService.getHardSurfaces().subscribe(data => this.hardSurfaces = data);
    this.apiService.getMethods().subscribe(data => this.methods = data);
    this.getAllUsers();
    this.getAllEstimatesData();
    this.getAllCals()

  }

  getAllCals() {
    this.EventsService.getAllEventsService()
      .subscribe((res) => {
        this.eventData = res;
        this.eventArray = this.eventData.data;
        console.log(this.eventArray);
      });
  };

  getAllUsers() {
    this.usersService.getAllUsersService()
      .subscribe((res) => {
        this.userData = res;
        this.userArray = this.userData.data;
        console.log(this.userArray);
      });
  }

  // All estimates
  getAllEstimatesData() {
    this.estimateService.getAllEstimates()
      .subscribe((res) => {
        this.estData = res;
        this.estArray = this.estData.data;
        console.log(this.estArray);
      });
  }

  // Helper function to retrieve subitems based on the selected item ID
  getSubItems(itemCleanId: string) {
    const item = this.itemCleans.find(ic => ic._id === itemCleanId);
    return item ? item.subItems : [];
  }

  addRoom() {
    this.estimates.push({ room: '', length: 0, width: 0, totalSquareFoot: 0, selectedServices: [] });
  }

  addService(index: number) {
    this.estimates[index].selectedServices.push({ service: '', itemClean: '', subItem: '', dryCleaning: '', hardSurface: '', method: '', estimatedCost: 0 });
  }

  removeRoom(index: number) {
    this.estimates.splice(index, 1);
  }

  removeService(roomIndex: number, serviceIndex: number) {
    this.estimates[roomIndex].selectedServices.splice(serviceIndex, 1);
  }

  calculateServicePrice(selectedService: { service: string, itemClean: string, dryCleaning: string, hardSurface: string, method: string }): number {
    const service = this.services.find(s => s._id === selectedService.service);
    const itemClean = this.itemCleans.find(ic => ic._id === selectedService.itemClean);
    const subItem = this.itemCleans.find(si => si._id === selectedService.itemClean);
    const dryCleaning = this.dryCleanings.find(dc => dc._id === selectedService.dryCleaning);
    const hardSurface = this.hardSurfaces.find(hs => hs._id === selectedService.hardSurface);
    const method = this.methods.find(m => m._id === selectedService.method);
    return (service ? service.price : 0) + (itemClean ? itemClean.price : 0) + (dryCleaning ? dryCleaning.price : 0) + (hardSurface ? hardSurface.price : 0) + (method ? method.price : 0);
  }

  calculateEstimate(): number {
    return this.estimates.reduce((total, estimate) => {
      return total + estimate.selectedServices.reduce((serviceTotal, selectedService) => {
        return serviceTotal + this.calculateServicePrice(selectedService);
      }, 0);
    }, 0);
  }

  submitEstimate() {
    // Calculate estimated cost for each service and add it to the estimates
    this.estimates.forEach(estimate => {
      estimate.selectedServices.forEach(selectedService => {
        selectedService.estimatedCost = this.calculateServicePrice(selectedService);
      });
    });

    const estimateData = {
      jobId: this.selectedJobId,
      totalEstimate: this.calculateEstimate(),
      estimates: this.estimates
    };

    this.estimateService.submitEstimate(estimateData)
      .subscribe({
        next: (res) => {
          alert("Item Created");
          console.log("Estimate Submitted", res);
          this.resetEstimates();
          this.getAllEstimatesData();
        },
        error: (err) => {
          console.log(err);
        }
      });
  }

  resetEstimates() {
    this.estimates = [];
  }

  getRoomName(roomId: string): string {
    const room = this.rooms.find(r => r._id === roomId);
    return room ? room.name : '';
  }

  getServiceName(serviceId: string): string {
    const service = this.services.find(s => s._id === serviceId);
    return service ? service.name : '';
  }

  // getItemCleanName(itemCleanId: string): string {
  //   const itemClean = this.itemCleans.find(ic => ic._id === itemCleanId);
  //   return itemClean ? itemClean.name : '';
  // }

  getItemCleanName(itemCleanId: string): string {
    const itemClean = this.itemCleans.find(ic => ic._id === itemCleanId);
    return itemClean ? itemClean.name : '';
  }

  getDryCleaningName(dryCleaningId: string): string {
    const dryCleaning = this.dryCleanings.find(dc => dc._id === dryCleaningId);
    return dryCleaning ? dryCleaning.name : '';
  }

  getHardSurfaceName(hardSurfaceId: string): string {
    const hardSurface = this.hardSurfaces.find(hs => hs._id === hardSurfaceId);
    return hardSurface ? hardSurface.name : '';
  }

  getMethodName(methodId: string): string {
    const method = this.methods.find(m => m._id === methodId);
    return method ? method.name : '';
  }

  deleteEstimate(id: any) {
    this.estimateService.deleteEstimateService(id)
      .subscribe(res => {
        alert('Estimate Deleted')
        this.getAllEstimatesData();
      })
  }
}



