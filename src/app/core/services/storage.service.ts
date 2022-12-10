import { Injectable } from '@angular/core';
import { UtilityService } from './utility.service';

@Injectable({
    providedIn: 'root',
})
export class StorageService {
    constructor(
        private utilitySV: UtilityService
    ) {
    }

    isset(key: string): boolean {
        return localStorage.getItem(key) !== null;
    }

    get(key: string): (any | null) {
        if (this.isset(key)) {
            const value: any = localStorage.getItem(key);
            if (this.utilitySV.isJsonString(value)) {
                return JSON.parse(value);
            }
            return value;
        }
        return null;
    }

    set(key: string, value: any): void {
        localStorage.setItem(key, JSON.stringify(value));
    }

    remove(key: any): void {
        localStorage.removeItem(key);
    }
}
