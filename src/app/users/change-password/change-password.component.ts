import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { UsersService } from '../users.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit, OnDestroy {
  isLoading: boolean = false;
  isPasswordChanged: boolean = false;
  hasError: boolean = false;
  errorMessage: string = null;
  userStatusSubscription: Subscription;

  constructor(public usersService: UsersService) { }

  ngOnInit() {
    this.userStatusSubscription = this.usersService.getUserStatusListener().subscribe(response => {
      this.isLoading = false;
    });
  }

  onChangePassword(form: NgForm) {
    this.isPasswordChanged = false;
    this.hasError = false;
    
    if (form.invalid) {
      return;
    }

    if (form.value.password !== form.value.confirmPassword) {
      this.errorMessage = 'Passwords do not match. Please try again.'
    }
    
    this.isLoading = true;
    this.usersService.changePassword(form.value.password)
      .subscribe(() => {
        this.isLoading = false;
        this.isPasswordChanged = true;
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
