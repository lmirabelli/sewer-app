import { Routes } from '@angular/router';
import { Register } from './features/auth/register/register';
import { Login } from './features/auth/login/login';
import { authGuard } from './core/guards/auth.guards';
import { Feed } from './features/muro/feed/feed';
import { Profile } from './features/perfil/profile/profile';
import { Loading } from './features/loading/loading';
import { Dashboard } from './features/dashboard/dashboard/dashboard';
import { adminGuard } from './core/guards/admin.guards';
import { Usuarios } from './features/dashboard/usuarios/usuarios/usuarios';
import { Estadisticas } from './features/dashboard/estadisticas/estadisticas/estadisticas';

export const routes: Routes = [
  { path: 'loading', component: Loading },
  { path: 'register', component: Register },
  { path: 'login', component: Login },
  { path: 'feed', component: Feed, canActivate: [authGuard]},
  { path: 'profile', component: Profile, canActivate: [authGuard]},
  { path: 'dashboard', component: Dashboard, canActivate: [authGuard, adminGuard],
    children: [{ path: 'usuarios', component: Usuarios },{ path: 'estadisticas', component: Estadisticas },{ path: '', redirectTo: 'usuarios', pathMatch: 'full' }]
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];