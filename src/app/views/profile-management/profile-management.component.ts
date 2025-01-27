import { Component, OnInit, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProfilesService } from '../../services/profiles.service';


@Component({
  selector: 'app-profile-management',
  standalone: false,
  templateUrl: './profile-management.component.html',
  styleUrl: './profile-management.component.scss'
})


export class ProfileManagementComponent implements OnInit {

  fb = inject(FormBuilder);
  profilesService = inject(ProfilesService);
  router = inject(Router);
  profileForm!: FormGroup;
  // public visible = false;
  profileData!: any;
  profileArray!: any;
  visible: any;
  data:any



  toggleLiveDemo() {
    this.visible = !this.visible;
  }

  handleLiveDemoChange(event: any) {
    this.visible = event;
  }

  ngOnInit() {
    // this.profileForm = this.fb.group({
    //   comLogo: ['', Validators.required],
    //   custName: ['', Validators.required],
    //   status: ['', Validators.required],
    //   accType: ['', Validators.required],
    //   lastOdrDate: ['', Validators.required],
    //   amtLastOdr: ['', Validators.required],
    // })
    this.getAllProfile();
  };

  // get all profiles
  getAllProfile() {
    this.profilesService.getAllProfileService()
    .subscribe((res) => {
      this.profileData = res
      this.profileArray = this.profileData.data
      this.data=this.profileArray[0]
      console.log(this.data)
    })
  };

  // delete profile by id
  deleteProfile(id: any) {
    this.profilesService.deleteProfileService(id)
    .subscribe (res => {
      alert('Profile Deleted')
      this.getAllProfile();
    })
  };


}
