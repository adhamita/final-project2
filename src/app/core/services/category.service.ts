import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Category, product, response } from "../models/data.interface";
import { environment } from "../../../environments/environment";










@Injectable({
  providedIn: "root",
})
export class categoryService {
  constructor(private http:HttpClient) {}


    
  getCategories():Observable <response<Category>> {
    return this.http.get<response<Category>>(`${environment.BASEURL}categories`)
  }
  getSpecificCategory(id:string):Observable<{data:Category}> {
    return this.http.get<{data:Category}>(`${environment.BASEURL}categories/${id}`)
  }
}
