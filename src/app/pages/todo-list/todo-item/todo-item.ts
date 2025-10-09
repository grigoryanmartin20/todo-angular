import { Component, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
// Material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
// Packages
import { FlexLayoutModule } from '@ngbracket/ngx-layout';
// Interfaces
import { Todo } from '@interfaces/todo.interface';
// Services
import { CommonService } from '@services/common/common.service';

@Component({
	selector: 'app-todo-item',
	imports: [
		MatCardModule, FlexLayoutModule, CommonModule, MatButtonModule, 
		MatIconModule, MatMenuModule, DragDropModule
	],
	templateUrl: './todo-item.html',
	styleUrl: './todo-item.scss'
})
export class TodoItem {

	public todo = input<Todo>();
	public openEditDialog = output<void>();
	public onMarkAsComplete = output<void>();
	public onMarkAsFailed = output<void>();
	public onDelete = output<void>();
	private commonService = inject(CommonService);

	public getStatus(): { label: string, color: string } {
		if (this.todo()?.completed) return { label: 'Complete', color: 'green' };

		if (this.isTodoFailed()) return { label: 'Failed', color: 'red' };
		
		return { label: 'In Progress', color: 'orange' };
	}

	public markAsComplete(): void {
		let message: string = this.getMarkAsCompleteErrorMessage();

		if (!message) return this.onMarkAsComplete.emit();

		this.commonService.openAlertDialog({
			title: 'Failed to mark as complete',
			message: message
		});
	}

	public markAsFailed(): void {
		this.onMarkAsFailed.emit();
	}

	public openDeleteConfirmationDialog(): void {
		this.commonService.openAlertDialog({
			title: 'Delete Todo',
			message: 'Are you sure you want to delete this todo?',
			confirmButtonText: 'Delete',
			hasCancelButton: true,
			callback: (result: boolean) => result && this.onDelete.emit()
		});
	}

	public isTodoFailed(): boolean {
		if (this.todo()?.failed) return true;

		if (
			this.todo()?.dueDate && new Date(this.todo()?.dueDate).getTime() < new Date().getTime() ||
			this.todo()?.endDate && new Date(this.todo()?.endDate).getTime() < new Date().getTime()
		) return true;

		return false;
	}

	private getMarkAsCompleteErrorMessage(): string {
		let today: Date = new Date();
		today.setHours(0, 0, 0, 0);

		if (this.todo()?.dueDate) {
			let dueDate: Date = new Date(this.todo()?.dueDate);
			dueDate.setHours(0, 0, 0, 0);
			
			if (dueDate.getTime() !== today.getTime()) {
				return 'You cannot mark this task as complete because the due date is not today';
			}
		}

		if (this.todo()?.startDate && new Date(this.todo()?.startDate).getTime() > today?.getTime()) {
			return 'You cannot mark this task as complete because the start date is in the future';
		}

		if (this.todo()?.endDate && new Date(this.todo()?.endDate).getTime() < today?.getTime()) {
			return 'You cannot mark this task as complete because the end date is in the past';
		}

		return '';
	}
}