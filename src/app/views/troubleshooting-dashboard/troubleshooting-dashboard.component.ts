
import { cilChartPie, cilArrowRight } from '@coreui/icons';
import { Component, OnInit, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TroubleCategoryService } from '../../services/trouble-category.service'

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

  ngOnInit(): void {
    this.categoryForm = this.fb.group({
      categoryName: ['', Validators.required],
    })
    this.getAllCategories();
  }

  addCategory() {
    console.log(this.categoryForm.value)
    this.troubleCategoryService.createCategoryService(this.categoryForm.value)
      .subscribe({
        next: (res) => {
          alert("Category Created")
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

}

