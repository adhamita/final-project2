import { Token } from './../../../../node_modules/parse5/dist/common/token.d';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {

  private router = inject(Router);
  private toaster = inject(ToastrService);
  private authService = inject(AuthService);

isLoading = false;

  step = 1;

  forgetPasswordGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });
  verifyCodeGroup = new FormGroup({
    resetCode: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });
  resetPasswordGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    newPassword: new FormControl("", [Validators.required, Validators.pattern(/^[A-Z][a-z@0-9]{5,10}$/)]),
  });




  handleSubmitForgetPassword() {
    if (this.forgetPasswordGroup.invalid) {
      this.forgetPasswordGroup.markAllAsTouched();
      return;
    }


    this.forgetPasswordGroup.value.email
    this.resetPasswordGroup.get('email')?.patchValue(this.forgetPasswordGroup.value.email || '')

this.isLoading = true;
    this.authService.forgetPassword({ email: this.forgetPasswordGroup.value.email! }, '').subscribe({
      next: (res) => {
        this.isLoading = false;
            this.step = 2;
      },
      error: (error) => {
        this.toaster.error(error.error.message, '', { timeOut: 1500 });
        this.isLoading = false;
      }
    });

  }


  handleSubmitVerifyCode() {
    if (this.verifyCodeGroup.invalid) {
      this.verifyCodeGroup.markAllAsTouched();
      return;
    }

    this.authService.verifyCode({ resetCode: this.verifyCodeGroup.value.resetCode! }).subscribe({
      next: (res) => {
        this.step = 3;
      },
      error: (error) => {
        this.toaster.error(error.error.message, '', { timeOut: 1500 });
      }
    });




    
  }


  handleSubmitResetPassword() {
    if (this.resetPasswordGroup.invalid) {
      this.resetPasswordGroup.markAllAsTouched();
      return;
    }



this.authService.resetPassword({ email: this.resetPasswordGroup.value.email!, newPassword: this.resetPasswordGroup.value.newPassword! }).subscribe({
  next: (res) => {
    this.toaster.success('Password Reset Successfully', "", { timeOut: 1500 });
    
    localStorage.setItem('token' ,String(res.token));
  
    this.authService.decodedToken(String(res.token));

    this.router.navigate(['/home']);

  
  },
  error: (error) => {
    this.toaster.error(error.error.message, '', { timeOut: 1500 });
  }
});


    this.router.navigate(['/login']);
  }


}