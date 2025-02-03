import { Component, Input, OnInit, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { PushNotificationService } from '../../services/push-notification.service';
@Component({
  selector: 'app-employee-management',
  standalone: false,
  templateUrl: './employee-management.component.html',
  styleUrl: './employee-management.component.scss'
})
export class EmployeeManagementComponent implements OnInit {
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
 
  
}

