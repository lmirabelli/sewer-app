import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Post } from '../../../core/models/post';

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
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

  textoComentario: string = '';

  esMiPost(): boolean {
    if (!this.post.autor) return false;
    const autorId = typeof this.post.autor === 'object' ? (this.post.autor as any)._id : this.post.autor;
    return autorId === this.usuarioLogueadoId;
  }

  enviarComentario(): void {
    if (!this.textoComentario.trim()) return;
    this.comentar.emit({ post: this.post, texto: this.textoComentario });
    this.textoComentario = '';
  }
}