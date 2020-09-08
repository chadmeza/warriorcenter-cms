import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { LayoutModule } from '@angular/cdk/layout';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { EventCreateComponent } from './event-create/event-create.component';
import { EventListComponent } from './event-list/event-list.component';

@NgModule({
  declarations: [EventCreateComponent, EventListComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    LayoutModule,
    ReactiveFormsModule,
    RouterModule
  ]
})
export class EventsModule { }
