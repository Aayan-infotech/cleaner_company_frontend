import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { EstimateService } from '../../services/estimate.service';

import { Room } from '../../models/room';
import { Service } from '../../models/service';
import { ItemClean } from '../../models/item-clean';
import { DryCleaning } from '../../models/dry-cleaning';
import { HardSurface } from '../../models/hard-surface';
import { Method } from '../../models/method';
@Component({
  selector: 'app-order-request-section',
  standalone: false,
  templateUrl: './order-request-section.component.html',
  styleUrl: './order-request-section.component.scss'
})
export class OrderRequestSectionComponent {
  rooms: Room[] = [];
  services: Service[] = [];
  itemCleans: ItemClean[] = [];
  dryCleanings: DryCleaning[] = [];
  hardSurfaces: HardSurface[] = [];
  methods: Method[] = [];

  estimates: { room: string, selectedServices: { service: string, itemClean: string, dryCleaning: string, hardSurface: string, method: string, estimatedCost: number }[] }[] = [];

  constructor(private apiService: ApiService ,private estimateService: EstimateService) {}

  ngOnInit(): void {
    this.apiService.getRooms().subscribe(data => this.rooms = data);
    this.apiService.getServices().subscribe(data => this.services = data);
    this.apiService.getItemCleans().subscribe(data => this.itemCleans = data);
    this.apiService.getDryCleanings().subscribe(data => this.dryCleanings = data);
    this.apiService.getHardSurfaces().subscribe(data => this.hardSurfaces = data);
    this.apiService.getMethods().subscribe(data => this.methods = data);
  }

  addRoom() {
    this.estimates.push({ room: '', selectedServices: [] });
  }

  addService(index: number) {
    this.estimates[index].selectedServices.push({ service: '', itemClean: '', dryCleaning: '', hardSurface: '', method: '', estimatedCost: 0 });
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
    const dryCleaning = this.dryCleanings.find(dc => dc._id === selectedService.dryCleaning);
    const hardSurface = this.hardSurfaces.find(hs => hs._id === selectedService.hardSurface);
    const method = this.methods.find(m => m._id === selectedService.method);
    return (service ? service.price : 0)  + (itemClean ? itemClean.price : 0) + (dryCleaning ? dryCleaning.price : 0) + (hardSurface ? hardSurface.price : 0) + (method ? method.price : 0);
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
      totalEstimate: this.calculateEstimate(),
      estimates: this.estimates
    };

    this.estimateService.submitEstimate(estimateData)
    .subscribe({
      next:(res)=>{
        alert("Item Created")
        console.log("Estimate Submitted",res)
        this.resetEstimates();
      },
      error:(err)=>{
        console.log(err);
      }
    })
  }
  resetEstimates() {
    this.estimates = [];
  }
}


  
