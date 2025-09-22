import { Component, inject, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { RouterLink } from '@angular/router';
import { product } from '../../../core/models/data.interface';
import { DatePipe, UpperCasePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../../core/services/cart.service';
import { WishListService } from '../../../core/services/wishList.service';

@Component({
  selector: 'app-product-card',
  imports: [RouterLink ,UpperCasePipe],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent implements OnInit, OnChanges {
today = new Date();
@Input()
product !: product ;
isInWishlist = false;
private cartService = inject(CartService);
private toaster = inject(ToastrService);
private wishlistService = inject(WishListService);

ngOnInit(): void {
  this.checkWishlistStatus();
}

ngOnChanges(changes: SimpleChanges): void {
  if (changes['product'] && this.product) {
    this.checkWishlistStatus();
  }
}

private checkWishlistStatus(): void {
  if (this.product && this.product.id) {
    this.isInWishlist = this.wishlistService.isProductInWishlist(this.product.id);
  }
}

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
addToWishlist(productId: string){
  if (this.isInWishlist) {
    // Remove from wishlist
    this.wishlistService.removeFromWishlist(productId).subscribe({
      next: (response) => {
        console.log(response);
        this.isInWishlist = false;
        this.toaster.success('Product removed from wishlist'); 
      },
      error: (err) => {
        console.error(err);
        this.toaster.error(err.message)
      }
    });
  } else {
    // Add to wishlist
    this.wishlistService.addToWishlist(productId).subscribe({
      next: (response) => {
        console.log(response);
        this.isInWishlist = true;
        this.toaster.success('Product added to wishlist successfully'); 
      },
      error: (err) => {
        console.error(err);
        this.toaster.error(err.message)
      }
    });
  }
}
}
