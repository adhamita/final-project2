import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../core/services/proudct.service';
import { product } from './../../core/models/data.interface';
import { Component, inject, OnInit } from '@angular/core';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-product-details',
  imports: [CarouselModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit {

constructor(private productService: ProductService ,private route : ActivatedRoute) { }


product :product | null= null;
isLoading = false
ngOnInit(): void {
this.route.paramMap.subscribe(map => {
  const id = map.get('id');
if(id){
  this.getSpecificProduct(id);
}


})
  
}

private cartService = inject(CartService);
private toaster = inject(ToastrService);

addProductCart(productId: string){
this.cartService.addToProductCart(productId).subscribe({
  next: (response) => {
    console.log(response);
    this.toaster.success(response.message); 
  },
  error: (err) => {
    console.error(err);
    this.toaster.error(err.message)
  }
});
}



getSpecificProduct(id:string){
  this.isLoading = true;
  this.productService.getSpecificProduct(id).subscribe({
    
    next: (response) => {
      this.isLoading = false;
      console.log();
      if(response.data){
        this.product = response.data;
      }
    },
    error: (error) => {
      this.isLoading = false;
      console.error(error);
    }
  });
}
customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    navSpeed: 700,
    
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 4
      }
    },
    
  }
}
