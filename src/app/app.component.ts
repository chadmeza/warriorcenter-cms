import { Component, OnInit, OnDestroy } from '@angular/core';
import { UsersService } from './users/users.service';
import { ErrorService } from './error.service';
import { Subscription } from 'rxjs';

declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  errorStatusSubscription: Subscription;

  constructor(private usersService: UsersService, private errorService: ErrorService) {}

  ngOnInit() {
    this.usersService.autoLogin();
    this.errorStatusSubscription = this.errorService.getErrorStatusListener().subscribe(response => {
      $('#errorModal').modal('show');  
    });
  }

  ngOnDestroy() {
    this.errorStatusSubscription.unsubscribe();
  }
}

