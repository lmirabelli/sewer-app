import { Routes } from '@angular/router';
import { Register } from './features/auth/register/register';
import { Login } from './features/auth/login/login';
import { Feed } from './features/feed/feed';
import { authGuard } from './core/guards/auth.guards';
import { Profile } from './features/profile/profile';

export const routes: Routes = [
  { path: 'register', component: Register },
  { path: 'login', component: Login },
  { path: 'feed', component: Feed, canActivate: [authGuard]},
  { path: 'profile', component: Profile, canActivate: [authGuard]},
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];