import { Component, OnInit, inject } from '@angular/core';
import { DropDownService } from '../../services/drop-down.service';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { EstimateService } from '../../services/estimate.service';

@Component({
  selector: 'app-job-estimation-contracts',
  standalone: false,
  templateUrl: './job-estimation-contracts.component.html',
  styleUrl: './job-estimation-contracts.component.scss',
})

export class JobEstimationContractsComponent implements OnInit {

  estimateForm!: FormGroup;
  estArray: any;
  estData: any;
  jobsList: any[] = [];
  selectedJobId: string = '';
  roomsList: any[] = [];
  servicesList: any[] = [];
  public visible = false;
  public visibleViewEstimate = false;
  totalSqFt: number = 0;
  showRoomSection: boolean = false;
  loading: boolean = false;  
  estimateData: any;
  deletingEstimateId: string | null = null;
  public selectedEstimate: any = null;
  selectedServicePrice: number = 0;
  selectedMethodPrice: number = 0;
  

  constructor(
    private estimateService: EstimateService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initEstimateForm();
    this.getAllEstimatesData();
    this.getAllJobs();
    this.getAllRooms();
    this.getAllServices();
    this.visible = true;
  }

  toggleLiveDemo() {
    this.visible = !this.visible;
  }

  handleLiveDemoChange(event: any) {
    this.visible = event;
  }

  toggleViewEstimate() {
    this.visibleViewEstimate = !this.visibleViewEstimate;
  }

  handleViewEstimateChange(event: any) {
    this.visibleViewEstimate = event;
  }

  // Initialize Form
  initEstimateForm() {
    this.estimateForm = this.fb.group({
      jobId: ['', Validators.required],
      room: ['', Validators.required],
      length: [null, [Validators.required, Validators.min(1)]],
      width: [null, [Validators.required, Validators.min(1)]],
      selectedServices: this.fb.array([]),
    });

    this.estimateForm.get('length')?.valueChanges.subscribe(() => this.calculateTotalSqFt());
    this.estimateForm.get('width')?.valueChanges.subscribe(() => this.calculateTotalSqFt());
  }


  // Get selectedServices FormArray
  get selectedServices(): FormArray {
    return this.estimateForm.get('selectedServices') as FormArray;
  }

  // Add service-method pair
  addServiceMethod() {
    const serviceGroup = this.fb.group({
      serviceId: ['', Validators.required],
      methodId: ['', Validators.required],
    });
    this.selectedServices.push(serviceGroup);
  }

  // Remove a service-method pair
  removeServiceMethod(index: number) {
    this.selectedServices.removeAt(index);
  }

  calculateTotalSqFt(): void {
    const length = this.estimateForm.get('length')?.value || 0;
    const width = this.estimateForm.get('width')?.value || 0;
    this.totalSqFt = length * width;
  }

  calculateServiceMethodPrice(item: any): number {
    const service = this.servicesList.find(s => s._id === item.serviceId);
    const method = service?.methods.find((m: any) => m.method._id === item.methodId);
    const servicePrice = service?.price || 0;
    const methodPrice = method?.price || 0;
    return this.totalSqFt * (servicePrice + methodPrice);
  }

  // Submit Estimate
  submitEstimate() {
    if (this.estimateForm.invalid) {
      alert('Please fill out all required fields.');
      return;
    }

    this.loading = true; 

    this.estimateService.submitEstimate(this.estimateForm.value).subscribe({
      next: (res) => {
        this.getAllEstimatesData();
        this.estimateForm.reset();
        this.selectedServices.clear();
        this.toggleLiveDemo();
        this.showRoomSection = false;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error creating estimate:', err);
        alert(err?.error?.message || 'Something went wrong.');
        this.loading = false;
      },
    });
  }

  getAllEstimatesData(): void {
    this.estimateService.getAllEstimates().subscribe({
      next: (res) => {
        this.estData = res;
        this.estArray = this.estData.data;     
      },
      error: (err) => {
        console.error("Error fetching All Estimates", err);        
      }
    })
  }

  // All Jobs
  getAllJobs(): void {
    this.estimateService.getAllJobsService().subscribe({
      next: (res) => {
        this.jobsList = res.data || [];
      },
      error: (err) => {
        console.error('Error fetching Jobs', err);
      },
    });
  }

  // All Rooms
  getAllRooms() {
    this.estimateService.getAllRoomsService().subscribe({
      next: (res) => {
        this.roomsList = res || [];
      },
      error: (err) => {
        console.error('Error fetching all rooms', err);
      },
    });
  }

  // Get All Services 
  getAllServices(): void {
    this.estimateService.getAllServicesService().subscribe({
      next: (res) => {
        this.servicesList = res.data || [];       
      },
      error: (err) => {
        console.error("Error fetching services and methods", err);        
      }
    })
  }

  getMethodsForService(serviceId: string): any[] {
    const service = this.servicesList.find(s => s._id === serviceId);
    return service?.methods || [];
  }

  deleteEstimate(id: any) {
    this.deletingEstimateId = id; 
  
    this.estimateService.deleteEstimateService(id).subscribe({
      next: (res) => {
        this.getAllEstimatesData();
        this.deletingEstimateId = null;
      },
      error: (err) => {
        console.error('Error deleting estimate:', err);
        alert('Failed to delete estimate');
        this.deletingEstimateId = null;
      }
    });
  }

  getEstimateDetails(id: string): void {
    this.estimateService.getEstimateByIdService(id).subscribe({
      next: (response) => {
        console.log('Estimate Data:', response); 
        this.estimateData = response.data;
        this.visibleViewEstimate = true;
      },
      error: (err) => {
        console.error('Error fetching estimate:', err);
      }
    });
  }

  onServiceChange(serviceId: string) {
    const selectedService = this.servicesList.find(s => s._id === serviceId);
    this.selectedServicePrice = selectedService?.price || 0;
  }
  
  onMethodChange(methodId: string, serviceId: string) {
    const methods = this.getMethodsForService(serviceId);
    const selectedMethod = methods.find(m => m.method._id === methodId);
    this.selectedMethodPrice = selectedMethod?.price || 0;
  }
  
  
}
