import { Component } from '@angular/core';
import { ViewController, LoadingController, NavParams } from 'ionic-angular';
import {  } from '';
@Component({
  selector: 'whats-this-popover',
  template: `
    <ion-list class="whats-this">
      <ion-row>
        <ion-list-header>
          <p col-10>Whats this?</p>
          <button col-2 (click)="closeModal()" class="close" menuClose="right">&times;</button>
        </ion-list-header>
      </ion-row>
      <p>Your overall grade is determined by the highest grade you earn for each skill.</p>
      <p>Once you have at least a 2.5 grade in every skill you can apply for a “Global Skills Passport Portfolio”.</p>
      <p>Please note, that once you have requested the portfolio you grade can not be changed by doing more submissions. It will be final.</p>
    </ion-list>
  `
})
export class PopoverTextPage {
  constructor(
    private viewCtrl: ViewController,
    private navParams: NavParams,
    private loadingCtrl: LoadingController,
  ) {

  }
  ionViewWillEnter(){

  }
  // close popover
  closeModal() {
    this.viewCtrl.dismiss();
  }
}
