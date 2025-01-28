import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-forget-password',
  standalone: false,
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.scss'
})
export class ForgetPasswordComponent implements OnInit{
  
  fb = inject(FormBuilder);
  router = inject(Router);
  forgetForm!: FormGroup;
  authService = inject(AuthService);
  ngOnInit(): void {
    this.forgetForm = this.fb.group({
      email: ['',Validators.compose([Validators.required, Validators.email])],
    })
  }
  submit(){
    console.log(this.forgetForm.value);
    this.authService.sendEmailService(this.forgetForm.value.email)
    .subscribe({
      next: (res)=>{
        alert(res.message);
        this.forgetForm.reset();
      },
      error: (err)=>{
        alert(err.error.message);
      }
    });
  }
}
