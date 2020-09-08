import { Component, OnInit, OnDestroy } from '@angular/core';
import { ErrorService } from '../error.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-error',
    templateUrl: './error.component.html',
    styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit, OnDestroy {
    error: string = '';
    errorStatusSubscription: Subscription;

    constructor(private errorService: ErrorService) {}

    ngOnInit() {
        this.errorStatusSubscription = this.errorService.getErrorStatusListener().subscribe(response => {
            this.error = response;
        });
    }

    ngOnDestroy() {
        this.errorStatusSubscription.unsubscribe();
    }
}