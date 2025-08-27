import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MarketingCategoriesService } from '../../../services/marketing-categories.service';
import { HotToastService } from '@ngxpert/hot-toast';

@Component({
  selector: 'app-manage-categories',
  templateUrl: './manage-categories.component.html',
  styleUrl: './manage-categories.component.scss',
})
export class ManageCategoriesComponent {
  categoryForm!: FormGroup;
  allCategories: any[] = [];
  selectedCategory: any = null;
  selectedCategoryId: string | null = null;
  isEditMode = false;
  loading = false;
  loadingCategoryView: string | null = null;
  deletingCategoryId: string | null = null;

  public visibleAddCategory = false;
  public visibleViewCategory = false;

  // Pagination
  currentPage = 1;
  limit = 10;
  totalItems = 0;

  constructor(
    private fb: FormBuilder,
    private toast: HotToastService,
    private marketingCategoriesService: MarketingCategoriesService
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.getAllCategories();
  }

  // Initialize category form
  initializeForm() {
    this.categoryForm = this.fb.group({
      categoryName: ['', Validators.required],
    });
  }

  // Add Category Modal
  toggleAddCategoryModal() {
    this.visibleAddCategory = !this.visibleAddCategory;

    if (this.visibleAddCategory) {
      if (!this.isEditMode) {
        this.categoryForm.reset();
        this.selectedCategoryId = null;
      }
    } else {
      this.resetForm();
    }
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

  // Submit (Create or Update)
  submitCategory(): void {
    if (this.categoryForm.invalid) {
      this.toast.warning('Please fill all required fields ⚠️');
      return;
    }

    const payload = this.categoryForm.value;

    if (this.isEditMode && this.selectedCategoryId) {
      this.loading = true;

      this.marketingCategoriesService
        .updateCategoryByIdService(this.selectedCategoryId, payload)
        .pipe(
          this.toast.observe({
            loading: 'Updating category... ⏳',
            success: 'Category updated successfully!',
            error: (err: any) => err.error?.message || 'Failed to update category',
          })
        )
        .subscribe({
          next: () => {
            this.getAllCategories();
            this.toggleAddCategoryModal();
          },
          error: (err) => {
            console.error('Update failed:', err);
          },
          complete: () => {
            this.loading = false;
            this.resetForm();
          },
        });
    } else {
      this.loading = true;

      this.marketingCategoriesService.createCategoryService(payload)
        .pipe(
          this.toast.observe({
            loading: 'Creating category... ⏳',
            success: 'Category created successfully!',
            error: (err: any) => err.error?.message || 'Failed to create category',
          })
        ).subscribe({
          next: () => {
            this.getAllCategories();
            this.toggleAddCategoryModal();
          },
          error: (err) => {
            console.error('Create failed:', err);
          },
          complete: () => {
            this.loading = false;
            this.resetForm();
          },
        });
    }
  }

  // View Category Details
  viewCategory(id: string) {
    this.loadingCategoryView = id;

    this.marketingCategoriesService.getCategoryByIdService(id).subscribe({
      next: (res) => {
        this.selectedCategory = res.data;
        this.visibleViewCategory = true;
        this.loadingCategoryView = null;
      },
      error: (err) => {
        console.error('Error fetching category:', err);
        this.loadingCategoryView = null;
      },
    });
  }

  // Edit Category
  editCategory(category: any): void {
    this.categoryForm.patchValue({
      categoryName: category.categoryName,
    });
    this.selectedCategoryId = category._id;
    this.isEditMode = true;
    this.visibleAddCategory = true;
  }

  // Fetch All Categories
  getAllCategories(): void {
    this.marketingCategoriesService
      .getAllCategoriesService(this.currentPage, this.limit)
      .subscribe({
        next: (res) => {
          this.allCategories = res.data || [];
          this.totalItems = res.pagination?.totalCategories || 0;
        },
        error: (err) => {
          console.error('Error fetching categories:', err);
        },
      });
  }

  // Pagination
  get totalPages(): number {
    return Math.ceil(this.totalItems / this.limit);
  }

  totalPagesArray(): number[] {
    return Array(this.totalPages)
      .fill(0)
      .map((_, i) => i + 1);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.getAllCategories();
    }
  }

  // Reset Form
  resetForm(): void {
    this.categoryForm.reset();
    this.selectedCategoryId = null;
    this.isEditMode = false;
  }

  // Delete Category
  deleteCategory(id: string): void {
    this.deletingCategoryId = id;

    this.marketingCategoriesService.deleteCategoryById(id)
    .pipe(
      this.toast.observe({
        loading: 'Deleting category... ⏳',
        success: 'Category deleted successfully!',
        error: (err: any) => err.error?.message || 'Failed to delete category',
      })
    ).subscribe({
      next: () => {
        this.getAllCategories();
        this.deletingCategoryId = null;
      },
      error: (err) => {
        console.error('Delete failed:', err);
        this.deletingCategoryId = null;
      },
    });
  }
}
