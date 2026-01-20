import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './shared/auth.service';
import { Task, TasksService } from './shared/tasks.service';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css',
})
export class TasksComponent {
  tasks: Task[] = [];
  loading = false;

  error: string | null = null;
  creating = false;
  deletingId: string | null = null;

  title = '';
  description = '';
  category: Task['category'] = 'Work';
  status: Task['status'] = 'Todo';

  constructor(private tasksApi: TasksService, private auth: AuthService, private router: Router) { }

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this.loading = true;
    this.error = null;

    this.tasksApi.list().subscribe({
      next: (data) => {
        this.tasks = data;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message ?? 'Failed to load tasks';
      },
    });
  }

  create(form: NgForm) {
    this.error = null;

    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    this.creating = true;

    this.tasksApi
      .create({
        title: this.title.trim(),
        description: this.description.trim() ? this.description.trim() : undefined,
        category: this.category,
        status: this.status,
      })
      .subscribe({
        next: () => {
          this.creating = false;
          this.title = '';
          this.description = '';
          form.resetForm({
            title: '',
            description: '',
            category: 'Work',
            status: 'Todo',
          });
          this.refresh();
        },
        error: (err) => {
          this.creating = false;
          this.error = err?.error?.message ?? 'Create failed (Viewer gets 403)';
        },
      });
  }

  delete(id: string) {
    this.error = null;
    this.deletingId = id;

    this.tasksApi.delete(id).subscribe({
      next: () => {
        this.deletingId = null;
        this.refresh();
      },
      error: (err) => {
        this.deletingId = null;
        this.error = err?.error?.message ?? 'Delete failed';
      },
    });
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}