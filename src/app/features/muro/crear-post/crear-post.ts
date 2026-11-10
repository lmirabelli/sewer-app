
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
  nuevoPostTexto: string = '';

  @Output() postCreado = new EventEmitter<Post>();

  constructor(private postService: PostService) {}

  crearPost(): void {
    if (!this.nuevoPostTexto.trim()) return;

    this.postService.createPost(this.nuevoPostTexto).subscribe({
      next: (post) => {
        this.postCreado.emit(post);
        this.nuevoPostTexto = '';
      },
      error: (err) => {
        console.error('Error al crear el post:', err);
      }
    });
  }
}