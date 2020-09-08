import { Component, OnInit } from '@angular/core';
import { Event } from '../event.model';
import { Subscription } from 'rxjs';
import { EventsService } from '../events.service';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss']
})
export class EventListComponent implements OnInit {
  events: Event[] = [];
  isLoading: boolean = false;
  // Subscription handler - used for preventing memory leaks
  eventsSubscription: Subscription;

  constructor(public eventsService: EventsService) { }

  ngOnInit() {
    this.isLoading = true;
    this.eventsService.getEvents();
    // Listen for updates to the sermons list
    this.eventsSubscription = this.eventsService.getEventsUpdatedListener()
      .subscribe((events: Event[]) => {
        this.events = events;
        this.isLoading = false;
      });
  }

  formatDate(date: string) {
    const newDate = new Date(date);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    return newDate.toLocaleDateString(undefined, options);
  }

  onDelete(id: string) {
    this.eventsService.deleteEvent(id).subscribe(() => {
      this.eventsService.getEvents();
    }, () => {
      this.isLoading = false;
    });
  }

  onDeleteOldEvents() {
    this.eventsService.deleteOldEvents().subscribe(() => {
      this.eventsService.getEvents();
    }, () => {
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.eventsSubscription.unsubscribe;
  }
}
