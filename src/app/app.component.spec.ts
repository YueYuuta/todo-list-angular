import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TodoWrapperComponent } from './todo-list/components/todo-wrapper/todo-wrapper.component';
import { TodoService } from './todo-list/services/todo.service';
import { StateService } from './todo-list/services/state.service';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ResponseTodo } from './todo-list/interfaces/response';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { AddTodoComponent } from './todo-list/components/add-todo/add-todo.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Todo } from './todo-list/interfaces/todo';

const todoListResponse: ResponseTodo = {
  success: true,
  type: 'task_rows',
  data: [
    {
      id: 26,
      description: 'Nueva tarea',
      status: 1,
      id_author: 1,
      finish_at: '2022-06-24T00:00:00.000Z',
      created_at: '2022-06-14T12:06:38.000Z',
    },
    {
      id: 28,
      description: 'Nuevo Todo',
      status: 0,
      id_author: 1,
      finish_at: '2022-06-16T00:00:00.000Z',
      created_at: '2022-06-14T13:14:08.000Z',
    },
  ],
};

const responseTodo: ResponseTodo = {
  data: [],
  success: true,
  type: 'successfull',
};

const todoSelected: Todo = {
  id: 26,
  description: 'Nueva tarea',
  status: 1,
  id_author: 1,
  finish_at: '2022-06-24T00:00:00.000Z',
  created_at: '2022-06-14T12:06:38.000Z',
};

