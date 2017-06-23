import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';
import { EventService } from '../../services/event.service';

import * as moment from 'moment';

@Component({
  selector: 'event',
  templateUrl: 'event.html'
})
export class EventComponent {
  @Input() event: any;

  // Check event has been booked
  isBookedEvent(event) {
    return (event.isBooked === true && moment().isBefore(moment(event.end)));
  }

  // Check event has been booked and attended
  isAttendedEvent(event) {
    return (event.isBooked === true && moment().isAfter(moment(event.end)));
  }
  constructor(
    public navCtrl: NavController,
    private eventService: EventService
  ) {}

  download() {
    this.eventService.downloadAttachment(this.event);
  }
}