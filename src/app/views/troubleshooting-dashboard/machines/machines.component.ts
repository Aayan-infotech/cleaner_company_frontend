import { Component, OnInit, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TroubleCategoryService } from '../../../services/trouble-category.service'
import { CategoryItemService } from '../../../services/category-item.service';
import { HotToastService } from '@ngxpert/hot-toast';

@Component({
  selector: 'app-machines',
  templateUrl: './machines.component.html',
  styleUrls: ['./machines.component.scss']
})

export class MachinesComponent implements OnInit {

  selectedSection: string = 'shortDescription';

  toggleSection(section: string) {
    this.selectedSection = section;
  }

  itemsId: string | null = null;
  categoryId: string | null = null;
  categoryName: string | null = null;
  route = inject(ActivatedRoute);

  fb = inject(FormBuilder);
  categoryItemService = inject(CategoryItemService);
  itemsForm!: FormGroup;
  itemsData: any;
  itemsArray!: any[];
  router = inject(Router);
  editData: any;

  public isEditMode = false;
  isViewClicked = false;

  selectedImages: File[] = [];
  selectedPdfs: File[] = [];
  selectedVideos: File[] = [];

  itemsImage: any;
  showSaveChanges = true;

  searchTerm: string = '';

  troubleCategoryService = inject(TroubleCategoryService);
  toast = inject(HotToastService);
  public visible = false;

  toggleLiveDemo() {
    this.visible = !this.visible;
  }

  handleLiveDemoChange(event: any) {
    this.visible = event;
  }

  visibleEdit: { [key: string]: boolean } = {};

  toggleLiveDemoEdit(itemId: string) {
    this.visibleEdit[itemId] = !this.visibleEdit[itemId];
  }

  handleLiveDemoChangeEdit(event: any, itemId: string) {
    this.visibleEdit[itemId] = event;
  }

  ngOnInit(): void {
    this.itemsForm = this.fb.group({
      name: ['', Validators.required],
      partNumber: ['', Validators.required],
      shortDescription: ['', Validators.required],
      partDescription: ['', Validators.required],
      images: [''],
      pdfs: [''],
      videos: ['']
    });

    this.route.paramMap.subscribe(params => {
      this.categoryId = params.get('categoryId');
      this.itemsId = params.get('itemId');
      console.log('Category ID:', this.categoryId);

      if (this.categoryId) {
        this.getCategoryNameById(this.categoryId);
      }

      if (this.itemsId) {
        this.getItemById(this.itemsId);
      }
      this.getAllItems();
      this.loadImages();
    });
  }

  // get categoryName using categoryId
  getCategoryNameById(categoryId: string) {
    this.troubleCategoryService.getCategoryByID(categoryId)
      .subscribe({
        next: (res) => {
          this.categoryName = res.data.categoryName;
          console.log('Category Name:', this.categoryName);
        },
        error: (err) => {
          console.error('Error fetching category name:', err);
        }
      });
  }

