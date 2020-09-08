import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UsersService } from '../users.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, OnDestroy {
  isLoading: boolean = false;
  isUserCreated: boolean = false;
  hasError: boolean = false;
  userStatusSubscription: Subscription;

  constructor(public usersService: UsersService) { }

  ngOnInit() {
    this.userStatusSubscription = this.usersService.getUserStatusListener().subscribe(response => {
      this.isLoading = false;
    });
  }

  onSignup(form: NgForm) {
    this.isUserCreated = false;
    this.hasError = false;
    
    if (form.invalid) {
      return;
    }
    
    this.isLoading = true;
    this.usersService.createUser(form.value.email, form.value.password)
      .subscribe(() => {
        this.isLoading = false;
        this.isUserCreated = true;
      },
      (error) => {
        this.isLoading = false;
        this.hasError = true;
      });
  }

  ngOnDestroy() {
    this.userStatusSubscription.unsubscribe();
  }
}
