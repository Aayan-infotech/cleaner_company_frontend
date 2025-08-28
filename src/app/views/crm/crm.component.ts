import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { CrmService } from '../../services/crm.service';
import { HotToastService } from '@ngxpert/hot-toast';

@Component({
  selector: 'app-crm',
  templateUrl: './crm.component.html',
  styleUrls: ['./crm.component.scss'],
})
export class CrmComponent implements OnInit {

  crmForm: FormGroup;
  crmList: any[] = [];
  searchTerm: string = '';
  public visible = false;
  public isEditing = false;
  public editingCRMId: string | null = null;
  isEditMode = false;
  editClientId: string | null = null;
  selectedFiles: File[] = [];
  selectedClient: any = null;
  isViewCrmVisible = false;
  loading: boolean = true;
  images: File[] = [];

  crms: any[] = [];
  currentPage = 1;
  pageSize = 10;
  totalCrms: number = 0;
  selectedClients: Set<string> = new Set();

  // Profile Picture View Section
  public visibleProfilePicView = false;



  constructor(
    private fb: FormBuilder,
    private toast: HotToastService,
    private crmService: CrmService,
    private cdr: ChangeDetectorRef
  ) {
    this.crmForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      phones: this.fb.array([]),
      // images: [null],

      // New fields
      secondaryName: ['', Validators.required],
      secondaryEmail: ['', [Validators.required, Validators.email]],
      secondaryAddress: ['', Validators.required],
      secondaryPhones: this.fb.array([]),
      paymentOptions: ['cash'],
    });
  }

  ngOnInit(): void {
    this.fetchAllCRM();
  }

  get phones(): FormArray {
    return this.crmForm.get('phones') as FormArray;
  }

  get secondaryPhones(): FormArray {
    return this.crmForm.get('secondaryPhones') as FormArray;
  }

  // Add a phone control
  addPhone(): void {
    this.phones.push(
      this.fb.group({
        type: ['', Validators.required],
        number: ['', [Validators.required]],
      })
    );
  }

  // Remove a phone control
  removePhone(index: number): void {
    this.phones.removeAt(index);
  }

  addSecondaryPhone(): void {
    this.secondaryPhones.push(
      this.fb.group({
        type: ['', Validators.required],
        number: ['', Validators.required],
      })
    );
  }

  removeSecondaryPhone(index: number): void {
    this.secondaryPhones.removeAt(index);
  }

  toggleLiveDemo(): void {
    this.visible = !this.visible;
    if (!this.visible) {
      this.isEditMode = false;
      this.crmForm.reset();
      this.phones.clear();
      this.secondaryPhones.clear();
    }
  }

  handleLiveDemoChange(event: boolean): void {
    this.visible = event;
  }

  fetchAllCRM(page: number = 1): void {
    this.loading = true;

    this.crmService.getAllCRM(page, this.pageSize).subscribe({
      next: (response) => {
        this.crmList = response.data || [];
        this.totalCrms = response.pagination?.total || 0;
        this.currentPage = response.pagination?.page || 1;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching CRM records:', error);
        this.loading = false;
      },
    });
  }

  get totalPages(): number {
    return Math.ceil(this.totalCrms / this.pageSize);
  }

  totalPagesArray(): number[] {
    return Array(this.totalPages)
      .fill(0)
      .map((_, i) => i + 1);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.fetchAllCRM(page);
    }
  }

  onFileSelected(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFiles = Array.from(event.target.files);
    }
  }

  deleteCRM(clientId: string): void {
    this.crmService.deleteCRMById(clientId)
      .pipe(
        this.toast.observe({
          loading: 'Deleting client... ⏳',
          success: 'Client deleted successfully',
          error: 'Failed to delete client',
        })
      )
      .subscribe({
        next: () => this.fetchAllCRM()
      });
  }

  onFileChange(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.images = Array.from(event.target.files);
    }
  }

  onSubmit(): void {
    if (this.crmForm.valid) {
      const formData = {
        ...this.crmForm.value,
        images: this.selectedFiles
      };

      if (this.isEditMode && this.editClientId) {
        this.crmService.updateCRM(this.editClientId, formData)
          .pipe(
            this.toast.observe({
              loading: 'Updating client... ⏳',
              success: 'Client updated successfully ',
              error: 'Failed to update client',
            })
          ).subscribe({
            next: () => {
              this.toggleLiveDemo();
              this.fetchAllCRM();
              this.crmForm.reset();
              this.selectedFiles = [];
            }
          });
      } else {
        this.crmService.createCRM(formData)
          .pipe(
            this.toast.observe({
              loading: 'Adding client... ⏳',
              success: 'Client added successfully',
              error: 'Failed to add client',
            })
          )
          .subscribe({
            next: () => {
              this.toggleLiveDemo();
              this.fetchAllCRM();
              this.crmForm.reset();
              this.selectedFiles = [];
            }
          });
      }
    }
    else {
      this.toast.warning('Please fill all required fields');
    }
  }

  editCRM(client: any): void {
    this.isEditMode = true;
    this.editClientId = client._id;
    this.toggleLiveDemo();

    // Populate the form with existing data
    this.crmForm.patchValue({
      name: client.name,
      email: client.email,
      address: client.address,
      secondaryName: client.secondaryName,
      secondaryEmail: client.secondaryEmail,
      secondaryAddress: client.secondaryAddress,
      paymentOptions: client.paymentOptions || 'cash',
    });

    // Clear and repopulate phone fields
    this.phones.clear();
    client.phones?.forEach((phone: any) =>
      this.phones.push(
        this.fb.group({
          type: [phone.type, Validators.required],
          number: [phone.number, Validators.required],
        })
      )
    );

    this.secondaryPhones.clear();
    client.secondaryPhones?.forEach((phone: any) =>
      this.secondaryPhones.push(
        this.fb.group({
          type: [phone.type, Validators.required],
          number: [phone.number, Validators.required],
        })
      )
    );
  }

  toggleViewCrmModal() {
    this.isViewCrmVisible = !this.isViewCrmVisible;
    if (!this.isViewCrmVisible) {
      this.selectedClient = null;
    }
  }

  handleViewCrmVisibleChange(event: boolean) {
    this.isViewCrmVisible = event;
  }

  getCrmById(clientId: string): void {
    this.crmService.getCRMById(clientId).subscribe({
      next: (response) => {
        const client = response.data;
        if (!client) return;
        this.selectedClient = client;
        this.isEditMode = true;
        this.toggleViewCrmModal();
      },
      error: (error) => {
        console.error('Error fetching CRM by ID:', error);
      }
    });
  }

  viewCrm(clientId: string): void {
    this.getCrmById(clientId);
  }


  // Profile Picture View Section
  toggleProfilePicView() {
    this.visibleProfilePicView = !this.visibleProfilePicView;
  }

  handleProfilePicView(event: any) {
    this.visibleProfilePicView = event;
  }

  getCrmProfilePicById(clientId: string): void {
    this.crmService.getCRMById(clientId).subscribe({

      next: (response) => {
        const client = response.data;
        if (!client) return;

        this.selectedClient = client;
        this.visibleProfilePicView = true;
      },
      error: (error) => {
        console.error('Error fetching CRM by ID:', error);
      }
    });
  }

  viewCrmProfilePic(clientId: string): void {
    this.getCrmProfilePicById(clientId);
  }


  // search function
  get filteredCRMList(): any[] {
    if (!this.searchTerm.trim()) return this.crmList;

    const term = this.searchTerm.toLowerCase();
    return this.crmList.filter(
      (client) =>
        client.name?.toLowerCase().includes(term) ||
        client.email?.toLowerCase().includes(term) ||
        client.address?.toLowerCase().includes(term) ||
        client.phones?.some(
          (phone: any) =>
            phone.number.includes(term) ||
            phone.type.toLowerCase().includes(term)
        )
    );
  }

  // Check if a client is selected
  isClientSelected(clientId: string): boolean {
    return this.selectedClients.has(clientId);
  }

  // Toggle selection for a single client
  toggleClientSelection(clientId: string, event: any): void {
    if (event.target.checked) {
      this.selectedClients.add(clientId);
    } else {
      this.selectedClients.delete(clientId);
    }
  }

  // Check if all clients are selected
  areAllClientsSelected(): boolean {
    return this.filteredCRMList.length > 0 &&
      this.filteredCRMList.every(client => this.selectedClients.has(client._id));
  }

  // Toggle select all
  toggleSelectAllClients(event: any): void {
    if (event.target.checked) {
      this.filteredCRMList.forEach(client => this.selectedClients.add(client._id));
    } else {
      this.selectedClients.clear();
    }
  }

  deleteSelectedClients(): void {
    if (this.selectedClients.size === 0) {
      this.toast.error('No clients selected for deletion.');
      return;
    }

    const idsToDelete = Array.from(this.selectedClients);

    this.crmService.deleteMultipleCRMsService(idsToDelete)
      .pipe(
        this.toast.observe({
          loading: `Deleting ${this.selectedClients.size} clients... ⏳`,
          success: 'Clients deleted successfully!',
          error: (err: any) => err.error?.message || 'Failed to delete clients',
        })
      )
      .subscribe(() => {
        this.fetchAllCRM();
        this.selectedClients.clear();
      });
  }

}
