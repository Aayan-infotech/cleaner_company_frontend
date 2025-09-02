
import { cilChartPie, cilArrowRight } from '@coreui/icons';
import { Component, OnInit, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TroubleCategoryService } from '../../services/trouble-category.service'
import { HotToastService } from '@ngxpert/hot-toast';

@Component({
  selector: 'app-troubleshooting-dashboard',
  standalone: false,
  templateUrl: './troubleshooting-dashboard.component.html',
  styleUrl: './troubleshooting-dashboard.component.scss'
})

export class TroubleshootingDashboardComponent {

  icons = { cilChartPie, cilArrowRight };
  fb = inject(FormBuilder);
  router = inject(Router);
  categoryData!: any
  categoryArray!: any
  troubleCategoryService = inject(TroubleCategoryService);
  categoryForm!: FormGroup;
  deletingCategoryId: string | null = null;
  toast = inject(HotToastService);

  ngOnInit(): void {
    this.categoryForm = this.fb.group({
      categoryName: ['', Validators.required],
    })
    this.getAllCategories();
  }

  addCategory() {

    if (this.categoryForm.invalid) {
      this.toast.warning('Please enter category name');
      return;
    }

    this.troubleCategoryService.createCategoryService(this.categoryForm.value)
      .pipe(
        this.toast.observe({
          loading: 'Creating category... ⏳',
          success: 'Category created successfully',
          error: (err: any) => err.error?.message || 'Failed to create category'
        })
      )
      .subscribe({
        next: (res) => {
          this.categoryForm.reset();
          this.getAllCategories();
        },
        error: (err) => {
          console.log(err);
        }
      })
  }

  getAllCategories() {
    this.troubleCategoryService.getAllCategoryService()
      .subscribe((res) => {
        this.categoryData = res
        this.categoryData = this.categoryData.data
        console.log(this.categoryData)
      })
  }

  deleteTroubleShootingCategoryById(categoryId: any): void {
    this.deletingCategoryId = categoryId;

    this.troubleCategoryService.deleteCategoryService(categoryId)
      .pipe(
        this.toast.observe({
          loading: 'Deleting category... ⏳',
          success: 'Category deleted successfully',
          error: (err: any) => err.error?.message || 'Failed to delete category'
        })
      ).subscribe({
        next: (res) => {
          this.getAllCategories();
          this.deletingCategoryId = null;
        },
        error: (err) => {
          console.error("Error fetch Delete Trouble shooting Category", err);
          this.deletingCategoryId = null;
        }
      })
  }

}

