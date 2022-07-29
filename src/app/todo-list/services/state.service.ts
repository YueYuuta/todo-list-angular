import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Todo } from '../interfaces/todo';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  private _todoSelect = new BehaviorSubject<Todo>(undefined);
  private todoSelect$ = this._todoSelect.asObservable();

  private _todoList = new BehaviorSubject<Todo[]>(undefined);
  private todoList$ = this._todoList.asObservable();

  constructor() {}

  get todoSelect(): Observable<Todo> {
    return this.todoSelect$;
  }

  setTodoSelect(value: Todo): void {
    this._todoSelect.next(value);
  }

  get todoList(): Observable<Todo[]> {
    return this.todoList$;
  }

  setTodoList(value: Todo[]): void {
    this._todoList.next(value);
  }
}
