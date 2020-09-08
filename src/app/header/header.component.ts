import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { UsersService } from '../users/users.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  userIsAuthenticated: boolean = false;

  private userStatusSubscription: Subscription;

  constructor(private usersService: UsersService) { }

  ngOnInit() {
    this.userIsAuthenticated = this.usersService.getIsAuthenticated();

    this.userStatusSubscription = this.usersService.getUserStatusListener().subscribe((isAuthenticated) => {
      this.userIsAuthenticated = isAuthenticated;
    });
  }

  onLogout() {
    this.usersService.logout();
  }

  ngOnDestroy() {
    this.userStatusSubscription.unsubscribe();
  }
}
