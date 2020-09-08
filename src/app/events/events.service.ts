import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Event } from './event.model';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  private events: Event[] = [];

  // Subject used as an observable
  private updatedEvents = new Subject<Event[]>();

  constructor(private http: HttpClient, private router: Router) { }

  // Allows classes to subscribe to this observable
  getEventsUpdatedListener() {
    return this.updatedEvents.asObservable();
  }

  // Gets a list of all events
  getEvents() {
    this.http.get<{ events: any[] }>(`${environment.apiUrl}api/events`)
      .pipe(map(data => {
        return {
          events: data.events.map(event => {
            return {
              id: event._id,
              name: event.name,
              details: event.details,
              address: event.address,
              date: event.date,
              time: event.time
            };
          })
        };
      }))
      .subscribe(transformedData => {
        this.events = transformedData.events;
        this.updatedEvents.next([...this.events]);
      }, error => {
        this.updatedEvents.next([]);
      });
  }

  // Adds a single event
  addEvent(name: string, details: string, address: string, date: Date, time: string) {
    const event: Event = {
      id: null,
      name: name,
      details: details,
      address: address,
      date: date,
      time: time
    };

    console.log(event);

    this.http.post(`${environment.apiUrl}api/events`, event)
      .subscribe(response => {
        this.router.navigate(["/events"]);
      });
  }

  getEvent(id: string) {
    return this.http.get<{ event: any }>(`${environment.apiUrl}api/events/` + id);
  }

  updateEvent(id: string, name: string, details: string, address: string, date: Date, time: string) {
    const event: Event = {
      id: id,
      name: name,
      details: details,
      address: address,
      date: date,
      time: time
    };

    this.http.put(`${environment.apiUrl}api/events/` + id, event)
      .subscribe(response => {
        this.router.navigate(["/events"]);
      });
  }

  deleteEvent(eventId: string) {
    return this.http.delete(`${environment.apiUrl}api/events/` + eventId);
  }

  deleteOldEvents() {
    return this.http.delete(`${environment.apiUrl}api/events/delete/old`);
  }
}
