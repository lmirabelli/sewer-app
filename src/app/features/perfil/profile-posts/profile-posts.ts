import { Component, Input, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Post } from '../../../core/models/post';

@Component({
  selector: 'app-profile-posts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-posts.html'
})
export class ProfilePosts {
  @Input() cargandoPosts!: Signal<boolean>;
  @Input() misUltimosPosts!: Signal<Post[]>;
}