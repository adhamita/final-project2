import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService, RegisterData } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { jwtDecode } from "jwt-decode";

// ...existing code...
@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
 

  constructor(private authService: AuthService ,private toaster: ToastrService, private router : Router) { }

isLoading = false;

  registerForm = new FormGroup({
    name: new FormControl("", [Validators.required, Validators.minLength(3)]),
    email: new FormControl("", [Validators.required, Validators.email]),
    password: new FormControl("", [Validators.required, Validators.pattern(/^[A-Z][a-z@0-9]{5,10}$/)]),
    rePassword: new FormControl("", [Validators.required]),
    phone: new FormControl("", [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)])
  }, { validators: this.matchPasswordValidation })



  matchPasswordValidation(group: AbstractControl): null | Record<string, any> {
    const password = group.get('password')?.value;
    const rePassword = group.get('rePassword')?.value;
    return password === rePassword ? null : { notMatching: true };
  }



  onSubmit() {



    if (this.registerForm.invalid && this.registerForm.getError('notMatching')) {
      return;
    }

    const values = this.registerForm.value;
    this.register(values as RegisterData);

  }
  register(value: RegisterData) {
    this.isLoading = true;
    this.authService.register(value).subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log('Registration successful', response);
        localStorage.setItem('token', String(response.token))
        this.toaster.success("Registration Successful")
      this.router.navigate(['/login'])
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Registration failed', error.error.message);
        this.toaster.error("Registration Failed" , error.error.message)
        
      }
    })
  }
// !!!

}
