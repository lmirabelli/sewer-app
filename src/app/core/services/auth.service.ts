import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';
import { AuthResponse, User } from '../models/user';
import { environment } from '../../../enviroment/enviroment';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = `${environment.backendUrl}/auth`;
    private contadorSesion: any;
    private intervalReloj: any;
    public tiempoRestante = signal<number>(0);
    private readonly DURACION_SESION_SEG = 3 * 60; 
    private readonly TIEMPO_AVISO_SEG = 60;

    constructor(
        private http: HttpClient,
        private router: Router
    ) { }

    register(userData: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/register`, userData);
    }

    login(credentials: { email: string; password: string }): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
            tap(response => {
                localStorage.setItem('token', response.access_token);
                localStorage.setItem('usuario', JSON.stringify(response.usuario));
                this.iniciarContadorSesion();
            })
        );
    }

    validarToken(): Observable<any> {
        return this.http.get(`${this.apiUrl}/validate`).pipe(
            catchError(() => of(null))
        );
    }

    iniciarContadorSesion(): void {
    this.limpiarContador();

    this.tiempoRestante.set(this.DURACION_SESION_SEG);

    this.intervalReloj = setInterval(() => {
        this.tiempoRestante.update(t => (t > 0 ? t - 1 : 0));
    }, 1000);

    const tiempoHastaAvisoMs = (this.DURACION_SESION_SEG - this.TIEMPO_AVISO_SEG) * 1000;

    this.contadorSesion = setTimeout(() => {
        Swal.fire({
            title: '¿Seguimos?',
            text: 'Tu sesión está por expirar. Te queda 1 minuto.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Extender sesión',
            cancelButtonText: 'Salir',
            background: '#1e293b',
            color: '#f8fafc',
            confirmButtonColor: '#2563eb',
            cancelButtonColor: '#475569',
            allowOutsideClick: false,
            timer: (this.TIEMPO_AVISO_SEG - 2) * 1000,
            timerProgressBar: true
        }).then((result) => {
            if (result.isConfirmed) {
                this.refrescarToken();
            } else {
                this.logout();
            }
        });
    }, tiempoHastaAvisoMs);
}

limpiarContador(): void {
    if (this.contadorSesion) {
        clearTimeout(this.contadorSesion);
        this.contadorSesion = null;
    }
    if (this.intervalReloj) {
        clearInterval(this.intervalReloj);
        this.intervalReloj = null;
    }
}

    refrescarToken(): void {
        this.http.post<{ access_token: string }>(`${this.apiUrl}/refresh`, {}).subscribe({
            next: (res) => {
                localStorage.setItem('token', res.access_token);
                this.iniciarContadorSesion(); 
                
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'success',
                    title: 'Sesión extendida',
                    showConfirmButton: false,
                    timer: 2000,
                    background: '#1e293b',
                    color: '#f8fafc'
                });
            },
            error: () => {
                this.logout();
            }
        });
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
        return usuario?.perfil === 'admin';
    }

    logout(): void {
        this.limpiarContador();
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        this.router.navigate(['/login']);
    }
}