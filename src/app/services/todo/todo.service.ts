import { inject, Injectable } from '@angular/core';
// Interfaces
import { Todo } from '@interfaces/todo.interface';
// Services
import { StorageService } from '@services/storage/storage.service';

@Injectable({
	providedIn: 'root'
})
export class TodoService {

	private storage = inject(StorageService);
	
	public getTodos(): Array<Todo> {
		return this.storage.get<Array<Todo>>('todos') || [];
	}

	public addTodo(todo: Todo): void {
		let todos: Array<Todo> = this.getTodos();

		todos.push(todo);
		
		this.storage.set('todos', todos);
	}

	public updateTodo(todo: Todo): void {
		let todos: Array<Todo> = this.getTodos();

		todos = todos.map((item: Todo) => item.uuid === todo.uuid ? todo : item);

		this.storage.set('todos', todos);
	}
}