import { Component, OnInit, inject, Input, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InventoryCategoryService } from 'src/app/services/inventory-category.service';
import { ItemInventoryService } from 'src/app/services/item-inventory.service';
import { OrderService } from 'src/app/services/order.service';
import { VanService } from 'src/app/services/van.service';


export interface Item {
  categoryName: string;
  itemName: string;
  itemID: string;
  totalQuantity: number;
  minimumQuantity: number;
  vanName?: string | null;
  forWarehouse?: boolean;
  comment?: string;
}

interface Van {
  _id: string;
  vanName: string;
}

@Component({
  selector: 'app-manage-inventory',
  standalone: false,
  templateUrl: './manage-inventory.component.html',
  styleUrls: ['./manage-inventory.component.scss']
})

export class ManageInventoryComponent implements OnInit {

  transferQuantity: number = 0;
  selectedVanId: string | null = null;


  destinationVanId: string | null = null;


  @Input() itemId: string | null = null;

  categoryfb = inject(FormBuilder);
  inventoryCategoryService = inject(InventoryCategoryService);
  categoryForm!: FormGroup;
  categoryData!: any;
  categoriesArray: any[] = [];

  fb = inject(FormBuilder);
  itemInventoryService = inject(ItemInventoryService);
  itemForm!: FormGroup;
  itemData!: any;
  itemArray!: any;

  warehouseItemsArray: Item[] = [];
  warehouseItemsData!: any;

  vanItemsArray: Item[] = [];
  vanItemsData!: any;
  vanNameItemData!: any;
  vanNameItemArray!: any;

  vanFb = inject(FormBuilder);
  vanService = inject(VanService);
  vanForm!: any;
  vanData!: any;
  vanArray!: any;


  itemfb = inject(FormBuilder);

  router = inject(Router);
  orderForm!: FormGroup;

  editItem!: any;

  searchText!: any;

  public visible = false;

  orderService = inject(OrderService);
  editData: any;

  public isEditMode = false;
  isViewClicked = false;
  showSaveChanges = true;

  // filter by category
  selectedCategory: string = '';

  constructor(private cdr: ChangeDetectorRef) { }

  // start category
  public visiblecategory = false;

  toggleLiveDemoCategory() {
    this.visiblecategory = !this.visiblecategory;
  }

  handleLiveDemoChangeCategory(event: any) {
    this.visiblecategory = event;
  }

  // start inventory item 
  public visibleItem = false;

  toggleLiveDemoItem() {
    this.visibleItem = !this.visibleItem;
  }

  handleLiveDemoChangeItem(event: any) {
    this.visibleItem = event;
  }

  //  start van
  public visibleVan = false;

  toggleLiveDemoVan() {
    this.visibleVan = !this.visibleVan;
  }

  handleLiveDemoChangeVan(event: any) {
    this.visibleVan = event;
  }

  // start transfer

  visible2: { [key: string]: boolean } = {};

  toggleLiveDemo2(warehouseId: string) {
    this.visible2[warehouseId] = !this.visible2[warehouseId];
  }

  handleLiveDemoChange2(event2: any, warehouseId: string) {
    this.visible2[warehouseId] = event2;
  }

  visibleVan2: { [key: string]: boolean } = {};

  toggleLiveDemoVan2(vanId: string) {
    this.visibleVan2[vanId] = !this.visibleVan2[vanId];
  }

  handleLiveDemoChange2Van2(event2: any, vanID: string) {
    this.visibleVan2[vanID] = event2;
  }
  // end transfer

  // start order
  toggleLiveDemo() {
    this.visible = !this.visible;
  }

  handleLiveDemoChange(event: any) {
    this.visible = event;
  }
  // end order

  ngOnInit(): void {

    this.categoryForm = this.categoryfb.group({
      categoryName: ['', Validators.required]
    });

    this.itemForm = this.fb.group({
      itemName: ['', Validators.required],
      itemID: ['', Validators.required],
      categoryId: ['', Validators.required],
      categoryName: ['', Validators.required],
      totalQuantity: ['', Validators.required],
      minimumQuantity: ['', Validators.required],
      vanId: ['', Validators.required],
      vanName: ['', Validators.required],
      forWarehouse: [false],
      comment: ['', Validators.required]
    });

    this.vanForm = this.vanFb.group({
      vanName: ['', Validators.required]
    });

    this.orderForm = this.fb.group({
      orderQuantity: ['', Validators.required],
      itemInfo: ['']
    });

    if (this.itemId) {
      this.getItemById(this.itemId);
    }

    this.getAllCategories();
    this.getAllItems();
    this.getAllWarehouseItems();
    this.getAllVanItems();
    this.getAllVans();
    this.getAllItemsWithVanNames();
  }

