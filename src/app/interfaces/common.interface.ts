export interface AlertDialogData {
	title: string;
	message: string;
	confirmButtonText?: string;
	cancelButtonText?: string;
	hasCancelButton?: boolean;
	callback?: (result: boolean) => void;
}