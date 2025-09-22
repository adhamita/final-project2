import { product } from './../../core/models/data.interface';
import { ToastrService } from 'ngx-toastr';
import { cartResponse } from '../../core/models/data.interface';
import { CartService } from '../../core/services/cart.service';
import { Component, inject, OnInit } from '@angular/core';
import { CartLoadingComponent } from '../../sahred/components/cart-loading/cart-loading.component';

@Component({
  selector: 'app-cart',
  imports: [CartLoadingComponent],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  currenIndex: number = -1
  updateLoading = false;
  isLoading = false;
  cardData: cartResponse | null = null;
  private cartService = inject(CartService);
  private toaster = inject(ToastrService);
  ngOnInit(): void {
    this.getUserCart();
  }


  getUserCart() {
    this.isLoading = true;
    this.cartService.getUserCart().subscribe({
      next: (response) => {
        console.log(response)
        this.cardData = response;
        this.isLoading = false;
      },
      error: (err) => {
        console.log(err);
        this.toaster.error('Failed to load cart data');
        this.isLoading = false;
      }
    })
  }



  updateProductCount(id: string, count: number, currenIndex: number) {
    this.updateLoading = true;
    this.currenIndex = currenIndex;
    this.cartService.updateProductQuantity(id, count).subscribe({
      next: (response) => {
        console.log(response);
        this.cardData = response;
        this.updateLoading = false;

      },
      error: (err) => {
        console.log(err);
        this.toaster.error('Failed to update product quantity');

        this.updateLoading = false;
      }
    });
  }

  deleteProduct(id: string) {
    this.cartService.deleteSpecificProduct(id).subscribe({
      next: (response) => {
        console.log(response);
        this.cardData = response;
      },
      error: (err) => {
        console.log(err);
        this.toaster.error('Failed to delete product');
      }
    });
  }




  clearCart() {
    this.cartService.deleteCart().subscribe({
      next: (response) => {
        console.log(response);
        this.cardData = null;
        this.toaster.success('Cart cleared successfully');
      },
      error: (err) => {
        console.log(err);
        this.toaster.error(err.error.message || 'Failed to clear cart');

      }
    });
  }



  checkoutSession() {

    if (!this.cardData?.cartId) return;
    this.cartService.checkoutSession(this.cardData?.cartId).subscribe({
      next: (res) => {
        console.log(res);
        if (res?.session?.url) {
          window.location.href = res.session.url;
        }
      },
      error: (err) => {
        console.log(err);
        this.toaster.error(err.error.message || 'Failed to initiate checkout session');

      }
    });
  }
}