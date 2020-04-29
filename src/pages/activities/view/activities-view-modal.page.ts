import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';
import { SafeResourceUrl, DomSanitizer, SafeHtml } from '@angular/platform-browser';
@Component({
  selector: 'activities-view-model',
  templateUrl: 'activities-view-model.html'
})
export class ActivitiesViewModalPage {
  videoUrl: SafeResourceUrl;
  public activity: any = [];
  public activityData: any = [];
  public description: SafeHtml;

  constructor(
    private navParams: NavParams,
    private viewCtrl: ViewController,
    private domSanitizer: DomSanitizer
  ) {
    this.activity = this.navParams.get('activity');
    this.activityData = this.activity;
    this.description = this.domSanitizer.bypassSecurityTrustHtml(this.activityData.description);
    this.videoUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.activityData.video_url);
  }

  ionViewDidEnter(): void {
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
