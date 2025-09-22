import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { product, wishlist } from '../../core/models/data.interface';
import { WishListService } from '../../core/services/wishList.service';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-wishlist',
  imports: [RouterLink],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css'
})
export class WishlistComponent implements OnInit {

  private wishlistService = inject(WishListService);
  private cartService = inject(CartService);
  private toaster = inject(ToastrService);
  wishlistItems: product[] | null = null;
  isLoading = false;

  ngOnInit(): void {
    this.getUserWishlist();
  }



getUserWishlist(){
  this.isLoading = true;
  this.wishlistService.getWishlist().subscribe({
    next:(response: any)=>{
   
      this.wishlistItems = Array.isArray(response) ? response : (response?.data || []);
      this.isLoading = false;
    },
    error: (err) => {
      console.error(err);
      this.toaster.error(err.message);
      this.isLoading = false;
    }
  });
}

  removeFromWishlist(itemId: string) {
    this.wishlistService.removeFromWishlist(itemId).subscribe({
      next: (response) => {
      
        this.wishlistItems = this.wishlistItems?.filter(item => item.id !== itemId) || [];

      },
      error: (err) => {
        console.error(err);
        this.toaster.error('Failed to remove from wishlist');
      }
    });
  }

  addToCart(itemId: string) {
  
    this.cartService.addToProductCart(itemId).subscribe({
      next: (response) => {
        this.toaster.success('Product added to cart');
      },
      error: (err) => {
        this.toaster.error('Failed to add to cart');
      }
    });
    console.log('Add to cart:', itemId);
   
  }

  clearWishlist() {
    if (this.wishlistItems && this.wishlistItems.length > 0) {
      // Show confirmation dialog
      const confirmed = confirm(`Are you sure you want to remove all ${this.wishlistItems.length} items from your wishlist?`);
      
      if (confirmed) {
        const itemsToRemove = [...this.wishlistItems]; // Create a copy
        let completedRequests = 0;
        let successCount = 0;
        
        itemsToRemove.forEach(item => {
          this.wishlistService.removeFromWishlist(item.id).subscribe({
            next: (response) => {
              successCount++;
              completedRequests++;
              
              // Check if all requests are completed
              if (completedRequests === itemsToRemove.length) {
                this.wishlistItems = [];
                this.toaster.success(`Successfully cleared ${successCount} items from wishlist`);
              }
            },
            error: (err) => {
              completedRequests++;
              console.error(err);
              
              // Check if all requests are completed
              if (completedRequests === itemsToRemove.length) {
                // Refresh the wishlist to get current state
                this.getUserWishlist();
                this.toaster.warning(`Cleared ${successCount} items, some items could not be removed`);
              }
            }
          });
        });
      }
    }
  }
}
