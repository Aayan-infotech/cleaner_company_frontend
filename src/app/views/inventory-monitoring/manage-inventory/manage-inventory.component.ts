import { Component, OnInit, inject, Input, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InventoryCategoryService } from '../../../services/inventory-category.service';
import { ItemInventoryService } from '../../../services/item-inventory.service';
import { OrderService } from '../../../services/order.service';
import { VanService } from '../../../services/van.service';

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

export interface Van {
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

  selectedImages: File[] = [];
  selectedPdfs: File[] = [];
  selectedVideos: File[] = [];


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
      partNumber: ['', Validators.required],
      categoryId: ['', Validators.required],
      maxQty: ['', Validators.required],
      minQty: ['', Validators.required],
      vanId: ['', Validators.required],
      inStock: ['', Validators.required],
      amtOrder: ['', Validators.required],
      forWarehouse: ['', Validators.required],
      addOrder: ['', Validators.required],
      cost: ['', Validators.required],
      price: ['', Validators.required],
      comment: ['', Validators.required],
      shortDes: ['', Validators.required],
      partDes: ['', Validators.required],
      Images: [''],
      pdfs: [''],
      videos: ['']

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

  // submit inventory category 
  submitCategory() {
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

  onFileChanged(event: any, type: string): void {
    const files = Array.from(event.target.files);

    if (type === 'Images') {
      if (files.length > 9) {
        alert('You can only select up to 9 images.');
        return;
      }
      this.selectedImages = files as File[];
    } else if (type === 'pdfs') {
      this.selectedPdfs = files as File[];
    } else if (type === 'videos') {
      this.selectedVideos = files as File[];
    }
    this.itemForm.patchValue({
      images: this.selectedImages.length > 0 ? this.selectedImages : null
    });
  }

  // submit inventory Item
  // submitItem() {
  //   if (!this.itemForm.valid) {
  //     alert('Please fill in all required fields and add at least one image.');
  //     return;
  //   }
  //   const formData = new FormData();
  //   formData.append('itemName', this.itemForm.get('itemName')?.value);
  //   formData.append('partNumber', this.itemForm.get('partNumber')?.value);
  //   formData.append('categoryId', this.itemForm.get('categoryId')?.value);
  //   formData.append('maxQty', this.itemForm.get('maxQty')?.value);
  //   formData.append('minQty', this.itemForm.get('minQty')?.value);
  //   formData.append('vanId', this.itemForm.get('vanId')?.value);
  //   formData.append('inStock', this.itemForm.get('inStock')?.value);
  //   formData.append('amtOrder', this.itemForm.get('amtOrder')?.value);
  //   formData.append('forWarehouse', this.itemForm.get('forWarehouse')?.value);
  //   formData.append('addOrder', this.itemForm.get('addOrder')?.value);
  //   formData.append('cost', this.itemForm.get('cost')?.value);
  //   formData.append('price', this.itemForm.get('price')?.value);
  //   formData.append('comment', this.itemForm.get('comment')?.value);
  //   formData.append('shortDes', this.itemForm.get('shortDes')?.value);
  //   formData.append('partDes', this.itemForm.get('partDes')?.value);

  //    // Append images
  //    this.selectedImages.forEach(file => {
  //     formData.append('Images', file, file.name);
  //   });

  //   // Append pdfs
  //   this.selectedPdfs.forEach(file => {
  //     formData.append('pdfs', file, file.name);
  //   });

  //   // Append videos
  //   this.selectedVideos.forEach(file => {
  //     formData.append('videos', file, file.name);
  //   });

  //   if(this.isEditMode && this.itemId ) {
  //     this.itemInventoryService.updateItemService(formData, this.itemId)
  //     .subscribe({
  //       next: () => {
  //         alert('Item update Successfully');
  //         this.resetForm();
  //         this.getAllItems();
  //       },
  //       error(err) {
  //         console.error('error updateing item:', err);
  //         alert('Failed to update item. Please try again');
  //       }
  //     });
  //   } else if (this.itemId) {
  //     this.itemInventoryService.createItemService(formData)
  //     .subscribe({
  //       next: () => {
  //         alert('Item added Successfully');
  //         this.resetForm();
  //         this.getAllItems();
  //       },
  //       error: (err) => {
  //         console.error('Error Adding item:', err);
  //         alert('Failed to adding item. Please try again.');
  //       }
  //     });
  //   }

  // }

  submitItem() {
    if (!this.selectedImages.length) {
      alert('Please add at least one image.');
      return;
    }

    const formData = new FormData();
    formData.append('itemName', this.itemForm.get('itemName')?.value);
    formData.append('partNumber', this.itemForm.get('partNumber')?.value);
    formData.append('categoryId', this.itemForm.get('categoryId')?.value);
    formData.append('maxQty', this.itemForm.get('maxQty')?.value);
    formData.append('minQty', this.itemForm.get('minQty')?.value);
    formData.append('vanId', this.itemForm.get('vanId')?.value);
    formData.append('inStock', this.itemForm.get('inStock')?.value);
    formData.append('amtOrder', this.itemForm.get('amtOrder')?.value);
    formData.append('forWarehouse', this.itemForm.get('forWarehouse')?.value);
    formData.append('addOrder', this.itemForm.get('addOrder')?.value);
    formData.append('cost', this.itemForm.get('cost')?.value);
    formData.append('price', this.itemForm.get('price')?.value);
    formData.append('comment', this.itemForm.get('comment')?.value);
    formData.append('shortDes', this.itemForm.get('shortDes')?.value);
    formData.append('partDes', this.itemForm.get('partDes')?.value);

    // Append images
    this.selectedImages.forEach(file => {
      formData.append('Images', file, file.name);
    });

    // Append PDFs and videos (optional)
    this.selectedPdfs.forEach(file => {
      formData.append('pdfs', file, file.name);
    });
    this.selectedVideos.forEach(file => {
      formData.append('videos', file, file.name);
    });

    // Check edit mode or new item creation
    if (this.isEditMode && this.itemId) {
      this.itemInventoryService.updateItemService(formData, this.itemId).subscribe({
        next: () => {
          alert('Item updated successfully');
          this.resetForm();
          this.getAllWarehouseItems();
          this.getAllVanItems();
          this.getAllItemsWithVanNames();
        },
        error: (err) => {
          console.error('Error updating item:', err);
          alert('Failed to update item. Please try again.');
        }
      });
    } else {
      this.itemInventoryService.createItemService(formData).subscribe({
        next: () => {
          alert('Item added successfully');
          this.resetForm();
          this.getAllWarehouseItems();
          this.getAllVanItems();
          this.getAllItemsWithVanNames();
        },
        error: (err) => {
          console.error('Error adding item:', err);
          alert('Failed to add item. Please try again.');
        }
      });
    }
  }


  // submit van 
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

  onCategoryChange(event: any) {
    const selectedCategoryId = event.target.value;
    const selectedCategory = this.categoriesArray.find(category => category._id === selectedCategoryId);
    if (selectedCategory) {
      this.itemForm.patchValue({
        categoryName: selectedCategory.categoryName
      });
    }
  }

  onVanChange(event: any) {
    const selectedVanId = event.target.value;
    const selectedVan = this.vanArray.find((van: Van) => van._id === selectedVanId);
    if (selectedVan) {
      this.itemForm.patchValue({
        vanName: selectedVan.vanName
      });
    }
  }

  // add order item
  addToOrder() {
    this.orderService.createItemOrderService(this.orderForm.value)
      .subscribe({
        next: (res) => {
          alert("Item Ordered");
          this.orderForm.reset();
        },
        error: (err) => {
          console.error("Error fetch item ordered", err);
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

  // all inventory categories
  getAllCategories() {
    this.inventoryCategoryService.getAllInventoryCategoryService().subscribe({
        next: (res) => {
          this.categoryData = res;
          this.categoriesArray = this.categoryData.data || [];
        },
        error: (error) => {
          console.error("Error fetching categories:", error);
        }
      });
  };

  // All inventory items
  getAllItems(): void {
    this.itemInventoryService.getAllItemsService().subscribe({
      next: (res) => {
        this.itemData = res;
        this.itemArray = this.itemData.data;
        console.log("Get all Items:", this.itemData);         
      },
      error: (err) => {
        console.error("Error fetch get all items", err);        
      }
    });
  };

  // get all vans
  getAllVans() {
    this.vanService.getAllVans()
      .subscribe({
        next: (res) => {
          this.vanData = res;
          this.vanArray = this.vanData.data || [];
          console.log("All vans:", this.vanData);
        },
        error: (error) => {
          console.error("Error fetching Vans:", error);
        }
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
        },
        error: (err) => {
          console.error("Error fetching warehouse items:", err);
        }
      });
  }

  // all van item list 
  getAllVanItems() {
    this.itemInventoryService.getAllItemsForVanService().subscribe({
        next: (res) => {
          this.vanItemsData = res;
          this.filterItems();
          console.log("All Van's Item data:", this.vanItemsData );          
        },
        error: (err) => {
          console.error("Error fetching van items:", err);
        }
      });
  };

  // Fetch all items that have vanName populated
  // getAllItemsWithVanNames() {
  //   this.itemInventoryService.getAllItemsForVansService()
  //     .subscribe({
  //       next: (res) => {
  //         this.vanNameItemData = res;
  //         // Only keep items where vanName is not null or empty
  //         this.vanNameItemArray = this.vanNameItemData.data.filter((item: Item) => item.vanName && item.vanName.trim() !== '');
  //         this.filterItems();
  //         console.log("Get all items with van namecvgdfgdffgdfdf:", this.vanNameItemData);  
  //       }
  //     });
  // }

  getAllItemsWithVanNames(): void {
    this.itemInventoryService.getAllItemsForVansService().subscribe({
      next: (res) => {
        this.vanNameItemData = res;
        this.vanNameItemArray = this.vanNameItemData.data.filter((item: Item) => item.vanName && item.vanName.trim() !== '');
        this.filterItems();
        console.log("Get all items with van name:", this.vanNameItemData);        
      },
      error: (err) => {
        console.error("Error fetch all items with van:", err);        
      }
    });
  };

  // get item by id 
  getItemById(id: any) {
    this.itemInventoryService.getItemByIdService(id)
      .subscribe(data => {
        this.editData = data;
        this.itemId = this.editData.data._id;
        this.itemForm.patchValue({
          itemName: this.editData.data.itemName,
          partNumber: this.editData.data.partNumber,
          categoryId: this.editData.data.categoryId,
          maxQty: this.editData.data.maxQty,
          minQty: this.editData.data.minQty,
          vanId: this.editData.data.vanId,
          inStock: this.editData.data.inStock,
          amtOrder: this.editData.data.amtOrder,
          forWarehouse: this.editData.data.forWarehouse,
          addOrder: this.editData.data.addOrder,
          cost: this.editData.data.cost,
          price: this.editData.data.price,
          comment: this.editData.data.comment,
          shortDes: this.editData.data.shortDes,
          partDes: this.editData.data.partDes,
          Images: this.editData.data.Images,
          pdfs: this.editData.data.pdfs,
          videos: this.editData.data.videos

        });
        this.isEditMode = true;
      });
  }

  // update item's details by ID 
  updateItem(itemId: string, updatedData: any): void {


    if (!itemId) {
      console.error('Invalid itemId:', itemId);
      alert('Invalid item ID. Please ensure you have selected a valid item to update.');
      return; // Exit early if the ID is invalid
    }



    this.itemInventoryService.updateItemService(updatedData, itemId)
      .subscribe({
        next: (updatedItem) => {

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
            this.getAllItems();
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

  // transfer from van
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
