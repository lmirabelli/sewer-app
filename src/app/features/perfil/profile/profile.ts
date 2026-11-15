import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { PostService } from '../../../core/services/post.service';
import { Post } from '../../../core/models/post';
import { environment } from '../../../../enviroment/enviroment';
import { ProfilePosts } from '../profile-posts/profile-posts';
import { ProfileHeader } from '../profile-header/profile-header';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ProfileHeader,
    ProfilePosts
  ],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class Profile implements OnInit {
  profileForm!: FormGroup;
  cargando = signal<boolean>(true);
  cargandoPosts = signal<boolean>(true);
  editando = signal<boolean>(false);
  misUltimosPosts = signal<Post[]>([]);
  mensajeExito: string = '';
  errorMensaje: string = '';
  usuarioData: any = {};
  backendUrl = environment.backendUrl;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private postService: PostService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.cargarDatosDesdeBD();
  }

  initForm(): void {
    this.profileForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required]],
      username: [''],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      passwordActual: ['', [Validators.required]],
      passwordNueva: ['', [Validators.minLength(6)]]
    });
  }

  cargarDatosDesdeBD(): void {
    this.cargando.set(true);
    this.cargandoPosts.set(true);

    this.userService.getProfile().subscribe({
      next: (user: any) => {
        this.usuarioData = user;

        this.profileForm.patchValue({
          nombre: user.nombre || '',
          apellido: user.apellido || '',
          username: user.username || '',
          email: user.email || ''
        });

        this.cargando.set(false);

        const userId = user._id || user.id;
        if (userId) {
          this.cargarUltimosPosts(userId);
        } else {
          this.cargandoPosts.set(false);
        }
      },
      error: (err) => {
        console.error('Error al cargar perfil:', err);
        this.errorMensaje = 'No se pudieron cargar los datos del usuario (verificá tu sesión).';
        this.cargando.set(false);
        this.cargandoPosts.set(false);
      }
    });
  }

  cargarUltimosPosts(userId: string): void {
    this.cargandoPosts.set(true);
    this.postService.getPosts({ usuarioId: userId, limit: 3 }).subscribe({
      next: (posts) => {
        this.misUltimosPosts.set(posts);
        this.cargandoPosts.set(false);
      },
      error: () => {
        this.cargandoPosts.set(false);
      }
    });
  }

  formatearFecha(fecha: string | Date): string {
    if (!fecha) return 'No especificada';
    const d = new Date(fecha);
    if (isNaN(d.getTime())) return String(fecha);

    const day = String(d.getUTCDate()).padStart(2, '0');
    const month = String(d.getUTCMonth() + 1).padStart(2, '0');
    const year = d.getUTCFullYear();

    return `${day}.${month}.${year}`;
  }

  toggleEdicion(): void {
    this.editando.update(val => !val);
    this.mensajeExito = '';
    this.errorMensaje = '';
    if (!this.editando()) {
      this.cargarDatosDesdeBD();
    }
  }

  actualizarPerfil(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.mensajeExito = '';
    this.errorMensaje = '';

    const formValues = this.profileForm.getRawValue();

    // Armamos el objeto base que se va a enviar siempre
    const datosAEnviar: any = {
      nombre: formValues.nombre,
      apellido: formValues.apellido,
      username: formValues.username,
      passwordActual: formValues.passwordActual
    };

    // ¡La magia! Solo agregamos la contraseña nueva si el usuario escribió algo
    if (formValues.passwordNueva && formValues.passwordNueva.trim() !== '') {
      datosAEnviar.passwordNueva = formValues.passwordNueva;
    }

    this.userService.updateProfile(datosAEnviar).subscribe({
      next: () => {
        Swal.fire({
          title: '¡Peefeto Cabashedo!',
          text: 'Los cambios se guardaron correctamente.',
          icon: 'success',
          background: '#1e293b',
          color: '#f8fafc',
          confirmButtonColor: '#2563eb',
          timer: 2000,
          showConfirmButton: false
        });

        this.editando.set(false);
        this.profileForm.patchValue({ passwordActual: '', passwordNueva: '' });
        this.cargarDatosDesdeBD();
      },
      error: (err) => {
        const mensajeError = 'No se actualizo tu perfil';
        
        Swal.fire({
          title: "Anda pa'ya",
          text: mensajeError,
          icon: 'error',
          background: '#1e293b',
          color: '#f8fafc',
          confirmButtonColor: '#2563eb'
        });
      }
    });
  }
}