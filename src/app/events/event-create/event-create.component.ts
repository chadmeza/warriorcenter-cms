import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EventsService } from '../events.service';
import { Event } from '../event.model';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-event-create',
  templateUrl: './event-create.component.html',
  styleUrls: ['./event-create.component.scss']
})
export class EventCreateComponent implements OnInit {
  event: Event;
  isLoading = false;
  form: FormGroup;
  mode = 'create';
  private eventId: string;

  constructor(public eventsService: EventsService, public route: ActivatedRoute) {}

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null, { validators: [Validators.required] }),
      details: new FormControl(null),
      address: new FormControl(null, { validators: [Validators.required] }),
      date: new FormControl(null, { validators: [Validators.required] }),
      time: new FormControl(null, { validators: [Validators.required] })
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('eventId')) {
        this.mode = 'edit';
        this.eventId = paramMap.get('eventId');
        this.isLoading = true;
        this.eventsService.getEvent(this.eventId).subscribe(eventData => {
          this.isLoading = false;

          this.event = {
            id: eventData.event._id,
            name: eventData.event.name,
            details: eventData.event.details,
            address: eventData.event.address,
            date: eventData.event.date,
            time: eventData.event.time
          };

          this.form.setValue({
            name: this.event.name,
            details: this.event.details,
            address: this.event.address,
            date: this.event.date,
            time: this.event.time
          });
        });
      } else {
        this.mode = 'create';
        this.eventId = null;
      }
    });
  }

  onSaveEvent() {
    if (this.form.invalid) {
      return;
    };

    console.log(this.form.value.details);

    if (this.mode === 'create') {
      this.eventsService.addEvent(
        this.form.value.name, 
        this.form.value.details,
        this.form.value.address,
        new Date(this.form.value.date),
        this.form.value.time
      );
    } else {
      this.eventsService.updateEvent(
        this.eventId,
        this.form.value.name, 
        this.form.value.details,
        this.form.value.address,
        new Date(this.form.value.date),
        this.form.value.time
      );
    }

    this.form.reset();
    this.isLoading = true;
  }
}
