import { Component, Input, OnInit, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from '../../services/users.service';
// interface IUser {
//   name: string;
//   state: string;
//   registered: string;
//   country: string;
//   usage: number;
//   period: string;
//   payment: string;
//   activity: string;
//   avatar: string;
//   status: string;
//   color: string;
// }
@Component({
  selector: 'app-employee-management',
  standalone: false,
  templateUrl: './employee-management.component.html',
  styleUrl: './employee-management.component.scss'
})
export class EmployeeManagementComponent implements OnInit {
  @Input() userId: string | null = null;
  fb = inject(FormBuilder);
  usersService = inject(UsersService);
  router = inject(Router)
  userForm!: FormGroup;
  public activePage = 2;
  editData: any;
  imgURL: any;
  selectedImages: File[] = [];

  setActivePage(page: number) {
    this.activePage = page;
  }
  userData!: any
  userArray!: any
  public visible = false;

  toggleLiveDemo() {
    this.visible = !this.visible;
  }

  handleLiveDemoChange(event: any) {
    this.visible = event;
  }
  ngOnInit(): void {
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.required],
      contactNumber: ['', Validators.required],
      companyAddress: ['', Validators.required],
      images: ['', Validators.required]
    })
    if (this.userId) {
      this.getUserById(this.userId);
    }
    this.getAllUsers();
  }

  //for image change on click
  onFileChanged(event: any): void {
    this.selectedImages = Array.from(event.target.files);
    this.userForm.patchValue({ images: this.selectedImages.length > 0 ? this.selectedImages : '' });
  }
  
  getUserById(id: any) {
    this.usersService.getUserByIdService(id)
      .subscribe(data => {
        this.editData = data
        this.userId = this.editData.data._id;
        console.log(this.editData.data);
        this.userForm.patchValue({
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

  submit() {
    console.log(this.userForm.value)
 
    const formData = new FormData();
    formData
      .append('firstName', this.userForm.get('firstName')?.value,

      );
    formData
      .append('lastName', this.userForm.get('lastName')?.value,

      );
    formData
      .append('username', this.userForm.get('username')?.value,
      );
    formData
      .append('email', this.userForm.get('email')?.value,
      );
    formData
      .append('password', this.userForm.get('password')?.value,
      );
    formData
      .append('contactNumber', this.userForm.get('contactNumber')?.value,
      );
    formData
      .append('companyAddress', this.userForm.get('companyAddress')?.value,
      );
    this.selectedImages.forEach(file => {
      formData.append('images', file, file.name);
    });
    if (this.userId) {
      // Update user
      this.usersService.updateUserService(this.userId, formData).subscribe({
        next: (res) => {
          alert('User Updated');
          this.selectedImages = [];
          this.resetForm();
          this.getAllUsers();
        },
        error: (err) => {
          console.log(err);
        }
      });
    } else {
      // Create new user
      this.usersService.createUserService(formData).subscribe({
        next: (res) => {
          alert('User Created');
          this.selectedImages = [];
          this.resetForm();
          this.getAllUsers();
        },
        error: (err) => {
          console.log(err);
        }
      });
    }

  }
  clickAddMember() {
    this.resetForm();
  }
  resetForm(): void {
    this.userForm.reset();
    this.selectedImages = [];
    this.userId = null;
  }


  getAllUsers() {
    this.usersService.getAllUsersService()
      .subscribe((res) => {
        this.userData = res
        this.userArray = this.userData.data
      //  this.imgURL = this.userArray[].images
        console.log(this.userArray)
        //sconsole.log(this.imgURL)
      })
  }

  deleteMember(id: any) {
    this.usersService.deleteUserService(id)
      .subscribe(res => {
        alert('Member Deleted')
        this.getAllUsers();
      })
  }



  // updateUser(userId: any): void {

  //   const updatedUserData = {
     
  //     firstName: this.userForm.value.firstName,
  //     lastName: this.userForm.value.lastName,
  //     username: this.userForm.value.username,
  //     email: this.userForm.value.email,
  //     password: this.userForm.value.password,
  //     contactNumber: this.userForm.value.contactNumber,
  //     images: this.userForm.value.images,
  //     companyAddress: this.userForm.value.companyAddress
  //   };

  //   userId = this.editData.data._id; 
  //   console.log(userId)
  //   console.log(updatedUserData)
  //   this.usersService.updateUserService(updatedUserData, userId)
  //     .subscribe(updatedUser => {
  //       console.log('User updated:', updatedUser);
  //       this.getAllUsers();
   
  //     });

  // }

  // updateUser(): void {
  //   if (this.userForm.invalid) {
  //     return;
  //   }

  //   const formData = new FormData();
  //   formData.append('firstName', this.userForm.get('firstName')?.value);
  //   formData.append('lastName', this.userForm.get('lastName')?.value);
  //   formData.append('username', this.userForm.get('username')?.value);
  //   formData.append('email', this.userForm.get('email')?.value);
  //   formData.append('password', this.userForm.get('password')?.value);
  //   formData.append('contactNumber', this.userForm.get('contactNumber')?.value);
  //   formData.append('companyAddress', this.userForm.get('companyAddress')?.value);
  //   this.selectedImages.forEach(file => {
  //     formData.append('images', file, file.name);
  //   });

  //   this.usersService.updateUserService(this.userId, formData).subscribe({
  //     next: updatedUser => {
  //       console.log('User updated:', updatedUser);
  //       // Reset form and clear selected images
  //       this.userForm.reset();
  //       this.selectedImages = [];
  //       // Call a method to refresh the user list or handle the response as needed
  //       this.getAllUsers();
  //     },
  //     error: error => {
  //       console.error('Error updating user:', error);
  //     }
  //   });
  // }
}
