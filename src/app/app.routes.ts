import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
        {
        path: '', redirectTo: 'home', pathMatch: 'full'
    },
    {
        path: 'home',
        canActivate: [authGuard],
       loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
    },
    {
        path: 'brands',
       loadComponent: () => import('./features/brands/brands.component').then(m => m.BrandsComponent)
    },
    {
        path: 'cart',
       loadComponent: () => import('./features/cart/cart.component').then(m => m.CartComponent)
    },
    {
        path: 'catagories',
       loadComponent: () => import('./features/catagories/catagories.component').then(m => m.CatagoriesComponent)
    },
    {
        path: 'login',
       loadComponent: () => import('./features/login/login.component').then(m => m.LoginComponent)
    },
    {
        path: 'products',
       loadComponent: () => import('./features/products/products.component').then(m => m.ProductsComponent)
    },
    {
        path: 'register',
       loadComponent: () => import('./features/register/register.component').then(m => m.RegisterComponent)
    },
    {
        path: 'product-details/:id/:title',
       loadComponent: () => import('./features/product-details/product-details.component').then(m => m.ProductDetailsComponent)
    },
    {
        path: 'reset-password',
       loadComponent: () => import('./features/reset-password/reset-password.component').then(m => m.ResetPasswordComponent)
    },
    {
        path: 'allorders',
       loadComponent: () => import('./features/all-orders/all-orders.component').then(m => m.AllOrdersComponent)
    },
    {
        path: 'brands-details/:id/:title',
       loadComponent: () => import('./features/brands-details/brands-details.component').then(m => m.BrandsDetailsComponent)
    },
    {
        path: 'wishlist',
        loadComponent: () => import('./features/wishlist/wishlist.component').then(m => m.WishlistComponent)
    },
    {
        path: '**',
        loadComponent: () => import('./features/not-found/not-found.component').then(m => m.NotFoundComponent)
    },
];
