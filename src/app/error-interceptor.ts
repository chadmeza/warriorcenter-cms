import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ErrorService } from './error.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private errorService: ErrorService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        return next.handle(req).pipe(
            catchError((errorResponse: HttpErrorResponse) => {
                let errorMessage = "An unknown error occurred!";
              
                if (errorResponse.error.error) {
                    errorMessage = errorResponse.error.error;
                }

                this.errorService.setError(errorMessage);
              
                return throwError(errorResponse);
            }));
    }
}