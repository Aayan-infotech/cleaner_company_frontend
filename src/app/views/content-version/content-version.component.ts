import { Component,OnInit, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {ContentService} from '../../services/content.service'
@Component({
  selector: 'app-content-version',
  standalone: false,
  templateUrl: './content-version.component.html',
  styleUrl: './content-version.component.scss'
})
export class ContentVersionComponent implements OnInit {

  fb = inject(FormBuilder);
  contentService = inject(ContentService);
  router = inject(Router)
  versionForm!: FormGroup;
  public visible = false;
  versionData: any;
  versionArray: any;

  toggleLiveDemo() {
    this.visible = !this.visible;
  }

  handleLiveDemoChange(event: any) {
    this.visible = event;
  }

  
  ngOnInit(): void {
    this.versionForm = this.fb.group({
      verName: ['',Validators.required],
      modifiedBy: ['',Validators.required],
      modifiedDate: ['',Validators.required],
      createdBy: ['',Validators.required],
      createdDate: ['',Validators.required],
    })
    this.getAllVersions();
  }

  getAllVersions(){
    this.contentService.getAllVersionsService()
    .subscribe((res)=>{
      this.versionData = res
      this.versionArray = this.versionData.data
     console.log(this.versionArray)
    })
  }
  submit(){
    console.log(this.versionForm.value)
    this.contentService.createVersionService(this.versionForm.value)
    .subscribe({
      next:(res)=>{
        alert("Version Created")
        this.getAllVersions();
      },
      error:(err)=>{
        console.log(err);
      }
    })
  }
}
