import { Injectable } from '@angular/core';
import { User } from './user.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private userId: string;
  private isAuthenticated: boolean = false;
  private token: string;
  private tokenTimer: any;
  private userStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) { }

  createUser(email: string, password: string) {
    const user: User = { email: email, password: password };

    return this.http.post(`${environment.apiUrl}api/users/signup`, user);
  }

  login(email: string, password: string) {
    const user: User = { email: email, password: password };

    this.http.post<{ userId: string; token: string; expiresIn: number; }>(
      `${environment.apiUrl}api/users/login`, user
      )
      .subscribe(
        response => {
          const token = response.token;
          this.token = token;

          if (token) {
            const expiresInDuration = response.expiresIn;

            this.setTokenTimer(expiresInDuration);
            this.isAuthenticated = true;
            this.userId = response.userId;
            this.userStatusListener.next(true);

            const now = new Date();
            const expirationDate = new Date(
              now.getTime() + (expiresInDuration * 1000)
            );
            
            this.saveUserData(token, expirationDate, this.userId);

            this.router.navigate(["/"]);
          }
        },
        error => {
          this.userStatusListener.next(false);
        }
      );
  }

  forgotPassword(email: string) {
    const user: any = { email: email };

    return this.http.post(`${environment.apiUrl}api/users/forgot-password`, user);
  }

  changePassword(password: string) {
    const user: any = { password: password };

    return this.http.put(`${environment.apiUrl}api/users/change-password`, user);
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.userStatusListener.next(false);
    this.userId = null;

    clearTimeout(this.tokenTimer);

    this.deleteUserData();

    this.router.navigate(["/"]);
  }

  autoLogin() {
    const userData = this.getUserData();

    if (!userData) {
      return;
    }

    const now = new Date();
    const expiresIn = userData.expirationDate.getTime() - now.getTime();

    if (expiresIn > 0) {
      this.token = userData.token;
      this.isAuthenticated = true;
      this.userId = userData.userId;
      this.setTokenTimer(expiresIn / 1000);
      this.userStatusListener.next(true);
    }
  }

  private setTokenTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveUserData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem("token", token);
    localStorage.setItem("expiration", expirationDate.toISOString());
    localStorage.setItem("userId", userId);
  }

  private deleteUserData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("userId");
  }

  private getUserData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    const userId = localStorage.getItem("userId");

    if (!token || !expirationDate) {
      return;
    }
    
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId
    };
  }

  getUserId() {
    return this.userId;
  }

  getIsAuthenticated() {
    return this.isAuthenticated;
  }

  getToken() {
    return this.token;
  }

  getTokenTimer() {
    return this.tokenTimer;
  }

  getUserStatusListener() {
    return this.userStatusListener.asObservable();
  }
}
