import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { UserRegisterDto } from '../../../core/models/user';
import { RegisterHeader } from '../register-header/register-header';
import { RegisterForm } from '../register-form/register-form';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    RegisterHeader, 
    RegisterForm
  ],
  templateUrl: './register.html'
})
export class Register {
  registerForm: FormGroup;
  selectedFile: File | null = null;
  loading = false;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.registerForm = this.fb.group({
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[A-Z])(?=.*\d)/)]],
      confirmPassword: ['', [Validators.required]],
      fechaNacimiento: ['', [Validators.required]],
      descripcionBreve: [''],
      perfil: ['usuario']
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Atención',
        text: 'Por favor completá correctamente todos los campos obligatorios.',
        background: '#0f172a',
        color: '#f8fafc',
        confirmButtonColor: '#334155'
      });
      return;
    }

    if (this.registerForm.value.password !== this.registerForm.value.confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Las contraseñas no coinciden.',
        background: '#0f172a',
        color: '#f8fafc',
        confirmButtonColor: '#334155'
      });
      return;
    }

    this.loading = true;
    const formData = new FormData();
    const formValues: UserRegisterDto = this.registerForm.value;

    Object.keys(this.registerForm.controls).forEach(key => {
      if (key !== 'confirmPassword') {
        formData.append(key, (formValues as any)[key]);
      }
    });

    if (this.selectedFile) {
      formData.append('avatar', this.selectedFile);
    }

    this.http.post('http://localhost:3000/auth/register', formData).subscribe({
      next: () => {
        this.loading = false;
        Swal.fire({
          icon: 'success',
          title: '¡Bienvenido a la cloaca!',
          text: 'Registro exitoso. Ya podés iniciar sesión.',
          background: '#0f172a',
          color: '#f8fafc',
          confirmButtonColor: '#334155'
        });
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error en el registro',
          text: err.error.message || 'Ocurrió un error inesperado.',
          background: '#0f172a',
          color: '#f8fafc',
          confirmButtonColor: '#334155'
        });
      }
    });
  }
}