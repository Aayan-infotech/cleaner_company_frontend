import {  Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ClassToggleService, HeaderComponent } from '@coreui/angular';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../../../services/users.service';

@Component({
  selector: 'app-default-header',
  templateUrl: './default-header.component.html',
})
export class DefaultHeaderComponent extends HeaderComponent {

  @Input() sidebarId: string = "sidebar";
  @Input() userId: string | null = null;
  public newMessages = new Array(4)
  public newTasks = new Array(5)
  public newNotifications = new Array(5)
  usersService = inject(UsersService);
  userArray: any;
  userData: any;
  fb = inject(FormBuilder);
  profileForm!: FormGroup;
  userData1: any;
  userData2: any;
  editData: any;
  proImage: any;
  constructor(private classToggler: ClassToggleService) {
    super();
  }


 

    ngOnInit() {
      this.profileForm = this.fb.group({
        firstName: ['',Validators.required],
        lastName: ['',Validators.required],
        username: ['',Validators.required],
        email: ['',Validators.compose([Validators.required, Validators.email])],
        password: ['',Validators.required],
        contactNumber: ['',Validators.required],
        companyAddress: ['',Validators.required],
        images: ['', Validators.required]
      })
      const userId = localStorage.getItem('user_id');
  
      if (userId) {
        this.usersService.getUserByIdService(userId)
        .subscribe(data => {
          this.userData1 = data
          this.userData2 = this.userData1.data
          this.proImage = this.userData2.images[0].url

        })
      }
      this.getUserById(userId)
    }
  
    getUserById(id: any) {
      this.usersService.getUserByIdService(id)
        .subscribe(data => {
          this.editData = data
          this.userId = this.editData.data._id;
      
          this.profileForm.patchValue({
            firstName: this.editData.data.firstName,
            lastName: this.editData.data.lastName,
            username: this.editData.data.username,
            email: this.editData.data.email,
            password: this.editData.data.password,
            contactNumber: this.editData.data.contactNumber,
            images:this.editData.data.images ,
            companyAddress: this.editData.data.companyAddress
          })
        })
    }
    getAllUsers(){
      this.usersService.getAllUsersService()
      .subscribe((res)=>{
       this.userData = res
  
      })
    }

}
