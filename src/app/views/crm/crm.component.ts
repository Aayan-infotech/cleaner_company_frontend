import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { CrmService } from '../../services/crm.service';

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
  
  constructor(
    private fb: FormBuilder,
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

  fetchAllCRM(): void {
    this.loading = true;

    this.crmService.getAllCRM().subscribe({
      next: (response) => {
        this.crmList = response.data.crms || [];
        this.loading = false;       
      },
      error: (error) => {
        console.error('Error fetching CRM records:', error);
        this.loading = false;
      },
    });
  }

  onFileSelected(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFiles = Array.from(event.target.files);
    }
  }

  deleteCRM(clientId: string): void {
    if (confirm('Are you sure you want to delete this CRM entry?')) {
      this.crmService.deleteCRMById(clientId).subscribe(
        () => {
          this.fetchAllCRM();
        },
        (error) => console.error('Error deleting CRM:', error)
      );
    }
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
        images: this.selectedFiles // ⬅ Add images manually
      };
  
      if (this.isEditMode && this.editClientId) {
        this.crmService.updateCRM(this.editClientId, formData).subscribe(
          () => {
            this.toggleLiveDemo();
            this.fetchAllCRM();
            this.crmForm.reset();
            this.selectedFiles = [];
          },
          (error) => console.error('Error updating CRM:', error)
        );
      } else {
        this.crmService.createCRM(formData).subscribe(
          () => {
            this.toggleLiveDemo();
            this.fetchAllCRM();
            this.crmForm.reset();
            this.selectedFiles = [];
          },
          (error) => console.error('Error creating CRM:', error)
        );
      }
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
}
