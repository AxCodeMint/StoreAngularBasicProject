import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, concatMap, map, Observable, throwError, of } from 'rxjs';
import { UserWishlist } from '../models/userwishlist.type';
import { Product } from '../models/product.type';

@Injectable({
  providedIn: 'root'
})
export class WishlistserviceService {

  private urlAPI = 'http://localhost:3000/listaDesejos';

  constructor(private http: HttpClient) {}

  private errorHandler(error: HttpErrorResponse) {
    if (error.status === 404) {
      return throwError(() => 'não encontrado!');
    } else {
      return throwError(() => 'Ocorreu um erro inesperado!');
    }
  }

  private fetchWishlist(userId: number): Observable<UserWishlist> {
    return this.getListItemsByUserId(userId).pipe(
      concatMap(wishlist => {
        if (wishlist) {
          return of(wishlist); 
        } else {
          
          return this.createWishlist(userId).pipe(
            concatMap(newWishlist => {
              return of(newWishlist);  
            })
          );
        }
      }),
      catchError(this.errorHandler)  
    );
  }

  createWishlist(userId: number): Observable<UserWishlist> {
    const newWishlist: UserWishlist = {
      id: 0,
      userId: userId,
      products: []
    };
    return this.http.post<UserWishlist>(this.urlAPI, newWishlist);
  }

  addToList(userId: number, product: Product): Observable<void> {
    return this.fetchWishlist(userId).pipe(  
      concatMap(wishlist => {
        const productExists = wishlist.products.some(item => item.id === product.id);
  
        if (productExists) {
          return throwError(() => new Error(`${product.name} já está na lista de desejos!`)); 
        }
  
        wishlist.products.push(product);
  
        return this.http.put<void>(`${this.urlAPI}/${wishlist.id}`, wishlist);
      }),
      catchError(this.errorHandler) 
    );
  }

  removeFromList(userId: number, productId: number): Observable<void> {
    return this.fetchWishlist(userId).pipe(
      concatMap(wishlist => {
        wishlist.products = wishlist.products.filter(product => product.id !== productId);
        return this.http.put<void>(`${this.urlAPI}/${wishlist.id}`, wishlist).pipe(
          catchError(this.errorHandler)
        );
      }),
      catchError(this.errorHandler)
    );
  }

  clearList(userId: number): Observable<void> {
    return this.fetchWishlist(userId).pipe(
      concatMap(wishlist => {
        wishlist.products = [];
        return this.http.put<void>(`${this.urlAPI}/${wishlist.id}`, wishlist).pipe(
          catchError(this.errorHandler)
        );
      }),
      catchError(this.errorHandler)
    );
  }

  getListItemsByUserId(userId: number): Observable<UserWishlist | null> {
    return this.http.get<UserWishlist[]>(`${this.urlAPI}?userId=${userId}`).pipe(
      map(items => items.find(list => list.userId === userId) || null),
      catchError(this.errorHandler)
    );
  }
}
