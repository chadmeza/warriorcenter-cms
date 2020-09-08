import { AbstractControl } from '@angular/forms';
import { Observable, Observer, of } from 'rxjs';

export const mp3Validator = (control: AbstractControl): 
    Promise<{ [key: string]: any }> | Observable<{ [key: string]: any }> => {
    if (typeof(control.value) === 'string') {
        return of(null);
    }
  
    const file = control.value as File;
    const fileReader = new FileReader();
    const frObs = Observable.create((observer: Observer<{ [key: string]: any }>) => {
        fileReader.addEventListener('loadend', () => {
            const arr = new Uint8Array(fileReader.result as ArrayBuffer).subarray(0, 4);
        
            let header = '';
            let isValid = false;
        
            for (let i = 0; i < arr.length; i++) {
                header += arr[i].toString(16);
            }

            if (header.includes('494433') || header.includes('FFFB')) {
                isValid = true;
            } else {
                isValid = false;
            }
        
            if (isValid) {
                observer.next(null);
            } else {
                observer.next({ invalidMimeType: true });
            }
        
            observer.complete();
      });
      
      fileReader.readAsArrayBuffer(file);
    });

    return frObs;
};
