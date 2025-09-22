import { Component, inject, OnInit } from '@angular/core';
import { FlowbiteService } from '../../../core/services/flowbite.service';
import { initFlowbite } from 'flowbite';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LanguagesService } from '../../../core/services/languages.service';
import { CartService } from '../../../core/services/cart.service';
import { WishListService } from '../../../core/services/wishList.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive , ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
 
  isLogin = false;
  cartItemCount = 0;
  cartAnimationClass = '';
  wishlistItemCount = 0;
  wishlistAnimationClass = '';
  mobileMenuOpen = false;
  
  pages:{title:string , path:string}[]=[
  {path:'home',title:'Home'},
  {path:'brands',title:'Brands'},
  {path:'products',title:'Products'},
  {path:'catagories',title:'Categories'},
  {path:'allorders',title:'All Orders'},
 
]

authPages: { title: string, path: string }[] = [
  { path: 'login', title: 'Login' },
  { path: 'register', title: 'Register' }
];

 constructor(
   private flowbiteService: FlowbiteService, 
   private authService: AuthService,
   private cartService: CartService,
   private wishlistService: WishListService
 ) {}

  ngOnInit(): void {
    this.flowbiteService.loadFlowbite((flowbite) => {
      initFlowbite();
    });

    this.cartService.cartCount$.subscribe({
      next: (count) => {
        this.cartItemCount = count;
      }
    });

    this.wishlistService.wishlistCount$.subscribe({
      next: (count) => {
        this.wishlistItemCount = count;
      }
    });

    this.authService.userData.subscribe({
      next :(user)=>{
        console.log(user , 'navbar');
        if(user != null){
          this.isLogin = true;
          this.loadCartCount();
          this.loadWishlistCount();
        }else{
          this.isLogin = false;
          this.cartItemCount = 0;
          this.wishlistItemCount = 0;
        }
      }
    })
  }

  loadCartCount() {
    this.cartService.getUserCart().subscribe({
      next: (response: any) => {
        const count = response?.numOfCartItems || 0;
        this.cartService.updateCartCount(count);
      },
      error: (err: any) => {
        console.error('Error loading cart count:', err);
        this.cartService.updateCartCount(0);
      }
    });
  }

  loadWishlistCount() {
    this.wishlistService.getWishlist().subscribe({
      next: (response: any) => {
      },
      error: (err: any) => {
        console.error('Error loading wishlist count:', err);
        this.wishlistService.updateWishlistCount(0);
      }
    });
  }

  animateCart() {
    this.cartAnimationClass = 'animate-bounce';
    setTimeout(() => {
      this.cartAnimationClass = '';
    }, 600);
  }

  animateWishlist() {
    this.wishlistAnimationClass = 'animate-bounce';
    setTimeout(() => {
      this.wishlistAnimationClass = '';
    }, 600);
  }

  refreshCartCount() {
    if (this.isLogin) {
      this.loadCartCount();
    }
  }

  refreshWishlistCount() {
    if (this.isLogin) {
      this.loadWishlistCount();
    }
  }

  incrementCartCount() {
    this.cartItemCount++;
    this.cartAnimationClass = 'animate-pulse';
    setTimeout(() => {
      this.cartAnimationClass = '';
    }, 1000);
  }

  incrementWishlistCount() {
    this.wishlistItemCount++;
    this.wishlistAnimationClass = 'animate-pulse';
    setTimeout(() => {
      this.wishlistAnimationClass = '';
    }, 1000);
  }

  decrementWishlistCount() {
    if (this.wishlistItemCount > 0) {
      this.wishlistItemCount--;
      this.wishlistAnimationClass = 'animate-pulse';
      setTimeout(() => {
        this.wishlistAnimationClass = '';
      }, 1000);
    }
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu() {
    this.mobileMenuOpen = false;
  }

  exit(){
    this.authService.logOut()
  }


}
