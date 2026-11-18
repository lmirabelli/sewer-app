import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading.html',
  styleUrls: ['./loading.css']
})
export class Loading implements OnInit {
  
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    const token = this.authService.getToken();

    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    this.authService.validarToken().subscribe({
      next: (res) => {
        if (res) {
          this.authService.iniciarContadorSesion(); 
          this.router.navigate(['/feed']);
        } else {
          this.authService.logout();
        }
      },
      error: () => {
        this.authService.logout();
      }
    });
  }
}