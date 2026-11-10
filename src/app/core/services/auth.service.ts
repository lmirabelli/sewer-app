import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthResponse, User } from '../models/user';
import { environment } from '../../../enviroment/enviroment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = `${environment.backendUrl}/auth`;

    constructor(private http: HttpClient) { }

    register(userData: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/register`, userData);
    }

    login(credentials: { email: string; password: string }): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
            tap(response => {
                localStorage.setItem('token', response.access_token);
                localStorage.setItem('usuario', JSON.stringify(response.usuario));
            })
        );
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    getUsuarioActual(): User | null {
        const userJson = localStorage.getItem('usuario');
        return userJson ? JSON.parse(userJson) : null;
    }

    isLoggedIn(): boolean {
        return !!this.getToken();
    }

    isAdmin(): boolean {
        const usuario = this.getUsuarioActual();
        return usuario?.perfil === 'administrador';
    }

    logout(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
    }
}