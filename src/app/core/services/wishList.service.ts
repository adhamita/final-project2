import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, BehaviorSubject, tap } from "rxjs";
import { product, wishlist } from "../models/data.interface";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class WishListService {
 
  private wishlistCountSubject = new BehaviorSubject<number>(0);
  public wishlistCount$ = this.wishlistCountSubject.asObservable();
  
  private wishlistItems: string[] = [];
  private readonly WISHLIST_STORAGE_KEY = 'user_wishlist';

  constructor(private http: HttpClient) {
   
    this.loadWishlistFromStorage();
  
    this.syncWithServer();
  }
  addToWishlist(productId: string) : Observable<wishlist[]> {
    return this.http.post<wishlist[]>(`${environment.BASEURL}wishlist`, { productId }, {
        headers: {
            token: localStorage?.getItem('token') || ''
        }
    }).pipe(
        tap(() => {
            if (!this.wishlistItems.includes(productId)) {
                this.wishlistItems.push(productId);
                this.saveWishlistToStorage();
                this.wishlistCountSubject.next(this.wishlistItems.length);
            }
        })
    );
  }
    getWishlist(): Observable<any> {
    return this.http.get<any>(`${environment.BASEURL}wishlist`, {
        headers: {
            token: localStorage?.getItem('token') || ''
        }
    }).pipe(
        tap((response: any) => {
            const wishlistItems = Array.isArray(response) ? response : (response?.data || []);
            this.wishlistCountSubject.next(wishlistItems.length);
        })
    );
}
    removeFromWishlist(productId: string): Observable<wishlist> {
    return this.http.delete<wishlist>(`${environment.BASEURL}wishlist/${productId}`, {
        headers: {
            token: localStorage?.getItem('token') || ''
        }
    }).pipe(
        tap(() => {
            const index = this.wishlistItems.indexOf(productId);
            if (index > -1) {
                this.wishlistItems.splice(index, 1);
                this.saveWishlistToStorage();
                this.wishlistCountSubject.next(this.wishlistItems.length);
            }
        })
    );
}

refreshWishlistCount(): void {
    this.http.get<any>(`${environment.BASEURL}wishlist`, {
        headers: {
            token: localStorage?.getItem('token') || ''
        }
    }).subscribe({
        next: (response: any) => {
            const wishlistItems = Array.isArray(response) ? response : (response?.data || []);
            this.wishlistCountSubject.next(wishlistItems.length);
        },
        error: (err) => {
            console.error('Error refreshing wishlist count:', err);
            this.wishlistCountSubject.next(0);
        }
    });
}

updateWishlistCount(count: number): void {
    this.wishlistCountSubject.next(count);
}

getCurrentWishlistCount(): number {
    return this.wishlistCountSubject.value;
}

private loadWishlistFromStorage(): void {
    try {
        const stored = localStorage.getItem(this.WISHLIST_STORAGE_KEY);
        if (stored) {
            this.wishlistItems = JSON.parse(stored);
            this.wishlistCountSubject.next(this.wishlistItems.length);
        }
    } catch (error) {
        console.error('Error loading wishlist from storage:', error);
        this.wishlistItems = [];
    }
}

private saveWishlistToStorage(): void {
    try {
        localStorage.setItem(this.WISHLIST_STORAGE_KEY, JSON.stringify(this.wishlistItems));
    } catch (error) {
        console.error('Error saving wishlist to storage:', error);
    }
}

private syncWithServer(): void {
    const token = localStorage.getItem('token');
    if (!token) return;

    this.getWishlist().subscribe({
        next: (response: any) => {
            const serverWishlist = Array.isArray(response) ? response : (response?.data || []);
            this.wishlistItems = serverWishlist.map((item: any) => item._id || item.id || item);
            this.saveWishlistToStorage();
            this.wishlistCountSubject.next(this.wishlistItems.length);
        },
        error: (err) => {
            console.log('Using cached wishlist due to sync error:', err);
        }
    });
}

isProductInWishlist(productId: string): boolean {
    return this.wishlistItems.includes(productId);
}

getWishlistProductIds(): string[] {
    return [...this.wishlistItems];
}

}