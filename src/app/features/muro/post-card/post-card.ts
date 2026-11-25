import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Post, Comentario } from '../../../core/models/post';
import { TimeAgoPipe } from '../../../core/pipes/time-ago-pipe';
import { TruncatePipe } from '../../../core/pipes/truncate-pipe';
import { HoverDirective } from '../../../core/directives/hover';
import { HighlightDirective } from '../../../core/directives/highlight';


@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [CommonModule, FormsModule, TimeAgoPipe, TruncatePipe, HoverDirective, HighlightDirective],
  templateUrl: './post-card.html'
})
export class PostCard {
  @Input() post!: Post;
  @Input() usuarioLogueadoId: string = '';
  @Input() backendUrl: string = '';
  @Input() comentariosAbiertos: boolean = false;

  @Output() like = new EventEmitter<Post>();
  @Output() eliminar = new EventEmitter<string>();
  @Output() toggleComentarios = new EventEmitter<Post>();
  @Output() comentar = new EventEmitter<{ post: Post; texto: string }>();
  @Output() editarComentario = new EventEmitter<{ postId: string; commentId: string; texto: string }>();

  textoComentario: string = '';

  comentarioEnEdicionId: string | null = null;
  textoEdicion: string = '';

  esMiPost(): boolean {
    if (!this.post.autor) return false;
    const autorId = typeof this.post.autor === 'object' ? (this.post.autor as any)._id : this.post.autor;
    return autorId === this.usuarioLogueadoId;
  }

  esMiComentario(comentario: Comentario): boolean {
    if (!comentario.usuario) return false;
    const autorId = typeof comentario.usuario === 'object'
      ? (comentario.usuario as any)._id
      : comentario.usuario;
    return autorId === this.usuarioLogueadoId;
  }

  enviarComentario(): void {
    if (!this.textoComentario.trim()) return;
    this.comentar.emit({ post: this.post, texto: this.textoComentario });
    this.textoComentario = '';
  }

  iniciarEdicion(comentario: Comentario): void {
    if (!comentario._id) return;
    this.comentarioEnEdicionId = comentario._id;
    this.textoEdicion = comentario.texto;
  }

  cancelarEdicion(): void {
    this.comentarioEnEdicionId = null;
    this.textoEdicion = '';
  }

  guardarEdicion(comentario: Comentario): void {
    if (!comentario._id || !this.textoEdicion.trim()) return;
    this.editarComentario.emit({
      postId: this.post._id!,
      commentId: comentario._id,
      texto: this.textoEdicion.trim()
    });
    this.cancelarEdicion();
  }

  puedeEliminar(): boolean {
    if (!this.post.autor) return false;
    
    const autorId = typeof this.post.autor === 'object' ? (this.post.autor as any)._id : this.post.autor;
    const esDueño = autorId === this.usuarioLogueadoId;

    let esAdmin = false;
    const usuarioStorage = localStorage.getItem('usuario');
    if (usuarioStorage) {
      try {
        const usuario = JSON.parse(usuarioStorage);
        esAdmin = usuario.perfil === 'admin';
      } catch (e) {}
    }

    return esDueño || esAdmin;
  }
}