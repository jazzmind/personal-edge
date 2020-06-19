import { Component, Input, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { EventService } from '../../services/event.service';
import { CardHeightDirective } from './card-height.directive';

import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
  selector: 'event',
  templateUrl: 'event.html',
  host: {
    event: '[event]',
  }
})
export class EventComponent implements OnInit {
  @Input() event: any;

  constructor(
    public navCtrl: NavController,
    private eventService: EventService
  ) { }

  ngOnInit() {
    const imageFileFound = this.findCoverImageFromFiles(this.event.files);
    if (imageFileFound) {
      this.event.coverUrl = imageFileFound.url;
    }
  }

  // extract first image file from attachments, just so it can be displayed as event banner
  findCoverImageFromFiles(files) {
    let firstImageFile: any = false;
    files.forEach(file => {
      if (_.isEmpty(firstImageFile) && file.type.includes('image')) {
        firstImageFile = file;
      }
    });

    return firstImageFile;
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
