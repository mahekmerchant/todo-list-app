import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TodoItems } from './app.model';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private baseUrl = 'https://localhost:7157/api/Todo';

  constructor(private http: HttpClient) { }

  getTodoItems(userId: string): Observable<TodoItems[]> {
    return this.http.get<TodoItems[]>(`${this.baseUrl}?user=${userId}`);
  }

  addItem(data: { UserId: string, Text: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/`, data);
  }

  deleteItem(userId: string, itemId: any): Observable<any> {
    return this.http.delete(`${this.baseUrl}?user=${userId}&text=${itemId}`);
  }
}