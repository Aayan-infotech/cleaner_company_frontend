import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'app-manage-categories',
  templateUrl: './manage-categories.component.html',
  styleUrl: './manage-categories.component.scss',
})
export class ManageCategoriesComponent {

  public visibleAddCategory = false;
  public visibleViewCategory = false;

  // Add Category Modal
  toggleAddCategoryModal() {
    this.visibleAddCategory = !this.visibleAddCategory;
  }

  handleAddCategoryChange(event: any) {
    this.visibleAddCategory = event;
  }

  // View Category Modal
  toggleViewCategoryModal() {
    this.visibleViewCategory = !this.visibleViewCategory;
  }

  handleViewCategoryChange(event: any) {
    this.visibleViewCategory = event;
  }
}
