import { Component, Input, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { EventService } from '../../services/event.service';
import { CardHeightDirective } from './card-height.directive';

import * as moment from 'moment';

@Component({
  selector: 'event',
  templateUrl: 'event.html',
  host: {
    event: '[event]',
  }
})
export class EventComponent implements OnInit {
  @Input() event: any;
  @Input() eventLogo: string;
  @Input() eventLogoRecommend: string;

  constructor(
    public navCtrl: NavController,
    private eventService: EventService
  ) { }

  ngOnInit() {
    this.eventLogo = this.event.eventLogo;
    this.eventLogoRecommend = this.event.eventLogoRecommend;
  }

  // Check event has been booked
  isBookedEvent(event) {
    return (event.isBooked === true && moment().isBefore(moment.utc(event.end).local()));
  }

  // Check event has been booked and attended
  isAttendedEvent(event) {
    return (event.isBooked === true && moment().isAfter(moment.utc(event.end).local()));
  }

  download() {
    this.eventService.downloadAttachment(this.event);
  }
}
