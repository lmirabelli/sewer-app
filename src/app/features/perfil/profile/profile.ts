import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { PostService } from '../../../core/services/post.service';
import { Post } from '../../../core/models/post';
import { environment } from '../../../../enviroment/enviroment';
import { ProfilePosts } from '../profile-posts/profile-posts';
import { ProfileHeader } from '../profile-header/profile-header';

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
  cargando: boolean = true;
  cargandoPosts = signal<boolean>(true);
  misUltimosPosts = signal<Post[]>([]);
  mensajeExito: string = '';
  errorMensaje: string = '';
  usuarioData: any = {};
  backendUrl = environment.backendUrl;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private postService: PostService
  ) {}

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
      passwordNueva: ['', [Validators.minLength(6)]]
    });
  }

  cargarDatosDesdeBD(): void {
    this.cargando = true;
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

        this.cargando = false;

        const userId = user._id || user.id;
        if (userId) {
          this.cargarUltimosPosts(userId);
        } else {
          this.cargandoPosts.set(false);
        }
      },
      error: () => {
        this.errorMensaje = 'No se pudieron cargar los datos del usuario.';
        this.cargando = false;
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

  actualizarPerfil(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.mensajeExito = '';
    this.errorMensaje = '';

    this.userService.updateProfile(this.profileForm.value).subscribe({
      next: () => {
        this.mensajeExito = '¡Perfil actualizado correctamente!';
        this.profileForm.patchValue({ passwordNueva: '' });
      },
      error: (err) => {
        this.errorMensaje = err.error?.message || 'Hubo un error al actualizar el perfil.';
      }
    });
  }
}