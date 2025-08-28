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

    // Check if email and password are entered
    if (!this.loginForm.value.email || !this.loginForm.value.password) {
      this.toast.warning('Please enter email and password');
      return;
    }

    this.authService.loginService(this.loginForm.value)
      .pipe(
        this.toast.observe({
          loading: 'Logging in... ⏳',
          success: 'Login successful',
          error: (err: any) => err.error?.message || 'Invalid email or password',
        })
      )
      .subscribe({
        next: (res) => {
          localStorage.setItem('user_id', res.data._id);
          this.router.navigate(['dashboard']);
          this.loginForm.reset();
        }
      });
  }

}
