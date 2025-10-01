import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
// Material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
// Packages
import { FlexLayoutModule } from '@ngbracket/ngx-layout';
// Interfaces
import { Todo } from '@interfaces/todo.interface';

@Component({
	selector: 'app-todo-item',
	imports: [
		MatCardModule, FlexLayoutModule, CommonModule, MatButtonModule, 
		MatIconModule, MatMenuModule
	],
	templateUrl: './todo-item.html',
	styleUrl: './todo-item.scss'
})
export class TodoItem {

	public todo = input<Todo>();
	public openEditDialog = output<void>();

}