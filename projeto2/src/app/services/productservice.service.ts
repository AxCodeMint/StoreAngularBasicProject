import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, concatMap, Observable, tap, throwError } from 'rxjs';
import { Product } from '../models/product.type';

@Injectable({
  providedIn: 'root'
})
export class ProductserviceService {
  private urlAPI = 'http://localhost:3000/produtos';

  constructor(private http: HttpClient) {
  }

  private errorHandler(error: HttpErrorResponse) {
    if (error.status === 404) {
        console.error('Not Found Error:', error);
        return throwError(() => 'Produto não encontrado!');
    } else {
        console.error('An unexpected error occurred:', error);
        return throwError(() => 'Ocorreu um erro!');
    }
}

  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(this.urlAPI)
      .pipe(
        catchError(this.errorHandler)
      )
  }

  insertProduct(product: Product) {
    return this.http.post<Product>(this.urlAPI, product)
      .pipe(
        tap(product => console.log(product)),
        concatMap(newProduct => this.http.get<Product[]>(this.urlAPI)), catchError(this.errorHandler)
      );
  }

  searchProducts(searchValue: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.urlAPI}?name_like=${searchValue}`)
      .pipe(
        catchError(this.errorHandler)
      );
  }

  deleteProduct(id: number) {
    return this.http.delete(`${this.urlAPI}/${id}`)
      .pipe(
        tap(product => console.log(product)),
        concatMap(result => this.http.get<Product[]>(this.urlAPI)), catchError(this.errorHandler)
      );
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.urlAPI}/${id}`).pipe(
        tap(product => console.log('Fetched product:', product)),
        catchError(this.errorHandler)
    );
}


  getFeaturedProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.urlAPI}?featured=true`).pipe(
      catchError(this.errorHandler)
    );
  }

  updateFeatured(id: number, isFeatured: boolean): Observable<Product[]> {
    return this.http.patch<Product>(`${this.urlAPI}/${id}`, { featured: isFeatured }).pipe(
      concatMap(() => this.http.get<Product[]>(this.urlAPI)),
    );
  }
}
