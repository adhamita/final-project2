import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { Observable, BehaviorSubject, tap } from "rxjs";
import { cartResponse } from "../models/data.interface";







@Injectable({
    providedIn: "root",
})
export class CartService {
    private cartCountSubject = new BehaviorSubject<number>(0);
    public cartCount$ = this.cartCountSubject.asObservable();

    constructor(private http: HttpClient) { }

    addToProductCart(productId: string): Observable<any> {
        return this.http.post(`${environment.BASEURL}cart`, { productId }, {
            headers: {
                token: localStorage?.getItem('token') || ''
            }
        }).pipe(
            tap((response: any) => {
                if (response?.numOfCartItems !== undefined) {
                    this.cartCountSubject.next(response.numOfCartItems);
                } else {
                    this.refreshCartCount();
                }
            })
        );
    };

    updateProductQuantity(productId: string, count: number): Observable<cartResponse> {
        return this.http.put<cartResponse>(`${environment.BASEURL}cart/${productId}`, { count }, {
            headers: {
                token: localStorage?.getItem('token') || ''
            }
        }).pipe(
            tap((response: any) => {
                if (response?.numOfCartItems !== undefined) {
                    this.cartCountSubject.next(response.numOfCartItems);
                } else {
                    this.refreshCartCount();
                }
            })
        );
    };

    deleteSpecificProduct(productId: string): Observable<cartResponse> {
        return this.http.delete<cartResponse>(`${environment.BASEURL}cart/${productId}`, {
            headers: {
                token: localStorage?.getItem('token') || ''
            }
        }).pipe(
            tap((response: any) => {
                if (response?.numOfCartItems !== undefined) {
                    this.cartCountSubject.next(response.numOfCartItems);
                } else {
                    this.refreshCartCount();
                }
            })
        );
    };

    deleteCart(): Observable<any> {
        return this.http.delete(`${environment.BASEURL}cart`, {
            headers: {
                token: localStorage?.getItem('token') || ''
            }
        }).pipe(
            tap(() => {
                this.cartCountSubject.next(0);
            })
        );
    };

     getUserCart(): Observable<cartResponse> {
        return this.http.get<cartResponse>(`${environment.BASEURL}cart`, {
            headers: {
                token: localStorage?.getItem('token') || ''
            }
        })
    };


checkoutSession(cart_id: string): Observable<{session: {url : string}}> {
    return this.http.post<{session: {url : string}}>(`${environment.BASEURL}orders/checkout-session/${cart_id}?url=${environment.frontURL}`, {}, {
        headers: {
            token: localStorage?.getItem('token') || ''
        }
    })
}

refreshCartCount(): void {
    this.getUserCart().subscribe({
        next: (response: any) => {
            const count = response?.numOfCartItems || 0;
            this.cartCountSubject.next(count);
        },
        error: (err) => {
            console.error('Error refreshing cart count:', err);
            this.cartCountSubject.next(0);
        }
    });
}

updateCartCount(count: number): void {
    this.cartCountSubject.next(count);
}

getCurrentCartCount(): number {
    return this.cartCountSubject.value;
}

}
