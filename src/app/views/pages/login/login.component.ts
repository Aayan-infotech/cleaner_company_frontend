import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  fb = inject(FormBuilder);
  router = inject(Router)
  authService = inject(AuthService);
  loginForm!: FormGroup;


  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['',Validators.compose([Validators.required, Validators.email])],
      password: ['',Validators.required],
    })
  }
  submit(){
    console.log(this.loginForm.value)
    this.authService.loginService(this.loginForm.value)
    .subscribe({
      next:(res)=>{
        alert("Login Successfully")
        localStorage.setItem("user_id",res.data._id);
        this.router.navigate(['dashboard'])
        this.loginForm.reset();
      },
      error:(err)=>{
        console.log(err)
      }
    })
  }

}
