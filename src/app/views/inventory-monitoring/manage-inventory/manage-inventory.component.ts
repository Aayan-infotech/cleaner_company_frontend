import { Component, OnInit, inject, Input, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InventoryCategoryService } from '../../../services/inventory-category.service';
import { ItemInventoryService } from '../../../services/item-inventory.service';
import { OrderService } from '../../../services/order.service';
import { VanService } from '../../../services/van.service';
import { HotToastService } from '@ngxpert/hot-toast';
import { TroubleCategoryService } from '../../../services/trouble-category.service';
import { ItemInventoryTransferService } from '../../../services/item-inventory-transfer.service';

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
  inventoryCategoryService = inject(InventoryCategoryService);  // not in Use
  categoryService = inject(TroubleCategoryService);

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
  toast = inject(HotToastService);

  orderService = inject(OrderService);
  editData: any;

  public isEditMode = false;
  isViewClicked = false;
  showSaveChanges = true;

  pageSize: number = 5;
  totalItems: number = 0;
  currentPage: number = 1;
  isFetching: boolean = false;
  items: any[] = [];

  // filter by category
  selectedCategory: string = '';

  selectedCategoryId: string = '';
  allItems: any[] = [];

  latestOrderStatuses: { [key: string]: string } = {};

  // transfer item section
  transfers: any[] = [];
  selectedTransfer: any = null;
  loading: boolean = false;
  

  // start inventory item 
  public visibleItem = false;

  toggleLiveDemoItem() {
    this.visibleItem = !this.visibleItem;
  }

  handleLiveDemoChangeItem(event: any) {
    this.visibleItem = event;
  }

  openAddItemModal() {
    this.isEditMode = false;
    this.itemId = null;
    this.isViewClicked = false;

    // Reset form fields
    this.itemForm.reset();

    // Reset file arrays
    this.selectedImages = [];
    this.selectedPdfs = [];
    this.selectedVideos = [];

    // Finally, open modal
    this.toggleLiveDemoItem();
  }

  //  start van
  public visibleVan = false;

  toggleLiveDemoVan() {
    this.visibleVan = !this.visibleVan;
    if (this.visibleVan) this.resetForm();
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

  constructor(
    private cdr: ChangeDetectorRef,
    private transferService: ItemInventoryTransferService,
  ) { }

  ngOnInit(): void {

    this.itemForm = this.fb.group({
      itemName: ['', Validators.required],
      partNumber: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      categoryId: ['', Validators.required],
      maxQty: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      minQty: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      // vanId: ['', Validators.required],
      inStock: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      amtOrder: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      forWarehouse: [false, Validators.requiredTrue],
      addOrder: [false, Validators.requiredTrue],
      cost: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      price: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      comment: ['', [Validators.required, Validators.maxLength(80)]],
      shortDes: ['', [Validators.required, Validators.maxLength(60)]],
      partDes: ['', [Validators.required, Validators.maxLength(50)]],
      Images: [''],
      pdfs: [''],
      videos: ['']

    });

    this.vanForm = this.vanFb.group({
      vanName: ['', Validators.required]
    });

    this.orderForm = this.fb.group({
      requestedQuantity: ['', Validators.required],
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
    this.getAllTransferItems()
  }

  onFileChanged(event: any, type: string): void {
    const files = Array.from(event.target.files);

    if (type === 'Images') {
      if (files.length > 9) {
        this.toast.error('You can only select up to 9 images');
        event.target.value = '';
        return;
      }
      this.selectedImages = files as File[];
      this.itemForm.patchValue({
        Images: this.selectedImages
      });

      this.toast.success(`${this.selectedImages.length} image(s) selected`);

    } else if (type === 'pdfs') {
      this.selectedPdfs = files as File[];
      this.itemForm.patchValue({ pdfs: this.selectedPdfs });
      this.toast.success(`${this.selectedPdfs.length} PDF(s) selected`);

    } else if (type === 'videos') {
      this.selectedVideos = files as File[];
      this.itemForm.patchValue({ videos: this.selectedVideos });
      this.toast.success(`${this.selectedVideos.length} video(s) selected`);
    }

    this.itemForm.patchValue({
      images: this.selectedImages.length > 0 ? this.selectedImages : null
    });
  }

  // submit inventory Item
  submitItem() {

    if (this.itemForm.invalid) {
      this.toast.warning('Please fill all required fields');
      return;
    }

    const formData = new FormData();
    formData.append('itemName', this.itemForm.get('itemName')?.value);
    formData.append('partNumber', this.itemForm.get('partNumber')?.value);
    formData.append('categoryId', this.itemForm.get('categoryId')?.value);
    formData.append('maxQty', this.itemForm.get('maxQty')?.value);
    formData.append('minQty', this.itemForm.get('minQty')?.value);
    // formData.append('vanId', this.itemForm.get('vanId')?.value);
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
      this.itemInventoryService.updateItemService(formData, this.itemId)
        .pipe(
          this.toast.observe({
            loading: 'Updating item... ⏳',
            success: 'Item updated successfully',
            error: (err: any) => err.error?.message || 'Failed to update item'
          })
        )
        .subscribe({
          next: () => {
            this.resetForm();
            this.getAllWarehouseItems();
            this.getAllVanItems();
            this.getAllItemsWithVanNames();
            this.getAllTransferItems(); 
          },
          error: (err) => {
            console.error('Error updating item:', err);
          }
        });
    } else {
      this.itemInventoryService.createItemService(formData)
        .pipe(
          this.toast.observe({
            loading: 'Adding item... ⏳',
            success: 'Item added successfully',
            error: (err: any) => err.error?.message || 'Failed to add item'
          })
        )
        .subscribe({
          next: () => {
            this.resetForm();
            this.getAllWarehouseItems();
            this.getAllVanItems();
            this.getAllItemsWithVanNames();
            this.getAllItems();
          },
          error: (err) => {
            console.error('Error adding item:', err);
          }
        });
    }
  }

  // submit van 
  onAddVanClick() {
    if (!this.vanForm.valid) {
      this.toast.warning('Please fill all required fields');
      return;
    }

    const vanObj = {
      vanName: this.vanForm.get('vanName')?.value
    };

    this.vanService.createVanService(vanObj)
      .pipe(
        this.toast.observe({
          loading: 'Adding van... ⏳',
          success: 'Van added successfully!',
          error: (err: any) => err.error?.message || 'Failed to add van',
        })
      )
      .subscribe(() => {
        this.resetForm();
        this.getAllVans();
        this.toggleLiveDemoVan();
      });
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

  // Add order item Request
  addToOrder(itemId: string): void {
    if (this.orderForm.invalid) {
      this.toast.warning("Please enter a valid quantity");
      return;
    }

    const requestedQuantity = this.orderForm.value.requestedQuantity;

    this.orderService.createOrderItemService(itemId, requestedQuantity)
      .pipe(
        this.toast.observe({
          loading: 'Placing order... ⏳',
          success: 'Item ordered successfully',
          error: (err: any) => err.error?.message || 'Failed to place order'
        })
      )
      .subscribe({
        next: (res) => {
          if (res?.data) {
            const order = res.data;
            this.latestOrderStatuses[order.itemId] = order.status;
          }
          this.orderForm.reset();
        },
        error: (err) => {
          console.error("Error while ordering item", err);
        }
      });
  }

  // Transfer Item's qty
  transferItemInventory(itemId: string, inStock: number, minQty: number) {
    if (!this.selectedVanId) {
      this.toast.warning('Please select a van to transfer to');
      return;
    }
    if (!this.transferQuantity || this.transferQuantity <= 0) {
      this.toast.warning('Please enter a valid quantity to transfer');
      return;
    }
    if (this.transferQuantity > inStock) {
      this.toast.error('Not enough stock in warehouse');
      return;
    }
    if (inStock - this.transferQuantity < minQty) {
      this.toast.error(`Transfer not allowed. At least ${minQty} items must remain in warehouse`);
      return;
    }
  
    const payload = {
      itemId: itemId,
      vanId: this.selectedVanId,
      quantity: this.transferQuantity
    };
  
    this.transferService.transferToVanService(payload)
      .pipe(
        this.toast.observe({
          loading: 'Transferring item... ⏳',
          success: 'Item transferred successfully',
          error: (err: any) => err?.error?.message || 'Failed to transfer item'
        })
      )
      .subscribe({
        next: () => {
          this.resetForm();
          this.getAllWarehouseItems();  
          this.getAllVanItems();         
          this.getAllItemsWithVanNames(); 
          this.getAllTransferItems();    
          this.toggleLiveDemo2(itemId); 
        },
        error: (err) => {
          console.error('Error transferring item:', err);
        }
      });
  }

  clickAddMember() {
    this.resetForm();
  }

  resetForm(): void {
    this.vanForm.reset();
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
    this.categoryService.getAllCategoryService().subscribe({
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
  getAllItems(page: number = 1): void {
    this.isFetching = true;

    this.itemInventoryService.getAllItemsWithPaginatedService(page, this.pageSize).subscribe({
      next: (res) => {
        this.allItems = res.data || [];
        this.itemArray = [...this.allItems];
        this.totalItems = res.pagination?.total || 0;
        this.currentPage = res.pagination?.page || 1;
        this.isFetching = false;
      },
      error: (err) => {
        console.error("Error fetch get all items", err);
        this.isFetching = false;
      }
    });
  };

  // Total number of pages
  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  // Create an array for pagination buttons
  totalPagesArray(): number[] {
    return Array(this.totalPages)
      .fill(0)
      .map((_, i) => i + 1);
  }

  // Change to a different page
  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.getAllItems(page);
    }
  }


  // get all vans
  getAllVans() {
    this.vanService.getAllVans()
      .subscribe({
        next: (res) => {
          this.vanData = res;
          this.vanArray = this.vanData.data || [];
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

  onCategorySelect(event: Event): void {
    const selectedId = (event.target as HTMLSelectElement).value;
    this.selectedCategoryId = selectedId;

    if (selectedId === 'all') {
      // Show all items
      this.itemArray = [...this.allItems];
    } else {
      // Filter by category
      this.itemArray = this.allItems.filter(item => item.categoryId?._id === selectedId);
    }
  }

  // all warehouse item list
  getAllWarehouseItems() {
    this.itemInventoryService.getAllItemsForWarehouseService()
      .subscribe({
        next: (res) => {
          this.warehouseItemsData = res;
          this.filterItems();
          this.getAllItems();
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
        this.getAllItems();
      },
      error: (err) => {
        console.error("Error fetching van items:", err);
      }
    });
  };

  // Fetch all items that have vanName populated
  getAllItemsWithVanNames(): void {
    this.itemInventoryService.getAllItemsForVansService().subscribe({
      next: (res) => {
        this.vanNameItemData = res;
        this.vanNameItemArray = this.vanNameItemData.data.filter((item: Item) => item.vanName && item.vanName.trim() !== '');
        this.filterItems();
      },
      error: (err) => {
        console.error("Error fetch all items with van:", err);
      }
    });
  };

  // Get all transfer Item Inventory
  getAllTransferItems(): void {
    this.transferService.getAllTransfersService().subscribe({
      next: (res) => {
        const rawTransfers = res?.data || [];
  
        // Flatten transfers into a simple array for table
        this.transfers = rawTransfers.flatMap((transfer: any) =>
          (transfer.items || []).map((itemWrapper: any) => {
            const item = itemWrapper.itemId || {};
            const category = item.categoryId || {};
  
            return {
              transferId: transfer._id,
              vanId: transfer.vanId?._id,
              vanName: transfer.vanId?.vanName || 'N/A',
  
              itemId: item._id,
              itemName: item.itemName,
              partNumber: item.partNumber,
  
              categoryId: category._id,
              categoryName: category.categoryName || 'N/A',
  
              minimumQuantity: item.minQty,
              totalQuantity: item.inStock,
              maxQty: item.maxQty,
  
              qtyTransferred: itemWrapper.qty,
  
              cost: item.cost,
              price: item.price,
  
              createdAt: transfer.createdAt,
              updatedAt: transfer.updatedAt
            };
          })
        );
  
        console.log("Flattened Transfers for Table:", this.transfers);
      },
      error: (err) => {
        this.toast.error(err?.error?.message || 'Failed to fetch transfers');
      }
    });
  }
  
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
          // vanId: this.editData.data.vanId,
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

  // Get transfer by ID
  getTransferById(id: string): void {
    this.transferService.getTransferByIdService(id).subscribe({
      next: (res) => {
        this.selectedTransfer = res?.data;
      },
      error: (err) => {
        this.toast.error(err?.error?.message || 'Transfer not found');
      }
    });
  };

  // Update item's details by ID 
  updateItem(itemId: string, updatedData: any): void {

    if (!itemId) {
      console.error('Invalid itemId:', itemId);
      this.toast.error('Invalid item ID. Please ensure you have selected a valid item to update.');
      return;
    }

    this.itemInventoryService.updateItemService(updatedData, itemId)
      .pipe(
        this.toast.observe({
          loading: 'Updating item... ⏳',
          success: 'Item updated successfully',
          error: (err: any) => err?.error?.message || 'Failed to update item',
        })
      )
      .subscribe({
        next: (updatedItem) => {

          this.getAllItems();
          this.resetForm();
        },
        error: (err) => {
          console.error('Error updating item:', err);
        }
      });
  }

  // Delete category by ID
  delteInventoryCategoryByID(id: any) {

    this.inventoryCategoryService.deleteInventoryCategoryService(id)
      .pipe(
        this.toast.observe({
          loading: 'Deleting category... ⏳',
          success: 'Category deleted successfully',
          error: (err: any) => err?.error?.message || 'Failed to delete category',
        })
      )
      .subscribe({
        next: (res) => {
          this.getAllCategories();
        },
        error: (err) => {
          console.error('Failed to deleting Category:', err);
        }
      });
  }

  // Delete Item by ID
  deleteItem(id: any) {
    this.itemInventoryService.deleteItemService(id)
      .pipe(
        this.toast.observe({
          loading: 'Deleting item... ⏳',
          success: 'Item deleted successfully',
          error: (err: any) => err?.error?.message || 'Failed to delete item',
        })
      )
      .subscribe({
        next: (res) => {
          this.getAllWarehouseItems();
          this.getAllVanItems();
          this.getAllItemsWithVanNames();
          this.getAllItems();
        },
        error: (err) => {
          console.error('Failed to deleting Item:', err);
        }
      });
  }

  // Delete transfer by ID
  deleteTransfer(id: string): void {
    this.transferService.deleteTransferByIdService(id)
      .pipe(
        this.toast.observe({
          loading: 'Deleting Transfer item... ⏳',
          success: 'Item deleted successfully',
          error: (err: any) => err?.error?.message || 'Failed to delete item',
        })
      )
      .subscribe({
        next: (res) => {
          this.getAllTransferItems();
        },
        error: (err) => {
          console.error("Error fetch Delete transfer Item", err);
        }
      });
  };

  // transfer from warehouse
  transferItem(warehouseId: string, totalQuantity: number, minimumQuantity: number) {
    if (!this.selectedVanId || this.transferQuantity <= 0) {
      this.toast.warning(
        !this.selectedVanId ? 'Please select a van to transfer to' : 'Please enter a valid quantity to transfer'
      );
      return;
    }

    const availableQuantity = totalQuantity - minimumQuantity;

    if (this.transferQuantity > availableQuantity) {
      this.toast.warning(
        `Cannot transfer more than ${availableQuantity}. Minimum reserved: ${minimumQuantity}`
      );
      return;
    }

    const transferData = {
      sourceItemId: warehouseId,
      destinationVanId: this.selectedVanId,
      transferQuantity: this.transferQuantity
    };

    this.itemInventoryService.transferItemService(transferData)
      .pipe(
        this.toast.observe({
          loading: 'Transferring item... ⏳',
          success: 'Item transferred successfully',
          error: (err: any) => err.error?.message || 'Failed to transfer item '
        })
      )
      .subscribe({
        next: () => {
          this.resetForm();
          this.getAllWarehouseItems();
          this.getAllItemsWithVanNames();
          this.toggleLiveDemo2(warehouseId);
        },
        error: (err) => {
          console.error('Error transferring item:', err);
        }
      });
  };

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
