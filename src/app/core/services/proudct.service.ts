import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { product, response } from "../models/data.interface";
import { environment } from "../../../environments/environment";










@Injectable({
  providedIn: "root",
})
export class ProductService {
  constructor(private http:HttpClient) {}



  getAllProducts():Observable <response<product>> {
    return this.http.get<response<product>>(`${environment.BASEURL}products`)
  }
  getSpecificProduct(id:string):Observable<{data:product}> {
    return this.http.get<{data:product}>(`${environment.BASEURL}products/${id}`)
  }
}
