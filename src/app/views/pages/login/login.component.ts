import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { HotToastService } from '@ngxpert/hot-toast';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {

  fb = inject(FormBuilder);
  router = inject(Router);
  authService = inject(AuthService);
  loginForm!: FormGroup;
  errorMessage: string = '';
  showPassword: boolean = false; 
  toast = inject(HotToastService); 


  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.required],
    });
  }

  submit() {
    this.errorMessage = '';

    console.log(this.loginForm.value);
    this.authService.loginService(this.loginForm.value).subscribe({
      next: (res) => {
       this.toast.success('Login Successfully');
        localStorage.setItem('user_id', res.data._id);
        this.router.navigate(['dashboard']);
        this.loginForm.reset();
      },
      error: (err) => {
        console.log(err);
        this.toast.error('Invalid email or password');  
      },
    });
  }

}
