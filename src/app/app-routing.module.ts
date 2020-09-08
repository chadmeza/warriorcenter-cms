import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SermonListComponent } from './sermons/sermon-list/sermon-list.component';
import { SermonCreateComponent } from './sermons/sermon-create/sermon-create.component';
import { AuthenticationGuard } from './users/authentication.guard';
import { EventListComponent } from './events/event-list/event-list.component';
import { EventCreateComponent } from './events/event-create/event-create.component';

const routes: Routes = [
  { path: 'sermons', component: SermonListComponent, canActivate: [AuthenticationGuard] },
  { path: 'sermons/create', component: SermonCreateComponent, canActivate: [AuthenticationGuard] },
  { path: 'sermons/edit/:sermonId', component: SermonCreateComponent, canActivate: [AuthenticationGuard] },
  { path: 'events', component: EventListComponent, canActivate: [AuthenticationGuard] },
  { path: 'events/create', component: EventCreateComponent, canActivate: [AuthenticationGuard] },
  { path: 'events/edit/:eventId', component: EventCreateComponent, canActivate: [AuthenticationGuard] },
  { path: 'users', loadChildren: './users/users.module#UsersModule' },
  { path: '', redirectTo: 'sermons', pathMatch: 'full' },
  { path: '**', redirectTo: 'sermons', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthenticationGuard]
})
export class AppRoutingModule { }
