import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { CrmService } from '../../services/crm.service';

@Component({
  selector: 'app-crm',
  templateUrl: './crm.component.html',
  styleUrls: ['./crm.component.scss']
})
export class CrmComponent implements OnInit {
  crmForm: FormGroup;
  crmList: any[] = [];
  public visible = false;
  public isEditing = false;
  public editingCRMId: string | null = null;
  isEditMode = false;
  editClientId: string | null = null;

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
      images: [null],
    });
  }

  ngOnInit(): void {
    this.fetchAllCRM();
  }

  get phones(): FormArray {
    return this.crmForm.get('phones') as FormArray;
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

  toggleLiveDemo(): void {
    this.visible = !this.visible;
    if (!this.visible) {
      this.isEditMode = false; // Reset edit mode when modal is closed
      this.crmForm.reset();
      this.phones.clear(); // Clear phone fields
    }
  }


  handleLiveDemoChange(event: boolean): void {
    this.visible = event;
  }

  fetchAllCRM(): void {
    this.crmService.getAllCRM().subscribe(
      (response) => {
        this.crmList = response.data.crms || [];
      },
      (error) => console.error('Error fetching CRM records:', error)
    );
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

  onSubmit(): void {
    if (this.crmForm.valid) {
      if (this.isEditMode && this.editClientId) {
        // Update mode
        this.crmService.updateCRM(this.editClientId, this.crmForm.value).subscribe(
          () => {
            this.toggleLiveDemo();
            this.fetchAllCRM();
            this.crmForm.reset();
          },
          (error) => console.error('Error updating CRM:', error)
        );
      } else {
        // Create mode
        this.crmService.createCRM(this.crmForm.value).subscribe(
          () => {
            this.toggleLiveDemo();
            this.fetchAllCRM();
            this.crmForm.reset();
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
    });

    // Clear and repopulate phone fields
    this.phones.clear();
    if (client.phones?.length) {
      client.phones.forEach((phone: any) =>
        this.phones.push(this.fb.group({
          type: [phone.type, Validators.required],
          number: [phone.number, Validators.required],
        }))
      );
    }
  }

}