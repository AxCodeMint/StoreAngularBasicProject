import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserserviceService } from './userservice.service';
import { User } from '../models/user.type';
import { Userinfo } from '../models/userinfo.type';

@Injectable({
  providedIn: 'root'
})
export class SessionserviceService {
  private apiUrl = 'http://localhost:3000/utilizadores';

  private userInfoSubject = new BehaviorSubject<Userinfo | null>(this.getUserInfoFromStorage());

  userInfo$ = this.userInfoSubject.asObservable();
  isLogged$ = this.userInfo$.pipe(map(userInfo => !!userInfo));

  constructor(
    private http: HttpClient,
    private router: Router,
    private userService: UserserviceService
  ) { }

  login(email: string, password: string): Observable<User> {
    return this.http.get<User[]>(this.apiUrl).pipe(
      map(users => {
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
          if (user.active) {       
            const userInfo: Userinfo = { id: user.id, name: user.name, role: user.role };
            this.setUserInfo(userInfo);
            return user;
          } else {
            throw new Error('Conta inativa!');
          }
        } else {
          throw new Error('Email ou senha inválidos!');
        }
      }),
      catchError((error: HttpErrorResponse | Error) => {
        return throwError(() => new Error(error.message || 'Erro ao tentar realizar o login.'));
      })
    );
  }

  logout(): void {
    this.removeUserInfo();
    this.router.navigate(['/']);
  }

  getUserInfo(refresh: boolean = false): Observable<Userinfo | null> {
    const currentUserInfo = this.userInfoSubject.getValue();

    if (!currentUserInfo) {
      return new Observable(observer => {
        observer.next(null);
        observer.complete();
      });
    }

    if (refresh) {
       
      let newUserInfo = this.userService.getUserById(currentUserInfo.id).pipe(
        map(user => {
          const refreshedUserInfo: Userinfo = {
            id: user.id,
            name: user.name,
            role: user.role
          };

          this.setUserInfo(refreshedUserInfo);
          return refreshedUserInfo;
        }),
        catchError((error) => {
          this.removeUserInfo();
          return new Observable(observer => {
            observer.next(null);
            observer.complete();
          });
        })
      );
      return newUserInfo as Observable<Userinfo>
    }

    return this.userInfo$;
  }

  private setUserInfo(userInfo: Userinfo): void {
    this.userInfoSubject.next(userInfo);
    sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
  }

  private removeUserInfo(): void {
    this.userInfoSubject.next(null);
    sessionStorage.removeItem("userInfo");
  }

  private getUserInfoFromStorage(): Userinfo | null {
    const userInfoString = sessionStorage.getItem("userInfo");
    return userInfoString ? JSON.parse(userInfoString) as Userinfo : null;
  }
}