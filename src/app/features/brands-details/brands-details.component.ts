import { Component, Input, OnInit } from '@angular/core';
import { BrandsService } from '../../core/services/brands.service';
import { ActivatedRoute } from '@angular/router';
import { Brand, Brands, Data, subBrand } from '../../core/models/data.interface';

@Component({
  selector: 'app-brands-details',
  imports: [],
  templateUrl: './brands-details.component.html',
  styleUrl: './brands-details.component.css'
})
export class BrandsDetailsComponent implements OnInit {
  isLoading = false;

brand: subBrand | null = null;
  constructor(private brandService : BrandsService , private route : ActivatedRoute){}

ngOnInit(): void {
this.route.paramMap.subscribe(map => {
  const id = map.get('id');
if(id){
  this.getSpecificBrand(id);
}

})
} 

  getSpecificBrand(id:string){
  this.isLoading = true;
  this.brandService.getSpecificBrand(id).subscribe({

    next:(response)=>{
      this.isLoading = false;
      console.log(response.data);
      this.brand = response.data;

    },
    error: (error) => {
      this.isLoading = false;
      console.error(error.error.message);
    }
  });

}


}