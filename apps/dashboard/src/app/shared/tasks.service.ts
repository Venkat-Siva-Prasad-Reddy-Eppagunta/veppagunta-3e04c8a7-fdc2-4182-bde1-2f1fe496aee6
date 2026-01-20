import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export type Task = {
  id: string;
  title: string;
  description?: string | null;
  category: 'Work' | 'Personal' | 'Other';
  status: 'Todo' | 'InProgress' | 'Done';
  orderIndex: number;
};

@Injectable({ providedIn: 'root' })
export class TasksService {
  private apiBase = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  list() {
    return this.http.get<Task[]>(`${this.apiBase}/tasks`);
  }

  create(payload: { title: string; description?: string; category: Task['category']; status: Task['status'] }) {
    return this.http.post<Task>(`${this.apiBase}/tasks`, payload);
  }

  delete(id: string) {
    return this.http.delete(`${this.apiBase}/tasks/${id}`);
  }
}