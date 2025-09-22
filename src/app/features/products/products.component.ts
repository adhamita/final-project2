import { Component, inject, OnInit } from '@angular/core';
import { ProductService } from '../../core/services/proudct.service';
import { categoryService } from '../../core/services/category.service';
import { CartService } from '../../core/services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { Category, product } from '../../core/models/data.interface';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { ProductCardComponent } from '../../sahred/components/product-card/product-card.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products',
  imports: [ProductCardComponent ,CarouselModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {


isLoading = false;

  products:product[] = [];
  categories:Category[] = [];
constructor(private productService: ProductService, private categoryService: categoryService , private router : Router) {

}

private cartService = inject(CartService);
private toaster = inject(ToastrService);

ngOnInit(): void {
    this.getAllProducts();
    this.getCategories();
}





getAllProducts(){
  this.isLoading = true;
  this.productService.getAllProducts().subscribe({
    next:(response) => {
      ;
      this.products = response.data;
      this.isLoading = false;
    },

    error: (error) => {
      console.error(error);
      this.isLoading = false;
    }
  })
}

getCategories(){
  this.categoryService.getCategories().subscribe({
    next : (response)=>{
      ;
      this.categories = response.data;
    },
    error: (error) => {
      console.error(error);
    }

  })
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
        items: 7
      }
    },
    
  }
 




}

  

