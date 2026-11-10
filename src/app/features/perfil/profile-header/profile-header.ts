import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-header.html'
})
export class ProfileHeader {
  @Input() usuarioData: any = {};
  @Input() backendUrl: string = '';
}