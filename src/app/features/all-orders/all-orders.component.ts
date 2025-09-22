import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { AllOrdersService } from '../../core/services/allOrders.service';
import { Order } from '../../core/models/data.interface';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-all-orders',
  imports: [CommonModule, DatePipe, CurrencyPipe],
  templateUrl: './all-orders.component.html',
  styleUrl: './all-orders.component.css'
})
export class AllOrdersComponent implements OnInit {
  
  private ordersService = inject(AllOrdersService);
  private toaster = inject(ToastrService);
  private router = inject(Router);
  
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  isLoading = false;
  selectedFilter = 'all';
  
  ngOnInit(): void {
    this.loadUserOrders();
  }

  loadUserOrders() {
    this.isLoading = true;
    this.ordersService.getUserOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.filteredOrders = orders;
        this.isLoading = false;
        console.log('User orders loaded:', orders);
      },
      error: (err) => {
        console.error('Error loading orders:', err);
        this.toaster.error('Failed to load orders');
        this.isLoading = false;
      }
    });
  }

  filterOrders(filter: string) {
    this.selectedFilter = filter;
    
    switch (filter) {
      case 'paid':
        this.filteredOrders = this.orders.filter(order => order.isPaid);
        break;
      case 'delivered':
        this.filteredOrders = this.orders.filter(order => order.isDelivered);
        break;
      case 'pending':
        this.filteredOrders = this.orders.filter(order => !order.isPaid);
        break;
      case 'recent':
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        this.filteredOrders = this.orders.filter(order => 
          new Date(order.createdAt) >= thirtyDaysAgo
        );
        break;
      default:
        this.filteredOrders = this.orders;
    }
  }

  getOrderStatusClass(order: Order): string {
    if (order.isDelivered) return 'bg-green-100 text-green-800';
    if (order.isPaid) return 'bg-blue-100 text-blue-800';
    return 'bg-yellow-100 text-yellow-800';
  }

  getOrderStatus(order: Order): string {
    if (order.isDelivered) return 'Delivered';
    if (order.isPaid) return 'Paid';
    return 'Pending';
  }

  getPaymentMethodIcon(method: string): string {
    switch (method.toLowerCase()) {
      case 'card':
      case 'credit':
        return 'fas fa-credit-card';
      case 'cash':
        return 'fas fa-money-bill-wave';
      case 'paypal':
        return 'fab fa-paypal';
      default:
        return 'fas fa-payment';
    }
  }

  getTotalItems(order: Order): number {
    return order.cartItems.reduce((total, item) => total + item.count, 0);
  }

  refreshOrders() {
    this.loadUserOrders();
  }

  getPaidOrdersCount(): number {
    return this.orders.filter(order => order.isPaid).length;
  }

  getDeliveredOrdersCount(): number {
    return this.orders.filter(order => order.isDelivered).length;
  }

  getPendingOrdersCount(): number {
    return this.orders.filter(order => !order.isPaid).length;
  }

  loadOrdersForSpecificUser(userId: string) {
    this.isLoading = true;
    this.ordersService.getOrdersForUser(userId).subscribe({
      next: (orders) => {
        this.orders = orders;
        this.filteredOrders = orders;
        this.isLoading = false;
        console.log('Orders loaded for user:', userId, orders);
        this.toaster.success(`Loaded ${orders.length} orders for user ${userId}`);
      },
      error: (err) => {
        console.error('Error loading orders for user:', userId, err);
        this.toaster.error('Failed to load orders for specific user');
        this.isLoading = false;
      }
    });
  }

  viewProductDetails(productId: string, productTitle: string) {
    const cleanTitle = productTitle.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    this.router.navigate(['/product-details', productId, cleanTitle]);
  }

  viewOrderDetails(order: Order) {
    if (order.cartItems && order.cartItems.length > 0) {
      if (order.cartItems.length === 1) {
        const item = order.cartItems[0];
        this.viewProductDetails(item.product._id, item.product.title);
      } else {
        const firstItem = order.cartItems[0];
        this.viewProductDetails(firstItem.product._id, firstItem.product.title);
        this.toaster.info(`Viewing details for: ${firstItem.product.title}`);
      }
    } else {
      this.toaster.warning('No items found in this order');
    }
  }
}
