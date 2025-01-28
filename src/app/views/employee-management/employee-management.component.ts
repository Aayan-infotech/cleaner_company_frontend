import { Component, Input, OnInit, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { PushNotificationService } from '../../services/push-notification.service';
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
  pushNotificationService = inject(PushNotificationService);
  router = inject(Router)
  userForm!: FormGroup;
  notificationForm! : FormGroup
  public activePage = 2;
  editData: any;
  imgURL: any;
  selectedImages: File[] = [];
  deviceToken: string | null = null;
  errorMessage: string | null = null;
  setActivePage(page: number) {
    this.activePage = page;
  }
  userData!: any
  userArray!: any
  public visible = false;
  public visible2 = false;

  toggleLiveDemo() {
    this.visible = !this.visible;
  }

  handleLiveDemoChange(event: any) {
    this.visible = event;
  }

  toggleLiveDemo2() {
    this.visible2 = !this.visible2;
  }

  handleLiveDemoChange2(event: any) {
    this.visible2 = event;
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

    this.notificationForm = this.fb.group({
      title: ['', Validators.required],
      body: ['', Validators.required],
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
          images: this.editData.data.images,
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
  clickAddMember2() {
    this.resetForm();
  }
  resetForm(): void {
    this.userForm.reset();
    this.notificationForm.reset();
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


  handleNotificationClick(userId: any) {
    this.getUserToken(userId); // Fetch the token
  }
  
  getUserToken(id: any) {
    const observer = {
      next: (response: any) => {
        this.userId = response.deviceToken?.userId || 'No UserIf found'
        this.deviceToken = response.deviceToken?.token || 'No token found';
        this.errorMessage = null;
      //  console.log(this.deviceToken);
        // Open the modal if token retrieval is successful
        this.toggleLiveDemo2();
      },
      error: (error: any) => {
        // console.error('Error fetching token:', error);
        this.errorMessage = 'Failed to fetch the device token. Please try again.';
        this.deviceToken = null;
        // Show an alert if token retrieval fails
        alert('He needs to Login first through Mobile APP');
      },
    };
  
    this.pushNotificationService.getTokenByUserId(id).subscribe(observer);
  }

  sendNotification() {
    if (this.notificationForm.invalid) {
      alert('Please fill in all required fields.');
      return;
    }
  
    const notificationData = {
      userId: this.userId || '', // Fallback to an empty string if null
      token: this.deviceToken || '', // Fallback to an empty string if null
      title: this.notificationForm.value.title,
      body: this.notificationForm.value.body,
    };
  
    this.pushNotificationService.sendNotification(notificationData).subscribe({
      next: (response) => {
        console.log('Notification sent successfully:', response.message);
        alert('Notification sent successfully');
        this.toggleLiveDemo2(); // Close the modal after success
        this.notificationForm.reset();
      },
      error: (error) => {
        console.error('Error sending notification:', error);
        alert('Failed to send notification. Please try again.');
        this.notificationForm.reset();
      },
    });
  }
  
}

