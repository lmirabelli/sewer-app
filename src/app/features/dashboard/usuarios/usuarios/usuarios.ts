import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { environment } from '../../../../../enviroment/enviroment';
import { RoleColorPipe } from '../../../../core/pipes/role-color-pipe';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, RoleColorPipe],
  templateUrl: './usuarios.html',
  styleUrls: ['./usuarios.css']
})
export class Usuarios implements OnInit {
  private http = inject(HttpClient);

  usuarios = signal<any[]>([]);
  mostrarFormulario = signal(false);
  cargando = signal(true);

  nuevoUsuario = {
    nombre: '',
    apellido: '',
    username: '',
    email: '',
    password: '',
    fechaNacimiento: '',
    perfil: 'usuario'
  };

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.cargando.set(true);
    this.http.get<any[]>(`${environment.backendUrl}/users`).subscribe({
      next: (data) => {
        this.usuarios.set(data);
        this.cargando.set(false);
      },
      error: () => {
        this.cargando.set(false);
        Swal.fire('Error', 'No se pudo cargar la lista de usuarios', 'error');
      }
    });
  }

  cambiarEstado(userId: string): void {
    this.http.patch<any>(`${environment.backendUrl}/users/${userId}/estado`, {}).subscribe({
      next: (res) => {
        this.usuarios.update(lista =>
          lista.map(u => u._id === userId ? { ...u, habilitado: res.habilitado } : u)
        );
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: res.mensaje,
          showConfirmButton: false,
          timer: 2000
        });
      }
    });
  }

  crearUsuario(): void {
    this.http.post(`${environment.backendUrl}/users`, this.nuevoUsuario).subscribe({
      next: () => {
        Swal.fire('Éxito', 'Usuario creado correctamente', 'success');
        this.mostrarFormulario.set(false);
        this.cargarUsuarios();
        this.nuevoUsuario = {
          nombre: '',
          apellido: '',
          username: '',
          email: '',
          password: '',
          fechaNacimiento: '',
          perfil: 'usuario'
        };
      },
      error: (err) => Swal.fire('Error', err.error?.message || 'Error al crear el usuario', 'error')
    });
  }
}