  onFileChanged(event: any, type: string): void {
    const files = Array.from(event.target.files);

    if (type === 'images') {
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
    this.itemsForm.patchValue({
      images: this.selectedImages.length > 0 ? this.selectedImages : null
    });
  }


  // Submit form data
  submit() {
    if (!this.itemsForm.valid) {
      this.toast.warning('Please fill in all required fields and add at least one image ⚠️');
      return;
    }

    const formData = new FormData();
    formData.append('name', this.itemsForm.get('name')?.value);
    formData.append('partNumber', this.itemsForm.get('partNumber')?.value);
    formData.append('shortDescription', this.itemsForm.get('shortDescription')?.value);
    formData.append('partDescription', this.itemsForm.get('partDescription')?.value);

    // Append images
    this.selectedImages.forEach(file => {
      formData.append('images', file, file.name);
    });

    // Append pdfs
    this.selectedPdfs.forEach(file => {
      formData.append('pdfs', file, file.name);
    });

    // Append videos
    this.selectedVideos.forEach(file => {
      formData.append('videos', file, file.name);
    });

    if (this.isEditMode && this.itemsId && this.categoryId) {
      this.categoryItemService.updateItemByIdService(this.categoryId, this.itemsId, formData)
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
            this.getAllItems();
          },
          error: (err) => {
            console.error('Error updating item:', err);
            alert('Failed to update item. Please try again.');
          }
        });
    } else if (this.categoryId) {
      this.categoryItemService.createItemService(this.categoryId, formData)
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
            this.getAllItems();
          },
          error: (err) => {
            console.error('Error creating item:', err);
          }
        });
    }
  }

  images: string[] = [
    'assets/images/cleaningtip.jpg',
    'assets/images/default-image.jpg',
    'assets/images/cleaningtip.jpg',
    'assets/images/disinfection-equipment-table.jpg',
    'assets/images/DIY.jpg',
    'assets/images/files.jpg',
    'assets/images/cleaningtip.jpg',
    'assets/images/guide.jpg',
    'assets/images/cleaningtip.jpg',

    'assets/images/DIY.jpg',
    'assets/images/stain.jpg',
    'assets/images/cleaningtip.jpg',
    'assets/images/disinfection-equipment-table.jpg',
    'assets/images/files.jpg',
    'assets/images/cleaningtip.jpg',
    'assets/images/guide.jpg',
    'assets/images/cleaningtip.jpg',
    'assets/images/cleaningtip.jpg',
  ];

  visibleImageChunks: string[][] = [];
  currentIndex: number = 0;
  imagesPerPage: number = 9;

  loadImages() {
    this.visibleImageChunks = [];
    for (let i = 0; i < this.images.length; i += this.imagesPerPage) {
      this.visibleImageChunks.push(this.images.slice(i, i + this.imagesPerPage));
    }
  }

  nextImage() {
    if (this.currentIndex < this.visibleImageChunks.length - 1) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0;
    }
  }

  prevImage() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      this.currentIndex = this.visibleImageChunks.length - 1;
    }
  }

  clickAddMember() {
    this.resetForm();
  }

  resetForm(): void {
    this.itemsForm.reset();
    this.selectedImages = [];
    this.selectedPdfs = [];
    this.selectedVideos = [];
    this.itemsId = null;
    this.isEditMode = false;
    this.isViewClicked = false;
    this.showSaveChanges = true;
  }

  getAllItems() {
    if (this.categoryId) {
      this.categoryItemService.getAllItemsService(this.categoryId)
        .subscribe((res) => {
          this.itemsData = res;
          this.itemsArray = this.itemsData.data;
          console.log("All items:", this.itemsArray);
        });
    }
  }

  getItemById(id: any) {
    if (this.categoryId) {
      this.categoryItemService.getItemByIdService(this.categoryId, id)
        .subscribe(data => {
          this.editData = data;
          this.itemsId = this.editData.data._id;
          this.itemsForm.patchValue({
            name: this.editData.data.name,
            partNumber: this.editData.data.partNumber,
            shortDescription: this.editData.data.shortDescription,
            partDescription: this.editData.data.partDescription,
            images: this.editData.data.images,
            pdfs: this.editData.data.pdfs,
            videos: this.editData.data.videos
          });
          this.isEditMode = true;
        });
    }
  }


  viewItemById(id: any) {
    if (this.categoryId) {
      this.categoryItemService.getItemByIdService(this.categoryId, id)
        .subscribe(data => {
          this.editData = data;
          this.itemsId = this.editData.data._id;
          this.itemsForm.patchValue({
            name: this.editData.data.name,
            partNumber: this.editData.data.partNumber,
            shortDescription: this.editData.data.shortDescription,
            partDescription: this.editData.data.partDescription,
            images: this.editData.data.images,
            pdfs: this.editData.data.pdfs,
            videos: this.editData.data.videos
          });
          this.isEditMode = true;
        });
    }
  }

  deleteItemById(id: any) {
    if (!this.categoryId) {
      this.toast.error('Category ID is missing');
      return;
    }
  
    this.categoryItemService.deleteItemByIdService(this.categoryId, id)
      .pipe(
        this.toast.observe({
          loading: 'Deleting item... ⏳',
          success: 'Item deleted successfully',
          error: (err: any) => err.error?.message || 'Failed to delete item'
        })
      )
      .subscribe(() => {
        this.getAllItems();
      });
  }
  

  items = [
    {
      partNumber: 'This is part number of the item',
      shortDescription: 'This is a short description of the item.',
      partDescription: 'This part description provides more details about the item.',
      expandedShort: false,
      expandedPart: false
    },
  ];

  toggleExpand(type: string, item: any): void {
    if (type === 'short') {
      item.expandedShort = !item.expandedShort;
    } else if (type === 'part') {
      item.expandedPart = !item.expandedPart;
    }
  }

  getVideoName(url: string): string {
    return url.split('/').pop()?.split('?')[0] || 'Unknown Video';
  }

  // Getter to filter items based on search term
  get filteredItemsArray(): any[] {
    if (!this.searchTerm.trim()) {
      return this.itemsArray || [];
    }

    const term = this.searchTerm.trim().toLowerCase();

    return (this.itemsArray || []).filter(item =>
      (item.name ?? '').toLowerCase().includes(term) ||
      (item.partNumber ?? '').toLowerCase().includes(term) ||
      (item.shortDescription ?? '').toLowerCase().includes(term) ||
      (item.partDescription ?? '').toLowerCase().includes(term)
    );
  }


}
