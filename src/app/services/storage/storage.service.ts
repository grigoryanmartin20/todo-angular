import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class StorageService {

	public get<T>(key: string): T | null {
		let item: string | null = localStorage.getItem(key);

		if (item) return JSON.parse(item) as T;

		return null;
	}

	public set<T>(key: string, value: T): void {
		localStorage.setItem(key, JSON.stringify(value));
	}
}