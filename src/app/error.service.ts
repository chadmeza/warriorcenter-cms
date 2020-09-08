import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  private error: string;
  private errorStatusListener = new Subject<string>();

  constructor() { }

  getErrorStatusListener() {
    return this.errorStatusListener.asObservable();
  }

  getError() {
    return this.error;
  }

  setError(newError: string) {
    this.error = newError;
    this.errorStatusListener.next(this.error);
  }
}
