import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LayoutModule } from '@angular/cdk/layout';
import { RouterModule } from '@angular/router';

import { SermonCreateComponent } from './sermon-create/sermon-create.component';
import { SermonListComponent } from './sermon-list/sermon-list.component';

@NgModule({
  declarations: [
    SermonCreateComponent,
    SermonListComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    LayoutModule,
    ReactiveFormsModule,
    RouterModule
  ]
})
export class SermonsModule { }
