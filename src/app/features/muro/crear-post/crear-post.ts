import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Post } from '../../../core/models/post';
import { PostService } from '../../../core/services/post.service';

@Component({
  selector: 'app-crear-post',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-post.html'
})
export class CrearPost {
  nuevoPostTitulo: string = '';
  nuevoPostCuerpo: string = '';

  @Output() postCreado = new EventEmitter<Post>();

  constructor(private postService: PostService) {}

  crearPost(): void {
  if (!this.nuevoPostTitulo.trim() || !this.nuevoPostCuerpo.trim()) return;

  const payload = {
    titulo: this.nuevoPostTitulo,
    cuerpo: this.nuevoPostCuerpo
  };

  this.postService.createPost(payload).subscribe({
    next: (post) => {
      this.postCreado.emit(post);
      this.nuevoPostTitulo = '';
      this.nuevoPostCuerpo = '';
    },
    error: (err) => {
      console.error('Error al crear el post:', err);
    }
  });
}
}