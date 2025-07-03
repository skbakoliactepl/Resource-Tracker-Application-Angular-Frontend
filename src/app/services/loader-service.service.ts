import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderServiceService {

  constructor() { }
  private _loading = new BehaviorSubject<boolean>(false);
  readonly loading$ = this._loading.asObservable();

  show(): void {
    console.log('Loader shown');
    this._loading.next(true);
  }

  hide(): void {
    console.log('Loader hidden');
    this._loading.next(false);
  }
}
