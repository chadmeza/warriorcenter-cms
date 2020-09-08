import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { UsersService } from '../users.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  isLoading: boolean = false;
  userStatusSubscription: Subscription;

  constructor(public usersService: UsersService) { }

  ngOnInit() {
    this.userStatusSubscription = this.usersService.getUserStatusListener().subscribe(response => {
      this.isLoading = false;
    });
  }

  onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    }
    
    this.isLoading = true;
    this.usersService.login(form.value.email, form.value.password);
  }

  ngOnDestroy() {
    this.userStatusSubscription.unsubscribe();
  }
}
