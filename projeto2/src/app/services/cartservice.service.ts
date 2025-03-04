import { Injectable } from '@angular/core';
import { catchError, concatMap, map, Observable, tap, throwError } from 'rxjs';
import { UserCart } from '../models/usercart.type';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Product } from '../models/product.type';

@Injectable({
  providedIn: 'root'
})
export class CartserviceService {

  constructor(private http: HttpClient) {
  }

  private urlAPI = 'http://localhost:3000/carrinhos';

  private errorHandler(error: HttpErrorResponse) {
    if (error.status === 404) {
      return throwError(() => 'Produto não encontrado!');
    } else {
      return throwError(() => 'Ocorreu um erro!');
    }
  }
  private cartItems: UserCart | null = null;

  createCart(userId: number): Observable<UserCart> {
    const newCart: UserCart = {
      id: 0, 
      userId: userId,
      products: [] 
    };
    return this.http.post<UserCart>(this.urlAPI, newCart);
  }

  addToCart(userId: number, product: Product): Observable<void> {
    return this.getCartItemsByUserId(userId).pipe(
      concatMap(cart => {
        if (cart) {
          const existingProductIndex = cart.products.findIndex(p => p.id === product.id);
          if (existingProductIndex === -1) {
            cart.products.push(product);
            return this.http.put<void>(`${this.urlAPI}/${cart.id}`, cart);
          } else {
            return throwError(() => new Error(`${product.name} já está no carrinho!`));
          }
        } else {
          return this.createCart(userId).pipe(
            concatMap(newCart => {
              newCart.products.push(product);
              return this.http.put<void>(`${this.urlAPI}/${newCart.id}`, newCart);
            })
          );
        }
      }),
      catchError(this.errorHandler)
    );
  }

  getCartItemsByUserId(userId: number): Observable<UserCart | null> {
    return this.http.get<UserCart[]>(`${this.urlAPI}?userId=${userId}`).pipe(
      map(cartItems => cartItems.find(cart => cart.userId === userId) || null),
      catchError(this.errorHandler)
    );
  }

  removeFromCart(userId: number, productId: number): Observable<void> {
    return this.getCartItemsByUserId(userId).pipe(
      concatMap(cart => {
        if (cart) {
          cart.products = cart.products.filter(product => product.id !== productId);
          return this.http.put<void>(`${this.urlAPI}/${cart.id}`, cart);
        } else {
          return throwError(() => new Error('Carrinho não encontrado!'));
        }
      }),
      catchError(this.errorHandler)
    );
  }

  clearCart(userId: number): Observable<void> {
    return this.getCartItemsByUserId(userId).pipe(
      concatMap(cart => {
        if (cart) {
          cart.products = [];
          return this.http.put<void>(`${this.urlAPI}/${cart.id}`, cart);
        } else {
          return throwError(() => new Error('Carrinho não encontrado!'));
        }
      }),
      catchError(this.errorHandler)
    );
  }
}