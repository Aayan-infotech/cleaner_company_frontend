import { Component, OnInit, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ItemInventoryService } from '../../../services/item-inventory.service'
import { InventoryCategoryService } from '../../../services/inventory-category.service';

@Component({
  selector: 'app-add-inventory',
  standalone: false,
  templateUrl: './add-inventory.component.html',
  styleUrl: './add-inventory.component.scss'
})

export class AddInventoryComponent implements OnInit {

  fb = inject(FormBuilder);
  router = inject(Router);
  itemInventoryService = inject(ItemInventoryService);
  itemForm!: FormGroup;

  categoryfb = inject(FormBuilder);
  inventoryCategoryService = inject(InventoryCategoryService);
  categoryForm!: FormGroup;
  categoryData!: any;
  // categoriesArray!: any;
  categoriesArray: any[] = [];


  public visible = false;

  toggleLiveDemo() {
    this.visible = !this.visible;
  }

  handleLiveDemoChange(event: any) {
    this.visible = event;
  }

  ngOnInit(): void {
    this.itemForm = this.fb.group({
      itemName: ['', Validators.required], 
      itemID: ['', Validators.required],
      minQuantity: ['', Validators.required],
      comment: ['', Validators.required],
      orderQuantity: ['', Validators.required],
      forWarehouse: [false],
      forVan: [false],
      categoryId: ['', Validators.required],
      categoryName: ['', Validators.required]
    })

    this.categoryForm = this.categoryfb.group({
      categoryName: ['', Validators.required]
    });

    this.getAllCategories();
  }

  onCategoryChange(event: any) {
    const selectedCategoryId = event.target.value;
    const selectedCategory = this.categoriesArray.find(category => category._id === selectedCategoryId);
    if (selectedCategory) {
      this.itemForm.patchValue({
        categoryName: selectedCategory.categoryName
      });
    }
  }

  submit() {
    console.log(this.categoryForm.value);
    const categoryObj = {
      categoryName: this.categoryForm.get('categoryName')?.value
    };

    this.inventoryCategoryService.createInventoryCategoryService(categoryObj).subscribe({
      next: (res) => {
        alert('Inventory Category Added successfully');
        this.resetForm();
        this.getAllCategories();
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
  

  resetForm(): void {
    this.categoryForm.reset();
  };


  // addItem() {
  //   console.log(this.itemForm.value)
  //   this.itemInventoryService.createItemService(this.itemForm.value)
  //     .subscribe({
  //       next: (res) => {
  //         alert("Item Created")
  //         // this.router.navigate(['manageInventory'])
  //         this.itemForm.reset();
  //       },
  //       error: (err) => {
  //         console.log(err);
  //       }
  //     })
  // }

  addItem() {
    const formValue = this.itemForm.value;
    // Find the selected category name by ID
    const selectedCategory = this.categoriesArray.find(cat => cat._id === formValue.categoryId);
    if (selectedCategory) {
      formValue.categoryName = selectedCategory.categoryName;
    }

    this.itemInventoryService.createItemService(formValue).subscribe({
      next: (res) => {
        alert("Item Created");
        this.itemForm.reset();
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  getAllCategories() {
    this.inventoryCategoryService.getAllInventoryCategoryService().subscribe(
      (res) => {
        this.categoryData = res;
        this.categoriesArray = this.categoryData.data || []; // Ensure categoriesArray is always an array
        console.log("All categories:", this.categoriesArray); // Debug: Check if data is correct
      },
      (error) => {
        console.error("Error fetching categories:", error); // Debug: Log any errors
      }
    );
  }
  

}
