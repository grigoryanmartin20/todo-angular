import { Component, inject, OnInit, signal } from '@angular/core';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
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
	imports: [MatButtonModule, MatIconModule, FlexLayoutModule, MatDialogModule, TodoItem, DragDropModule],
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
			maxWidth: '700px',
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

	public markAsComplete(todo: Todo): void {
		todo.completed = true;

		this.updateTodo(todo);
	}

	public markAsFailed(todo: Todo): void {
		todo.failed = true;

		this.updateTodo(todo);
	}

	public deleteTodo(todo: Todo): void {
		this.todoList.set(this.todoList().filter((currentTodo: Todo) => currentTodo.uuid !== todo.uuid));
		this.todoService.deleteTodo(todo);
	}

	public dropToDo(event: CdkDragDrop<Todo>) {
		moveItemInArray(this.todoList(), event.previousIndex, event.currentIndex);
		this.todoService.reorderTodos(this.todoList());
	}

	private updateTodo(todo: Todo): void {
		this.todoList.set(this.todoList().map((item: Todo) => item.uuid === todo.uuid ? todo : item));
		this.todoService.updateTodo(todo);
	}
}