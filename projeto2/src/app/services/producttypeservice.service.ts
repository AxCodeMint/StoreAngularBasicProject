import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { ProductType } from '../models/productType.type';

@Injectable({
  providedIn: 'root'
})
export class ProducttypeserviceService {
  private urlAPI = 'http://localhost:3000/tiposProdutos';

  constructor(private http: HttpClient) {
  }

  getAll(): Observable<ProductType[]> {
    return this.http.get<ProductType[]>(this.urlAPI)
      .pipe(
        catchError(this.errorHandler)
      );
  }

  private errorHandler(error: HttpErrorResponse) {
    if (error.status === 404) {
      return throwError(() => new Error('não encontrado!'));
    }
    else {
      return throwError(() => new Error('Ocorreu um erro!'));
    }
  }
}
