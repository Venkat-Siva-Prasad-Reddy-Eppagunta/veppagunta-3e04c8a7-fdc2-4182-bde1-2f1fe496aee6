import { Routes } from '@angular/router';
import { LoginComponent } from './login';
import { TasksComponent } from './tasks';
import { authGuard } from './shared/auth.guard';

export const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'tasks', component: TasksComponent, canActivate: [authGuard] },
  { path: '', pathMatch: 'full', redirectTo: 'tasks' },
  { path: '**', redirectTo: 'tasks' },
];