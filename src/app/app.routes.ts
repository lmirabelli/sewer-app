import { Routes } from '@angular/router';
import { Register } from './features/auth/register/register';
import { Login } from './features/auth/login/login';
import { authGuard } from './core/guards/auth.guards';
import { Feed } from './features/muro/feed/feed';
import { Profile } from './features/perfil/profile/profile';

export const routes: Routes = [
  { path: 'register', component: Register },
  { path: 'login', component: Login },
  { path: 'feed', component: Feed, canActivate: [authGuard]},
  { path: 'profile', component: Profile, canActivate: [authGuard]},
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];