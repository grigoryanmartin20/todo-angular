import { FormControl } from "@angular/forms";

export interface TodoFormControls {
	uuid: FormControl<string>;
	title: FormControl<string>;
	description: FormControl<string>;
	dueDate: FormControl<Date | null>;
	startDate: FormControl<Date | null>;
	endDate: FormControl<Date | null>;
	createdAt: FormControl<Date>;
}

export interface Todo {
	uuid: string;
	title: string;
	description: string;
	completed: boolean;
	failed: boolean;
	dueDate: Date | null;
	startDate: Date | null;
	endDate: Date | null;
	createdAt: Date;
}