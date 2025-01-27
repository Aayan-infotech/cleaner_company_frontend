import { HttpClient } from '@angular/common/http';
import { Component,OnInit  } from '@angular/core';
import { an } from '@fullcalendar/core/internal-common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import {ImageuploadService} from '../../services/imageupload.service'
@Component({
  selector: 'app-employee-time-control',
  standalone: false,
  templateUrl: './employee-time-control.component.html',
  styleUrl: './employee-time-control.component.scss'
})
export class EmployeeTimeControlComponent implements OnInit{
  productForm: FormGroup;
  selectedImages: File[] = [];
  products: any

  constructor(private fb: FormBuilder, private imageuploadService: ImageuploadService) {
    this.productForm = this.fb.group({
      productName: ['', Validators.required],
      images: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.fetchProducts();
  }

//for image change on click
  onFileChanged(event: any) {
    this.selectedImages = Array.from(event.target.files);
    if (this.selectedImages.length > 0) {
      this.productForm.patchValue({ images: this.selectedImages });
    } else {
      this.productForm.patchValue({ images: '' });
    }
  }

  onUpload() {
    if (this.productForm.invalid) {
      return;
    }

    const formData = new FormData();
    formData.append('productName', this.productForm.get('productName')?.value);
    this.selectedImages.forEach(file => {
      formData.append('images', file, file.name);
    });

    this.imageuploadService.uploadProduct(formData).subscribe({
      next: () => {
        console.log('Product uploaded successfully');
        this.productForm.reset();
        this.selectedImages = [];
      },
      error: (error) => {
        console.error('Error uploading product:', error);
      }
    });
  }

  fetchProducts(): void {
    this.imageuploadService.getProducts()
      .subscribe({
        next: (products) => {
          this.products = products;
          console.log(products)
        },
        error: (error) => {
          console.error('Error fetching products:', error);
        }
      });
  }
}

  