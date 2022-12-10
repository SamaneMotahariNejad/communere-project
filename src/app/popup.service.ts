import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PopupService {

  dataChange = new Subject<any>();

  constructor() { }

  showData(outer_data: any) {
    this.dataChange.next(outer_data);
  }

  getData(): Observable<any> {
    return this.dataChange.asObservable();
  }
}
