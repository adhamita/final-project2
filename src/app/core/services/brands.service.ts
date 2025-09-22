import { Data, response, subBrand } from './../models/data.interface';
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { Observable } from "rxjs";
import { Brands } from "../models/data.interface";

@Injectable({
  providedIn: "root",
})
export class BrandsService {
  constructor(private http: HttpClient) {}

  getAllBrands():Observable<response<Brands>>{
    return this.http.get<response<Brands>>(`${environment.BASEURL}brands`);
  }

  getSpecificBrand(id:string):Observable<{data :subBrand}>{
    return this.http.get<{data :subBrand}>(`${environment.BASEURL}brands/${id}`);
  }
}