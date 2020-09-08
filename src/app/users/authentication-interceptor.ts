import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { UsersService } from './users.service';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {
    constructor(private usersService: UsersService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        const token = this.usersService.getToken();
        const newRequest = req.clone({
            headers: req.headers.set("Authorization", "Bearer " + token)
        })
        return next.handle(newRequest);
    }
}