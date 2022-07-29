import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseTodo } from '../interfaces/response';
import { tap } from 'rxjs/operators';
import { StateService } from './state.service';
import { CreateTodo, Todo } from '../interfaces/todo';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private readonly ID_AUTOR = 12;
  private readonly ENPOINT = 'https://bp-todolist.herokuapp.com';

  constructor(private http: HttpClient, private readonly state: StateService) {}

  getTodoList(): Observable<ResponseTodo> {
    return this.http
      .get<ResponseTodo>(`${this.ENPOINT}/?id_author=${this.ID_AUTOR}`)
      .pipe(
        tap((resp) => {
          this.state.setTodoList(resp.data);
        })
      );
  }
  delete(id: number): Observable<ResponseTodo> {
    return this.http.delete<ResponseTodo>(`${this.ENPOINT}/${id}`);
  }
  create(todo: CreateTodo): Observable<ResponseTodo> {
    return this.http.post<ResponseTodo>(
      `${this.ENPOINT}/?id_author=${this.ID_AUTOR}`,
      todo
    );
  }
  update(id: number, todo: CreateTodo): Observable<ResponseTodo> {
    return this.http.put<ResponseTodo>(`${this.ENPOINT}/${id}`, todo);
  }
}
