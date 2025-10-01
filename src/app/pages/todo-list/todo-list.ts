import { Component, inject, OnInit, signal } from '@angular/core';
// Material
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
// Packages
import { FlexLayoutModule } from '@ngbracket/ngx-layout';
// Interfaces
import { Todo } from '@interfaces/todo.interface';
// Services
import { TodoService } from '@services/todo/todo.service';
// Components
import { TodoDialog } from './todo-dialog/todo-dialog';
import { TodoItem } from './todo-item/todo-item';

@Component({
	selector: 'app-todo-list',
	imports: [MatButtonModule, MatIconModule, FlexLayoutModule, MatDialogModule, TodoItem],
	templateUrl: './todo-list.html',
	styleUrl: './todo-list.scss'
})
export class TodoList implements OnInit {

	public todoList = signal<Array<Todo>>([]);
	private dialog = inject(MatDialog);
	private todoService = inject(TodoService);

	public ngOnInit(): void {
		this.todoList.set(this.todoService.getTodos());
	}

	public openTodoDialog(todo: Todo): void {
		this.dialog.open(TodoDialog, {
			minWidth: '700px',
			autoFocus: false,
			data: todo
		}).afterClosed().subscribe((item: Todo) => {
			if (item) {
				if (todo) {
					this.todoList.set(this.todoList().map(
						(currentTodo: Todo) => item.uuid === currentTodo.uuid ? item : currentTodo
					));
				} else {
					this.todoList.set([...this.todoList(), item]);
				}
			}
		});
	}
}