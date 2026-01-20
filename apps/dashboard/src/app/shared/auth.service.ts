import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

type LoginResponse = { accessToken: string };

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenKey = 'access_token';
  private apiBase = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    return this.http
      .post<LoginResponse>(`${this.apiBase}/auth/login`, { email, password })
      .pipe(tap((res) => localStorage.setItem(this.tokenKey, res.accessToken)));
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}