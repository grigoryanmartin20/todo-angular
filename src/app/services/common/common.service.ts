import { inject, Injectable } from '@angular/core';
// Material
import { MatDialog } from '@angular/material/dialog';
// Interfaces
import { AlertDialogData } from '@interfaces/common.interface';
// Components
import { AlertDialog } from '@components/alert-dialog/alert-dialog';

@Injectable({
	providedIn: 'root'
})
export class CommonService {

	private dialog = inject(MatDialog);

	public openAlertDialog(data: AlertDialogData): void {
		this.dialog.open(AlertDialog, { 
			minWidth: '400px',
			autoFocus: false,
			data
		}).afterClosed().subscribe((result: boolean) => {
			if (data?.callback) data.callback(result);
		});
	}
}