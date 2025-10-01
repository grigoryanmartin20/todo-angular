import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// Material
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { provideNativeDateAdapter } from '@angular/material/core';
// Packages
import { FlexLayoutModule } from '@ngbracket/ngx-layout';
import { v4 as uuidv4 } from 'uuid';
import { timer } from 'rxjs';
// Interfaces
import { Todo, TodoFormControls } from '@interfaces/todo.interface';
// Services
import { TodoService } from '@services/todo/todo.service';

@Component({
	selector: 'app-todo-dialog',
	imports: [
		MatDialogModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, 
		MatButtonModule, MatCardModule, MatDatepickerModule, MatIconModule, FlexLayoutModule,
	],
	providers: [provideNativeDateAdapter()],
	templateUrl: './todo-dialog.html',
	styleUrl: './todo-dialog.scss'
})
export class TodoDialog implements OnInit {

	public form: FormGroup<TodoFormControls> = null;
	private snackBar = inject(MatSnackBar);
	private dialogRef = inject(MatDialogRef);
	private dialogData = inject<Todo>(MAT_DIALOG_DATA);
	private todoService = inject(TodoService);

	public ngOnInit(): void {
		this.initForm();
		this.handleStartDateValueChanges();
		this.handleEndDateValueChanges();
		this.handleDueDateValueChanges();
	}

	public initForm(): void {
		this.form = new FormGroup<TodoFormControls>({
			uuid: new FormControl<string>(this.dialogData?.uuid || uuidv4()),
			title: new FormControl<string>(this.dialogData?.title || '', Validators.required),
			description: new FormControl<string>(this.dialogData?.description || '', Validators.maxLength(1000)),
			dueDate: new FormControl<Date | null>(this.dialogData?.dueDate || null),
			startDate: new FormControl<Date | null>(this.dialogData?.startDate || null),
			endDate: new FormControl<Date | null>(this.dialogData?.endDate || null),
			createdAt: new FormControl<Date>(this.dialogData?.createdAt || new Date())
		});
	}

	public saveTodo(): void {
		if (this.form.invalid) return this.showSnackBar('Please fill in all required fields');

		if (this.dialogData) this.todoService.updateTodo(this.form.value as Todo);
		else this.todoService.addTodo(this.form.value as Todo);

		this.dialogRef.close(this.form.value);
	}

	private handleStartDateValueChanges(): void {
		this.form.get('startDate').valueChanges.subscribe(() => {
			let startDate: Date | null = this.form.get('startDate').value;
			let endDate: Date | null = this.form.get('endDate').value;

			this.form.get('dueDate').setValue(null, { emitEvent: false });

			if (startDate && endDate && startDate > endDate) {
				this.showSnackBar('Start date cannot be later than end date');

				timer(10).subscribe(() => {
					this.form.get('startDate').setValue(null, { emitEvent: false });
				});
			}
		});
	}

	private handleEndDateValueChanges(): void {
		this.form.get('endDate').valueChanges.subscribe(() => {
			let startDate: Date | null = this.form.get('startDate').value;
			let endDate: Date | null = this.form.get('endDate').value;

			this.form.get('dueDate').setValue(null, { emitEvent: false });

			if (startDate && endDate && startDate > endDate) {
				this.showSnackBar('End date cannot be earlier than start date');

				timer(10).subscribe(() => {
					this.form.get('endDate').setValue(null, { emitEvent: false });
				});
			}
		});
	}

	private handleDueDateValueChanges(): void {
		this.form.get('dueDate').valueChanges.subscribe(() => {
			this.form.get('startDate').setValue(null, { emitEvent: false });
			this.form.get('endDate').setValue(null, { emitEvent: false });
		});
	}

	private showSnackBar(message: string): void {
		this.snackBar.open(message, null, { duration: 5000, verticalPosition: 'top' });
	}
}