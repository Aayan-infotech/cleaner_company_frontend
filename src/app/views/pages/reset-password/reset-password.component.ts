import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { confirmPasswordValidator } from 'src/app/validators/confirm-password';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: false,
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent implements OnInit {

  fb = inject(FormBuilder);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  resetForm!: FormGroup;
  token!: string;
  authService = inject(AuthService);
  ngOnInit(): void {
    this.resetForm = this.fb.group(
      {
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required]
      },
      {
        validator: confirmPasswordValidator('password', 'confirmPassword')
      });

    this.activatedRoute.params.subscribe(val => {
      this.token = val['token'];
      console.log(this.token);
    });
  }

  submit() {
    console.log(this.resetForm.value)
    let resetObj = {
      token: this.token,
      password: this.resetForm.value.password
    }
    this.authService.resetPasswordService(resetObj)
      .subscribe(
        {
          next: (res) => {
            alert(res.message);
            this.resetForm.reset();
            this.router.navigate(['login']);
          },
          error: (err) => {
            alert(err.error.message);
          }
        })
  }
}
