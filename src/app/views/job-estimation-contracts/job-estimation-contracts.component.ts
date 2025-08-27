import { Component, OnInit, inject } from '@angular/core';
import { DropDownService } from '../../services/drop-down.service';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { EstimateService } from '../../services/estimate.service';
import { HotToastService } from '@ngxpert/hot-toast';

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

  estimates: any[] = [];
  isFetchingEstimates: boolean = false;
  totalEstimates: number = 0;
  currentEstimatePage: number = 1;
  pageSize: number = 10;


  constructor(
    private estimateService: EstimateService,
    private toast: HotToastService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.initEstimateForm();
    // this.getAllEstimatesData();
    this.getAllEstimates();
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
      this.toast.error('Please fill all required fields before saving.');
      return;
    }

    this.loading = true;

    this.estimateService.submitEstimate(this.estimateForm.value).subscribe({
      next: (res) => {
        this.getAllEstimates();
        this.estimateForm.reset();
        this.selectedServices.clear();
        this.toggleLiveDemo();
        this.showRoomSection = false;
        this.loading = false;

        this.toast.success('Estimate created successfully for Job ID: ' + res.data?.jobId, {
          icon: '📊',
          theme: 'snackbar',
        });

      },
      error: (err) => {
        console.error('Error creating estimate:', err);
        this.toast.error(err?.error?.message || 'Failed to create estimate. Try again!', {
          icon: '⚠️',
          theme: 'snackbar',
        });
        this.loading = false;
      },
    });
  }

  getAllEstimates(page: number = 1): void {
    this.estimateService.getAllEstimatesService(page, this.pageSize).subscribe({
      next: (res) => {
        this.estimates = res.data || [];
        this.totalEstimates = res.pagination?.total || 0;
        this.currentEstimatePage = res.pagination?.page || 1;
        this.isFetchingEstimates = false;
      },
      error: (err) => {
        console.error('Error fetching estimates:', err);
        this.isFetchingEstimates = false;
      }
    })
  };

  get totalEstimatePages(): number {
    return Math.ceil(this.totalEstimates / this.pageSize);
  }

  totalEstimatePagesArray(): number[] {
    return Array(this.totalEstimatePages)
      .fill(0)
      .map((_, i) => i + 1);
  }

  changeEstimatePage(page: number): void {
    if (page >= 1 && page <= this.totalEstimatePages) {
      this.getAllEstimates(page);
    }
  }

  // All Jobs
  getAllJobs(): void {
    this.estimateService.getAllJobsService().subscribe({
      next: (res) => {
        this.jobsList = res.data || [];
      },
      error: (err) => {
        console.error('Error fetching Jobs', err);
        this.toast.error('Unable to load jobs. Please refresh!', {
          icon: '⚠️',
          theme: 'snackbar',
        });
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
        this.toast.error('Rooms could not be loaded.', {
          icon: '🏠',
          theme: 'snackbar',
        });
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
        this.toast.error('Failed to load services & methods.', {
          icon: '🛠️',
          theme: 'snackbar',
        });
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
        this.getAllEstimates();
        this.deletingEstimateId = null;

        this.toast.success('Estimate deleted successfully!', {
          icon: '🗑️',
          theme: 'snackbar',
        });

      },
      error: (err) => {
        console.error('Error deleting estimate:', err);
        this.toast.error('Failed to delete estimate. Please try again.', {
          icon: '❌',
          theme: 'snackbar',
        });
        this.deletingEstimateId = null;
      }
    });
  }

  getEstimateDetails(id: string): void {
    this.estimateService.getEstimateByIdService(id).subscribe({
      next: (response) => {
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
