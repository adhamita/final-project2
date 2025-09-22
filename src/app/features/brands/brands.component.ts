import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../core/services/proudct.service';
import { BrandsService } from '../../core/services/brands.service';
import { Brands } from '../../core/models/data.interface';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-brands',
  imports: [RouterLink],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.css'
})
export class BrandsComponent implements OnInit {
  brand :Brands[] = [];
  isLoading = false;
constructor(private brandService : BrandsService){}
  ngOnInit(): void {
    this.getAllBrands();
  }


  getAllBrands(){
    this.isLoading = true;
this.brandService.getAllBrands().subscribe({
  next:(response)=>{
    console.log(response.data);
    this.brand = response.data;
    this.isLoading = false;
  },
  error:(error)=>{
    console.error(error.error.message);
    this.isLoading = false;
  }
})
  }

}
