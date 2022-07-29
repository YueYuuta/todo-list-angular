import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CreateTodo, Todo } from '../../interfaces/todo';
import { StateService } from '../../services/state.service';
import { TodoService } from '../../services/todo.service';

@Component({
  selector: 'app-add-todo',
  templateUrl: './add-todo.component.html',
  styleUrls: ['./add-todo.component.scss'],
})
export class AddTodoComponent implements OnInit {
  public frmTodo: FormGroup;
  todo: Todo;

  constructor(
    private readonly fb: FormBuilder,
    private readonly todoService: TodoService,
    private router: Router,
    private readonly state: StateService,
    private zone: NgZone
  ) {}

  ngOnInit(): void {
    this.state.todoSelect.subscribe((resp) => (this.todo = resp));
    this.dinamyc();
  }
  private dinamyc() {
    if (this.todo) {
      this.formUpdate();
    } else {
      this.formCreate();
    }
  }
  private formCreate() {
    this.frmTodo = this.fb.group({
      descriptionTodo: [null, [Validators.maxLength(50), Validators.required]],
      finishAt: [null, [Validators.required]],
    });
  }
  private formUpdate() {
    this.frmTodo = this.fb.group({
      descriptionTodo: [
        this.todo.description,
        [Validators.maxLength(50), Validators.required],
      ],
      finishAt: [this.todo.finish_at, [Validators.required]],
    });
  }

  onClickAdd() {
    const todo = this.frmTodo.value;
    if (this.todo) {
      this.update(todo);
    } else {
      this.create(todo);
    }
  }
  private create(todo: any) {
    const createTodo: CreateTodo = {
      description: todo.descriptionTodo,
      finish_at: todo.finishAt,
      status: 0,
      id_author: 12,
    };
    this.todoService.create(createTodo).subscribe(
      (data) => {
        console.log('creado correctamente');
        this.zone.run(() => {
          this.router.navigate(['/']);
        });
      },
      (err) => {
        console.log('no se creo correctamente');
      }
    );
  }
  private update(todo: any) {
    const createTodo: CreateTodo = {
      description: todo.descriptionTodo,
      finish_at: todo.finishAt,
      status: this.todo.status,
      id_author: this.todo.id_author,
    };
    this.todoService.update(this.todo.id, createTodo).subscribe(
      (data) => {
        console.log('Editado correctamente');
        this.zone.run(() => {
          this.router.navigate(['/']);
        });
      },
      (err) => {
        console.log('no se Edito correctamente');
      }
    );
  }
}
