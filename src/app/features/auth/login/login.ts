import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import Swal from 'sweetalert2';
import { LoginHeader } from '../login-header/login-header';
import { LoginForm } from '../login-form/login-form';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LoginHeader,
    LoginForm
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onLogin(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }


    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.router.navigate(['/feed']);
      },
      error: (err) => {
        console.error('Error en el login', err);
        
        const mensajeError = err.error?.message || 'Verificá tu correo y contraseña.';

        Swal.fire({
          icon: 'error',
          title: '¡Anda pa`ya!',
          text: mensajeError,
          background: '#1e293b',
          color: '#f8fafc',
          confirmButtonColor: '#2563eb',
          confirmButtonText: 'intentarlo otra vez'
        });
      }
    });
  }
}