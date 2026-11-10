import { Component, signal } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { Navbar } from './features/navbar/navbar';

@Component({
  imports: [RouterOutlet, Navbar],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('frontend');
  protected readonly mostrarNavbar = signal(true);

  constructor(private router: Router) {
    // Escuchamos los cambios de ruta para decidir si mostramos el navbar
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const url = event.urlAfterRedirects;
      // Oculta el navbar si la ruta contiene '/login' o '/register'
      this.mostrarNavbar.set(!url.includes('/login') && !url.includes('/register'));
    });
  }
}