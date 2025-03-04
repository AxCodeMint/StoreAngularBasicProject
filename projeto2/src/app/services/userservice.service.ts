import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, concatMap, Observable, tap, throwError } from 'rxjs';
import { User } from '../models/user.type';

@Injectable({
  providedIn: 'root'
})
export class UserserviceService {
  private apiUrl = 'http://localhost:3000/utilizadores';

  constructor(private http: HttpClient) {
  }

  private errorHandler(error: HttpErrorResponse) {
    if (error.status === 404) {
      return throwError(() => error.message)
    } else {
      return throwError(() => "Ocorreu um erro!")
    }
  }

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl)
      .pipe(
        catchError(this.errorHandler)
      )
  }

  insertUser(user: User) {
    return this.http.post<User>(this.apiUrl, user)
      .pipe(
        concatMap(user => this.http.get<User[]>(this.apiUrl)), catchError(this.errorHandler)
      );
  }

  searchUsersEmail(searchValue: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}?email_like=${searchValue}`)
      .pipe(
        catchError(this.errorHandler)
      );
  }

  deleteUser(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`)
      .pipe(
        concatMap(result => this.http.get<User[]>(this.apiUrl)), catchError(this.errorHandler)
      );
  }

  getUserById(id: number): Observable<User> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<User>(url).pipe(
      catchError(error => {
        return throwError(() => new Error('Erro ao buscar usuário.'));
      })
    );
  }

  updateUserProfile(user: Partial<User>): Observable<User> {
    const url = `${this.apiUrl}/${user.id}`;
    return this.http.put<User>(url, user).pipe(
      catchError(this.errorHandler)
    );
  }
}