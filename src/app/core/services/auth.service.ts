import { environment } from './../../../environments/environment';
import { HttpClient } from "@angular/common/http";
import { Inject, Injectable, PLATFORM_ID } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { product, response } from "../models/data.interface";
import { jwtDecode } from "jwt-decode";
import { isPlatformBrowser } from "@angular/common";
import { Router } from "@angular/router";


export interface RegisterData {
  name: string ;
  email: string;
  password: string;
  rePassword: string;
  phone: string;
}
export interface LoginData {
 
  email: string;
  password: string;

}


export interface forgetPasswordData {
 
  email: string;
 

}


export interface decodedData{
  id : string;
  name : string ; 
  role : string ;
  iat : number;
  exp : number;
}
@Injectable({
  providedIn: "root",
})
export class AuthService {



userData :BehaviorSubject<any> = new BehaviorSubject(null);




  constructor(private http:HttpClient , @Inject(PLATFORM_ID) private platformId: any ,private router: Router) {
if (isPlatformBrowser(this.platformId)){
  
  const token = localStorage.getItem('token');
  if (token) {
    const decoded = this.decodedToken(token);
  }
}

  }



  register(data : RegisterData) :Observable<response<any>> {
    return this.http.post<response<any>>( `${environment.BASEURL}auth/signup`, data)
  }

  login(data : LoginData) :Observable<response<any>> {
    return this.http.post<response<any>>( `${environment.BASEURL}auth/signin`, data)
  }

  forgetPassword(data: forgetPasswordData, p0: string) : Observable<response<any>> {
    return this.http.post<response<any>>( `${environment.BASEURL}auth/forgotPasswords`, data)
  }

   verifyCode(data : {resetCode : string}) : Observable<response<any>> {
    return this.http.post<response<any>>( `${environment.BASEURL}auth/verifyResetCode`, data)
  }

  
   resetPassword(data : {email: string , newPassword : string}) : Observable<response<any>> {
    return this.http.put<response<any>>(`${environment.BASEURL}auth/resetPassword`, data)
  }

  



  decodedToken(token:string){
  const decoded = jwtDecode(token);
  this.userData.next(decoded)
  
  return decoded;
}


logOut(){
  if(isPlatformBrowser(this.platformId)){
    localStorage.removeItem('token');
    this.userData.next(null);
    this.router.navigate(['/login']);
  }
}




}
