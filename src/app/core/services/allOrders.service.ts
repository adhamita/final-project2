import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { OrdersResponse } from "../models/data.interface";
import { environment } from "../../../environments/environment";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root",
})
export class AllOrdersService {
  private authService = inject(AuthService);
  
  constructor(private http: HttpClient) {}

  getUserOrders(userId?: string): Observable<OrdersResponse> {
    let finalUserId = userId;
    
    if (!finalUserId) {
      const currentUser = this.authService.userData.getValue();
      if (currentUser && currentUser.id) {
        finalUserId = currentUser.id;
      } else {
        const token = localStorage.getItem('token');
        if (token) {
          const decoded = this.authService.decodedToken(token) as any;
          finalUserId = decoded.id;
        }
      }
    }
    
    return this.http.get<OrdersResponse>(`${environment.BASEURL}orders/user/${finalUserId}`, {
      headers: {
        token: localStorage?.getItem('token') || ''
      }
    });
  }

  getAllUserOrders(): Observable<OrdersResponse> {
    return this.http.get<OrdersResponse>(`${environment.BASEURL}orders/user`, {
      headers: {
        token: localStorage?.getItem('token') || ''
      }
    });
  }

  getOrderById(orderId: string): Observable<any> {
    return this.http.get(`${environment.BASEURL}orders/${orderId}`, {
      headers: {
        token: localStorage?.getItem('token') || ''
      }
    });
  }

  getPaidOrders(): Observable<OrdersResponse> {
    return new Observable(observer => {
      this.getUserOrders().subscribe({
        next: (orders) => {
          const paidOrders = orders.filter(order => order.isPaid === true);
          observer.next(paidOrders);
          observer.complete();
        },
        error: (err) => {
          observer.error(err);
        }
      });
    });
  }

  getDeliveredOrders(): Observable<OrdersResponse> {
    return new Observable(observer => {
      this.getUserOrders().subscribe({
        next: (orders) => {
          const deliveredOrders = orders.filter(order => order.isDelivered === true);
          observer.next(deliveredOrders);
          observer.complete();
        },
        error: (err) => {
          observer.error(err);
        }
      });
    });
  }

  getRecentOrders(days: number = 30): Observable<OrdersResponse> {
    return new Observable(observer => {
      this.getUserOrders().subscribe({
        next: (orders) => {
          const cutoffDate = new Date();
          cutoffDate.setDate(cutoffDate.getDate() - days);
          
          const recentOrders = orders.filter(order => {
            const orderDate = new Date(order.createdAt);
            return orderDate >= cutoffDate;
          });
          
          observer.next(recentOrders);
          observer.complete();
        },
        error: (err) => {
          observer.error(err);
        }
      });
    });
  }

  getOrdersForUser(userId: string): Observable<OrdersResponse> {
    return this.http.get<OrdersResponse>(`${environment.BASEURL}orders/user/${userId}`, {
      headers: {
        token: localStorage?.getItem('token') || ''
      }
    });
  }
}