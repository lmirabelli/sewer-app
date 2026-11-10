import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { PostService } from '../../../core/services/post.service';
import { Post } from '../../../core/models/post';
import { environment } from '../../../../enviroment/enviroment';
import { CrearPost } from '../crear-post/crear-post';
import Swal from 'sweetalert2';
import { PostCard } from '../post-card/post-card';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, CrearPost, PostCard],
  templateUrl: './feed.html',
  styleUrls: ['./feed.css']
})
export class Feed implements OnInit {
  posts = signal<Post[]>([]);
  cargando = signal<boolean>(true);
  ordenSeleccionado: string = 'fecha';
  
  comentariosAbiertos: { [postId: string]: boolean } = {};
  backendUrl = environment.backendUrl;
  usuarioLogueadoId: string = '';

  constructor(
    private authService: AuthService,
    private postService: PostService
  ) {}

  ngOnInit(): void {
    const userStorage = localStorage.getItem('usuario');
    if (userStorage) {
      try {
        const parsed = JSON.parse(userStorage);
        this.usuarioLogueadoId = parsed.id || parsed._id || '';
      } catch (e) {
        console.error('Error al parsear el usuario del localStorage', e);
      }
    }

    this.cargarPosts();
  }

  cargarPosts(): void {
    this.cargando.set(true);
    this.postService.getPosts({ orden: this.ordenSeleccionado }).subscribe({
      next: (data) => {
        this.posts.set(data);
        this.cargando.set(false);
      },
      error: () => {
        this.cargando.set(false);
      }
    });
  }

  cambiarOrden(): void {
    this.cargarPosts();
  }

  eliminarPost(postId: string): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Vas a eliminar esta publicación de la cloaca.',
      icon: 'warning',
      showCancelButton: true,
      background: '#1e293b',
      color: '#f8fafc',
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#475569',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.postService.deletePost(postId).subscribe({
          next: () => {
            this.posts.update(postsActuales => postsActuales.filter(p => p._id !== postId));
          }
        });
      }
    });
  }

  agregarPostALista(nuevoPost: Post): void {
    this.posts.update(postsActuales => [nuevoPost, ...postsActuales]);
  }

  darLike(post: Post): void {
    if (!post._id) return;

    this.postService.toggleLike(post._id).subscribe({
      next: (postActualizado) => {
        this.posts.update(postsActuales =>
          postsActuales.map(p => p._id === post._id ? { ...p, likes: postActualizado.likes } : p)
        );
      }
    });
  }

  abrirComentarios(post: Post): void {
    if (!post._id) return;
    this.comentariosAbiertos[post._id] = !this.comentariosAbiertos[post._id];
  }

  enviarComentario(evento: { post: Post; texto: string }): void {
    const postId = evento.post._id;
    if (!postId) return;

    this.postService.addComment(postId, evento.texto).subscribe({
      next: (postActualizado) => {
        evento.post.comentarios = postActualizado.comentarios;
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }
}