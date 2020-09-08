import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UsersService } from './users.service';

@Injectable()
export class AuthenticationGuard implements CanActivate {
    constructor(private usersService: UsersService, private router: Router){}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
        const isAuthenticated = this.usersService.getIsAuthenticated();

        if (!isAuthenticated) {
            this.router.navigate(['/users/login']);
        }

        return isAuthenticated;
    }
}