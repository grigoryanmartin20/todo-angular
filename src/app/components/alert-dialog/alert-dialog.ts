import { Component, inject } from '@angular/core';
// Material
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
// Interfaces
import { AlertDialogData } from '@interfaces/common.interface';

@Component({
	selector: 'app-alert-dialog',
	imports: [MatDialogModule, MatButtonModule],
	templateUrl: './alert-dialog.html',
	styleUrl: './alert-dialog.scss'
})
export class AlertDialog {

	public dialogData = inject<AlertDialogData>(MAT_DIALOG_DATA);
	private dialogRef = inject(MatDialogRef);

	public closeDialogWithResult(result: boolean): void {
		this.dialogRef.close(result);
	}
	
}