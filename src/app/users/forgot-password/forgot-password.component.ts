import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { UsersService } from '../users.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  isLoading: boolean = false;
  isPasswordReset: boolean = false;
  hasError: boolean = false;
  userStatusSubscription: Subscription;

  constructor(public usersService: UsersService) { }

  ngOnInit() {
    this.userStatusSubscription = this.usersService.getUserStatusListener().subscribe(response => {
      this.isLoading = false;
    });
  }

  onResetPassword(form: NgForm) {
    this.isPasswordReset = false;
    this.hasError = false; 
    
    if (form.invalid) {
      return;
    }
    
    this.isLoading = true;
    this.usersService.forgotPassword(form.value.email)
      .subscribe(() => {
        this.isLoading = false;
        this.isPasswordReset = true;
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