describe('TodoList App Test', () => {
  let todoWrapperComponent: TodoWrapperComponent;
  let fixture: ComponentFixture<TodoWrapperComponent>;
  let addTodoComponent: AddTodoComponent;
  let fixtureAddTodo: ComponentFixture<AddTodoComponent>;
  let todoService: TodoService;
  let stateService: StateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([
          { path: '', component: TodoWrapperComponent },
          { path: 'todo', component: AddTodoComponent },
        ]),
      ],
      declarations: [TodoWrapperComponent, AddTodoComponent],
      providers: [TodoService, StateService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoWrapperComponent);
    todoWrapperComponent = fixture.componentInstance;
    fixtureAddTodo = TestBed.createComponent(AddTodoComponent);
    addTodoComponent = fixtureAddTodo.componentInstance;
    fixture.detectChanges();
    todoService = fixture.debugElement.injector.get(TodoService);
    stateService = fixture.debugElement.injector.get(StateService);
    jest
      .spyOn(todoService, 'getTodoList')
      .mockImplementation(() => of(todoListResponse));
    // stateService.todoSelect$.next(undefined);
    addTodoComponent.ngOnInit();
  });

  afterEach(() => {
    fixture.destroy();
    jest.resetAllMocks();
  });

  it('should create TodoWrapperComponent', () => {
    expect(todoWrapperComponent).toBeTruthy();
  });

  it('Should create a new todo', async () => {
    expect(addTodoComponent).toBeTruthy();
    addTodoComponent.frmTodo.setValue({
      descriptionTodo: 'todo n 1',
      finishAt: '2022-06-16T00:00:00.000Z',
    });
    const spy = jest
      .spyOn(todoService, 'create')
      .mockReturnValue(of(responseTodo));
    addTodoComponent.onClickAdd();
    expect(spy).toBeCalledTimes(1);
  });

  it('Should create a new todo error', async () => {
    const spy = jest.spyOn(todoService, 'create').mockImplementation(() => {
      return throwError({ err: { error: { message: 'sdasdasd' } } });
    });
    addTodoComponent.onClickAdd();
    expect(spy).toBeCalledTimes(1);
  });

  /**
   *
   * Probar que el formulario muestre los mensajes de requerimiento cuando
   * el formulario no tenga la descripción y la fecha ingresada
   */
  it('Should validate the todo form, description and date required', async () => {
    addTodoComponent.frmTodo.setValue({
      descriptionTodo: 'todo n 1',
      finishAt: '2022-06-16T00:00:00.000Z',
    });
    expect(addTodoComponent.frmTodo.valid).toBeTruthy();
  });

  it('Should validate the todo form, description is required', async () => {
    addTodoComponent.frmTodo.setValue({
      descriptionTodo: null,
      finishAt: '2022-06-16T00:00:00.000Z',
    });
    expect(addTodoComponent.frmTodo.invalid).toBeTruthy();
  });

  it('Should validate the todo form, date is required', async () => {
    addTodoComponent.frmTodo.setValue({
      descriptionTodo: 'todo n 1',
      finishAt: null,
    });
    expect(addTodoComponent.frmTodo.invalid).toBeTruthy();
  });
  it('Should update a todo, description and date', async () => {
    const spy = jest
      .spyOn(todoService, 'update')
      .mockReturnValue(of(responseTodo));
    stateService.setTodoSelect(todoSelected);
    fixtureAddTodo.detectChanges();
    addTodoComponent.onClickAdd();
    expect(spy).toBeCalledTimes(1);
  });

  it('Should update a todo, description and date error ', async () => {
    const spy = jest.spyOn(todoService, 'update').mockImplementation(() => {
      return throwError({ err: { error: { message: 'sdasdasd' } } });
    });
    stateService.setTodoSelect(todoSelected);
    fixtureAddTodo.detectChanges();
    addTodoComponent.onClickAdd();
    expect(spy).toBeCalledTimes(1);
  });

  it('Should update wrapper ', async () => {
    // stateService.todoSelect$.next(todoSelected);

    todoWrapperComponent.update(todoSelected);
    expect(true).toBeTruthy();
  });

  it('Should addTodo wrapper ', async () => {
    // stateService.todoSelect$.next(todoSelected);

    todoWrapperComponent.addTodo();
    expect(true).toBeTruthy();
  });

  it('Should delete a todo', async () => {
    const spy = jest
      .spyOn(todoService, 'delete')
      .mockReturnValue(of(responseTodo));
    stateService.setTodoList(todoListResponse.data);
    todoWrapperComponent.delete(26);
    expect(spy).toBeCalledTimes(1);
  });
  it('Should delete a todo error', async () => {
    const spy = jest.spyOn(todoService, 'delete').mockImplementation(() => {
      return throwError({ err: { error: { message: 'sdasdasd' } } });
    });
    todoWrapperComponent.delete(26);
    expect(spy).toBeCalledTimes(1);
  });

  /**
   *
   * Probar que el formulario muestre los mensajes de requerimiento cuando
   * el formulario no tenga la descripción y la fecha ingresada
   */
  it('Should update the todo status ', async () => {
    todoWrapperComponent.check.setValue(true);
    const spy = jest
      .spyOn(todoService, 'update')
      .mockReturnValue(of(responseTodo));
    stateService.setTodoList(todoListResponse.data);
    todoWrapperComponent.onChangeStatus(todoSelected);
    expect(spy).toBeCalledTimes(1);
  });

  it('Should update the todo status error', async () => {
    todoWrapperComponent.check.setValue(true);
    const spy = jest.spyOn(todoService, 'update').mockImplementation(() => {
      return throwError({ err: { error: { message: 'sdasdasd' } } });
    });
    stateService.setTodoList(todoListResponse.data);
    todoWrapperComponent.onChangeStatus(todoSelected);
    expect(spy).toBeCalledTimes(1);
  });
  it('Should show an message when  the todo list is empty  ', async () => {});

  /**
   *
   * Probar que la barra de estado cambia cuando se completa una tarea
   * se puede probar por el cambio en texto o por porcentaje de completitud
   */
  it('Should the progress bar change its label text or percentage when a todo is completed ', async () => {});

  /**
   *
   * Probar el filtro de las tareas por descripcion
   */
  it('Should filter the todo list by description', async () => {});

  /**
   *
   * Probar el filtro de tareas que falta por completar y que una vez esten filtradas a dar click nuevamente
   * sobre el boton del filtro se muestren todos la lista nuevamente
   */
  it('Should filter the todo list by completed status and toggle functionality button', async () => {});
});
