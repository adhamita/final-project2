import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService, LoginData, RegisterData } from '../../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule , RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  constructor(private authService: AuthService, private router: Router , private toaster :ToastrService) { }

isLoading = false;

  loginForm = new FormGroup({
    email: new FormControl("", [Validators.required, Validators.email]),
    password: new FormControl("", [Validators.required, Validators.pattern(/^[A-Z][a-z@0-9]{5,10}$/)]),
  })



  



  onSubmit() {



    if (this.loginForm.invalid && this.loginForm.getError('notMatching')) {
      return;
    }

    const values = this.loginForm.value;
    this.login(values as LoginData);

  }
  login(value: LoginData) {
    this.isLoading = true;
    this.authService.login(value).subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log('Login successful', response);
        localStorage.setItem('token', String(response.token));
        this.authService.decodedToken(String(response.token));
        this.toaster.success("Login Successful")
      this.router.navigate(['/home']);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Login failed', error.error.message);
        this.toaster.error("Login Failed" , error.error.message)
      }
    })
  }
}
