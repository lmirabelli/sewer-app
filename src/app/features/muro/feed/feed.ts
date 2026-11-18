import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { PostService } from '../../../core/services/post.service';
import { Post, Comentario } from '../../../core/models/post';
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

  ordenSeleccionado = signal<string>('fecha');

  postSeleccionado = signal<Post | null>(null);
  nuevoComentarioModal: string = '';

  paginaActual = signal<number>(1);
  limite: number = 10;
  hasMore = signal<boolean>(true);

  comentariosAbiertos = signal<{ [postId: string]: boolean }>({});
  limiteComentariosVisibles = signal<{ [postId: string]: number }>({});

  comentarioEnEdicionId: string | null = null;
  textoEdicionModal: string = '';

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
    const offset = (this.paginaActual() - 1) * this.limite;

    this.postService.getPosts({
      orden: this.ordenSeleccionado(),
      limit: this.limite,
      offset: offset
    }).subscribe({
      next: (data) => {
        this.posts.set(data);
        this.cargando.set(false);
        this.hasMore.set(data.length === this.limite);
      },
      error: () => {
        this.cargando.set(false);
      }
    });
  }

  cambiarOrden(): void {
    this.paginaActual.set(1);
    this.cargarPosts();
  }

  cambiarPagina(delta: number): void {
    const nuevaPagina = this.paginaActual() + delta;
    if (nuevaPagina >= 1) {
      this.paginaActual.set(nuevaPagina);
      this.cargarPosts();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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
    if (this.paginaActual() === 1) {
      this.posts.update(postsActuales => [nuevoPost, ...postsActuales]);
    }
  }

  darLike(post: Post): void {
    if (!post._id) return;

    this.postService.toggleLike(post._id).subscribe({
      next: (response: any) => {
        const likesActualizados = response.likes || response.post?.likes || response;

        if (Array.isArray(likesActualizados)) {
          this.posts.update(postsActuales =>
            postsActuales.map(p => p._id === post._id ? { ...p, likes: likesActualizados } : p)
          );

          const postEnModal = this.postSeleccionado();
          if (postEnModal && postEnModal._id === post._id) {
            this.postSeleccionado.set({ ...postEnModal, likes: likesActualizados });
          }
        }
      },
      error: (err) => {
        console.error('Error al dar like:', err);
      }
    });
  }

  getLimiteComentarios(postId: string): number {
    return this.limiteComentariosVisibles()[postId] || 3;
  }

  cargarMasComentarios(postId: string, totalComentarios: number): void {
    const actual = this.getLimiteComentarios(postId);
    this.limiteComentariosVisibles.update(current => ({
      ...current,
      [postId]: actual + 5
    }));
  }

  abrirComentarios(post: Post): void {
    if (!post._id) return;
    const estadoActual = this.comentariosAbiertos();
    this.comentariosAbiertos.set({
      ...estadoActual,
      [post._id]: !estadoActual[post._id]
    });
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

  editarComentario(evento: { postId: string; commentId: string; texto: string }): void {
    this.postService.editComment(evento.postId, evento.commentId, evento.texto).subscribe({
      next: (postActualizado) => {
        this.posts.update(lista =>
          lista.map(p => p._id === evento.postId ? postActualizado : p)
        );
        const postEnModal = this.postSeleccionado();
        if (postEnModal && postEnModal._id === evento.postId) {
          this.postSeleccionado.set(postActualizado);
        }
      },
      error: (err) => {
        console.error('Error al editar comentario:', err);
      }
    });
  }

  abrirDetallePost(post: Post): void {
    this.postSeleccionado.set(post);
    this.nuevoComentarioModal = '';
    this.cancelarEdicionModal();
  }

  cerrarDetallePost(): void {
    this.postSeleccionado.set(null);
    this.cancelarEdicionModal();
  }

  comentarDesdeModal(): void {
    const post = this.postSeleccionado();
    if (!post || !post._id || !this.nuevoComentarioModal.trim()) return;

    this.postService.addComment(post._id, this.nuevoComentarioModal).subscribe({
      next: (postActualizado) => {
        this.postSeleccionado.set(postActualizado);
        this.posts.update(lista =>
          lista.map(p => p._id === post._id ? postActualizado : p)
        );
        this.nuevoComentarioModal = '';
      }
    });
  }

  esMiComentario(comentario: Comentario): boolean {
    if (!comentario.usuario) return false;
    const autorId = typeof comentario.usuario === 'object'
      ? (comentario.usuario as any)._id
      : comentario.usuario;
    return autorId === this.usuarioLogueadoId;
  }

  iniciarEdicionModal(comentario: Comentario): void {
    if (!comentario._id) return;
    this.comentarioEnEdicionId = comentario._id;
    this.textoEdicionModal = comentario.texto;
  }

  cancelarEdicionModal(): void {
    this.comentarioEnEdicionId = null;
    this.textoEdicionModal = '';
  }

  guardarEdicionModal(comentario: Comentario): void {
    const post = this.postSeleccionado();
    if (!post || !post._id || !comentario._id || !this.textoEdicionModal.trim()) return;

    this.postService.editComment(post._id, comentario._id, this.textoEdicionModal.trim()).subscribe({
      next: (postActualizado) => {
        this.postSeleccionado.set(postActualizado);
        this.posts.update(lista =>
          lista.map(p => p._id === post._id ? postActualizado : p)
        );
        this.cancelarEdicionModal();
      },
      error: (err) => {
        console.error('Error al editar comentario desde modal:', err);
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }
}