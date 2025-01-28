import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../../../services/users.service';

@Component({
  selector: 'app-profile-account',
  templateUrl: './profile-account.component.html',
  styleUrl: './profile-account.component.scss'
})
export class ProfileAccountComponent implements OnInit {
  usersService = inject(UsersService);
  userArray: any;
  userData: any;
  fb = inject(FormBuilder);
  profileForm!: FormGroup;
  userData1: any;
  userData2: any;
  editData: any;
  ngOnInit() {
    this.profileForm = this.fb.group({
      firstName: ['',Validators.required],
      lastName: ['',Validators.required],
      username: ['',Validators.required],
      email: ['',Validators.compose([Validators.required, Validators.email])],
      password: ['',Validators.required],
      contactNumber: ['',Validators.required],
      companyAddress: ['',Validators.required]
    })
    const userId = localStorage.getItem('user_id');
    console.log(userId)
    if (userId) {
      this.usersService.getUserByIdService(userId)
      .subscribe(data => {
        this.userData1 = data
        this.userData2 = this.userData1.data
        console.log(this.userData2);
      })
    }
    this.getUserById(userId)
  }

  getUserById(id: any) {
    this.usersService.getUserByIdService(id)
      .subscribe(data => {
        this.editData = data
        console.log(this.editData.data);
        this.profileForm.patchValue({
          firstName: this.editData.data.firstName,
          lastName: this.editData.data.lastName,
          username: this.editData.data.username,
          email: this.editData.data.email,
          password: this.editData.data.password,
          contactNumber: this.editData.data.contactNumber,
          companyAddress: ['',Validators.required]
        })
      })
  }
  getAllUsers(){
    this.usersService.getAllUsersService()
    .subscribe((res)=>{
     this.userData = res
     console.log(this.userData)
    })
  }
}