  // category data submit
  submitCategory() {
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

  submitVan() {
    if (this.vanForm.valid) {
      const vanObj = {
        vanName: this.vanForm.get('vanName')?.value
      };

      this.vanService.createVanService(vanObj)
        .subscribe({
          next: (res) => {
            alert('Van added successfully');
            this.resetForm();
            this.getAllVans();
          },
          error: (err) => {
            console.error('Error adding van:', err);
          }
        });
    } else {
      console.log('Invalid form');
    }
  }

  // add item from
  submitItem() {
    const formValue = this.itemForm.value;
    const selectedCategory = this.categoriesArray.find(cat => cat._id === formValue.categoryId);
    if (selectedCategory) {
      formValue.categoryName = selectedCategory.categoryName;
    }

    // Check if itemId is valid for updating
    if (this.itemId) {
      console.log("Updating item with ID:", this.itemId);
      this.itemInventoryService.updateItemService(formValue, this.itemId)
        .subscribe({
          next: (res) => {
            alert('Item details Updated successfully');
            this.resetForm();
            this.getAllWarehouseItems();
            this.getAllVanItems();
            this.getAllItemsWithVanNames();
          },
          error: (err) => {
            console.error('Error updating item:', err);
          }
        });
    } else {
      console.log("Adding new item");

      // Add new item
      this.itemInventoryService.createItemService(formValue)
        .subscribe({
          next: (res) => {
            alert('Item Added successfully');
            this.resetForm();
            this.getAllWarehouseItems();
            this.getAllVanItems();
            this.getAllItemsWithVanNames();
          },
          error: (err) => {
            console.error('Error adding new item:', err);
          }
        });
    }

    console.log("Item ID after submit attempt:", this.itemId);
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

  onVanChange(event: Event) {
    const selectedVanId = (event.target as HTMLSelectElement).value;
    const selectedVan = this.vanArray.find((van: { _id: string; }) => van._id === selectedVanId);
    if (selectedVan) {
      this.itemForm.patchValue({
        vanName: selectedVan.vanName
      });
    }
  }

  // add order item
  addToOrder() {
    console.log(this.orderForm.value);
    this.orderService.createItemOrderService(this.orderForm.value)
      .subscribe({
        next: (res) => {
          alert("Item Ordered");
          this.orderForm.reset();
        },
        error: (err) => {
          console.log(err);
        }
      });
  }

  clickAddMember() {
    this.resetForm();
  }

  resetForm(): void {
    this.categoryForm.reset();
    this.itemForm.reset();
    this.itemId = null;
    this.isEditMode = false;
    this.isViewClicked = false;
    this.showSaveChanges = true;
    this.transferQuantity = 0;
    this.selectedVanId = null;
  };

  // all categories list
  getAllCategories() {
    this.inventoryCategoryService.getAllInventoryCategoryService()
      .subscribe({
        next: (res) => {
          this.categoryData = res;
          this.categoriesArray = this.categoryData.data || [];
          console.log("All categories:", this.categoriesArray);
        },
        error: (error) => {
          console.error("Error fetching categories:", error);
        }
      });
  }

  // get all vans
  getAllVans() {
    this.vanService.getAllVans()
      .subscribe({
        next: (res) => {
          console.log("Response Data:", res);
          this.vanData = res;
          this.vanArray = this.vanData.data || [];
          this.cdr.detectChanges();
          console.log("All Vans:", this.vanArray);
        }
      });
  }

  // all inventories list
  getAllItems() {
    this.itemInventoryService.getAllItemsService()
      .subscribe((res) => {
        this.itemData = res;
        this.itemArray = this.itemData.data;
        console.log("All Inventory Items Name:", this.itemArray);
      });
  }

  // filtered by category
  filterItems() {
    if (this.warehouseItemsData && this.warehouseItemsData.data) {
      this.warehouseItemsArray = this.selectedCategory
        ? this.warehouseItemsData.data.filter((item: Item) => item.categoryName === this.selectedCategory)
        : this.warehouseItemsData.data;
    } else {
      this.warehouseItemsArray = [];
    }

    if (this.vanNameItemData && this.vanNameItemData.data) {
      this.vanNameItemArray = this.selectedCategory
        ? this.vanNameItemData.data.filter((item: Item) => item.categoryName === this.selectedCategory)
        : this.vanNameItemData.data;
    } else {
      this.vanNameItemArray = [];
    }

    this.cdr.detectChanges();
  }

  onCategorySelect(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedCategory = target.value;
    this.filterItems();
  }

  // all warehouse item list
  getAllWarehouseItems() {
    this.itemInventoryService.getAllItemsForWarehouseService()
      .subscribe({
        next: (res) => {
          this.warehouseItemsData = res;
          this.filterItems();
          console.log("All Warehouse Items:", this.warehouseItemsData);
        },
        error: (err) => {
          console.error("Error fetching warehouse items:", err);
        }
      });
  }

  // all van item list 
  getAllVanItems() {
    this.itemInventoryService.getAllItemsForVanService()
      .subscribe({
        next: (res) => {
          this.vanItemsData = res;
          this.filterItems();
          console.log("All Van Items:", this.vanItemsData);
        },
        error: (err) => {
          console.error("Error fetching van items:", err);
        }
      });
  }

  // Fetch all items that have vanName populated
  getAllItemsWithVanNames() {
    this.itemInventoryService.getAllItemsForVansService()
      .subscribe({
        next: (res) => {
          this.vanNameItemData = res;
          // Only keep items where vanName is not null or empty
          this.vanNameItemArray = this.vanNameItemData.data.filter((item: Item) => item.vanName && item.vanName.trim() !== '');
          this.filterItems();
          console.log("All items with non-empty vanName:", this.vanNameItemArray);
        }
      });
  }

  // get item by id 
  getItemById(id: any) {
    this.itemInventoryService.getItemByIdService(id)
      .subscribe(data => {
        this.editData = data;
        console.log("Fetched item data:", this.editData.data);
        this.itemId = this.editData.data._id;
        this.itemForm.patchValue({
          itemName: this.editData.data.itemName,
          itemID: this.editData.data.itemID,
          categoryId: this.editData.data.categoryId,
          categoryName: this.editData.data.categoryName,
          totalQuantity: this.editData.data.totalQuantity,
          minimumQuantity: this.editData.data.minimumQuantity,
          forVan: this.editData.data.forVan,
          forWarehouse: this.editData.data.forWarehouse,
          comment: this.editData.data.comment
        });
        this.isEditMode = true;
        console.log("Item ID set to:", this.itemId);
      });
  }

  // update item's details by ID 
  updateItem(itemId: string, updatedData: any): void {
    console.log('Updating item with ID:', itemId); // Log the itemId being used

    if (!itemId) {
      console.error('Invalid itemId:', itemId);
      alert('Invalid item ID. Please ensure you have selected a valid item to update.');
      return; // Exit early if the ID is invalid
    }

    console.log('Updated Data:', updatedData);

    this.itemInventoryService.updateItemService(updatedData, itemId)
      .subscribe({
        next: (updatedItem) => {
          console.log('Item updated:', updatedItem);
          alert('Item updated successfully');
          this.getAllItems();
          this.resetForm();
        },
        error: (err) => {
          console.error('Error updating item:', err);
        }
      });
  }

  // delete category by ID
  delteInventoryCategoryByID(id: any) {
    if (confirm('Are you sure you want to delete this category?')) {
      this.inventoryCategoryService.deleteInventoryCategoryService(id)
        .subscribe({
          next: (res) => {
            alert('Category deleted successfully');
            this.getAllCategories();
          },
          error: (err) => {
            console.error(err);
            console.error('Failed to deleting Category:', err);
          }
        });
    }
  }

  // Delete Item by ID
  deleteItem(id: any) {
    if (confirm('Are you sure you want to delete this Item?')) {
      this.itemInventoryService.deleteItemService(id)
        .subscribe({
          next: (res) => {
            alert('Item deleted successfully');
            this.getAllWarehouseItems();
            this.getAllVanItems();
            this.getAllItemsWithVanNames();
          },
          error: (err) => {
            console.error(err);
            console.error('Failed to deleting Item:', err);
          }
        });
    }
  }

  // transfer from warehouse
  transferItem(warehouseId: string, totalQuantity: number, minimumQuantity: number) {
    if (!this.selectedVanId || this.transferQuantity <= 0) {
      alert(!this.selectedVanId ? 'Please select a van to transfer to.' : 'Please enter a valid quantity to transfer.');
      return;
    }

    const availableQuantity = totalQuantity - minimumQuantity;
    if (this.transferQuantity > availableQuantity) {
      alert(`Cannot transfer more than ${availableQuantity}. Minimum reserved: ${minimumQuantity}.`);
      return;
    }

    const transferData = {
      sourceItemId: warehouseId,
      destinationVanId: this.selectedVanId,
      transferQuantity: this.transferQuantity
    };

    this.itemInventoryService.transferItemService(transferData).subscribe({
      next: () => {
        alert('Item transferred successfully');
        this.resetForm();
        this.getAllWarehouseItems();
        this.getAllItemsWithVanNames();
        this.toggleLiveDemo2(warehouseId);
      },
      error: (err) => {
        console.error('Error transferring item:', err);
        alert('Error transferring item. Please try again.');
      }
    });
  }

  // tyransfer from van
  transferItemToVan(vanId: string, totalQuantity: number, minimumQuantity: number) {
    if (!this.selectedVanId || this.transferQuantity <= 0) {
      alert(!this.selectedVanId ? 'Please select a van to transfer to.' : 'Please enter a valid quantity to transfer.');
      return;
    }

    const availableQuantity = totalQuantity - minimumQuantity;
    if (this.transferQuantity > availableQuantity) {
      alert(`Cannot transfer more than ${availableQuantity}. Minimum reserved: ${minimumQuantity}.`);
      return;
    }

    const transferItemData = {
      sourceItemId: vanId,
      destinationVanId: this.selectedVanId,
      transferQuantity: this.transferQuantity
    };

    this.itemInventoryService.transferItemToVanService(transferItemData)
    .subscribe({
      next: () => {
        alert('Item transferred successfully');
        this.resetForm();
        this.getAllWarehouseItems();
        this.getAllItemsWithVanNames();
        this.toggleLiveDemoVan2(vanId);
      },
      error: (err) => {
        console.error('Error transferring item:', err);
        alert('Error transferring item. Please try again.');
      }
    });
  }
  
  
  


}
