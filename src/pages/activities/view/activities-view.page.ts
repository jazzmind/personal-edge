import { Component } from '@angular/core';
import { ModalController, NavParams, NavController, AlertController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
// pages
import { ActivitiesViewModalPage } from './activities-view-modal.page';
import { AssessmentsPage } from '../../assessments/assessments.page';
import { ActivityService } from '../../../services/activity.service';
import { SubmissionService } from '../../../services/submission.service';

import * as _ from 'lodash';
@Component({
  templateUrl: './view.html'
})
export class ActivitiesViewPage {
  public logo_act1 = "./assets/img/main/logo01.svg";
  public activityIDsArrary: any = [];
  public submissionTitles: any = [];
  activity: any = {};
  activityIndex: any = 0;
  assessment: any = {};
  assessments: any = {};
  submissions: Array<any> = [];
  achievements: any = {
    available: [],
    obtained: {},
    maxPoints: {}
  };
  loadings = {
    submissions: false
  };

  constructor(
    private navParams: NavParams,
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private activityService: ActivityService,
    private submissionService: SubmissionService,
    private alertCtrl: AlertController
  ) {
  }

  ionViewWillEnter(): void {
    this.loadings.submissions = true;
  }

  // @TODO: use simple mock data for assessment first
  /**
   * on assessment implementation, to do list:
   * - load badges
   * - change icon display based on responded data format
   * - load submission into this.submissions
   * - change template view based on responded data format
   */
  ionViewDidEnter(): void {
    // assessment
    this.activity = this.activityService.normaliseActivity(this.navParams.get('activity') || {});
    this.assessments = this.activity.sequences || [];
    this.assessment = this.activity.assessment;
    this.activityIndex = this.navParams.get('activity').Activity.Activity.indexID;
    this.activityIDsArrary = this.navParams.get('activityIDs');
    // This is a hardcode (temporary solution).
    // <7632> is the activity id of career strategist, checking this id to see if all skills activities has been revealed.
    if (this.activityIDsArrary.includes(7632)){
      this.logo_act1 = "./assets/img/badges/badge01.svg"; // if 7632 exist, show career logo for the first activity, otherwise, show product logo for the first activity.
    }
    // submission
    this.submissions = [];
    Observable.forkJoin(this.submissionService.getSubmissionsByReferences(this.activity.References)).subscribe(responses => {
      // turn nested array into single dimension array
      responses.forEach((submissions: Array<any>) => {
        if (submissions.length > 0) {
          this.submissions = submissions.map(submission => {
            return this.submissionService.normalise(submission);
          });
          this.submissions = _.orderBy(this.submissions, 'created', 'desc'); // latest at top
        }
      });

      this.submissionTitles = this.getSubmissionTitle(this.submissions);
      this.loadings.submissions = false;
    });


    // badges
    this.achievements = this.navParams.get('achievements');
    this.activity.badges = this.extractBadges();
    this.activity.badges.map((badge, index) => {
      if ((this.activity.id % 3) != 0) {
        badge.disabled = false;
      } else {
        badge.disabled = true;
      }
    });
  }

  // extract "in progress"
  inProgressSubmission() {
    let result = [];
    (this.submissions || []).forEach(submission => {
      if (submission.status === 'in progress') {
        result.push(submission);
      }
    });
    return result;
  }

  private extractBadges(): Array<any> {
    let result = [];
    if (this.achievements.available && this.achievements.available.length > 0) {
      this.achievements.available.forEach(achievement => {
        if (achievement.Achievement.badge) {
          result.push({
            url: achievement.Achievement.badge,
            disabled: false
          });
        }
      });
    }
    return result;
  }

  /**
   * @description display activity detail modal page
   */
  openModal() {
    let detailModal = this.modalCtrl.create(ActivitiesViewModalPage, {activity: this.activity});
    detailModal.present();
  }

  /**
   * @name goAssessment
   * @description direct to assessment page of a selected activity
   * @param {Object} activity single activity object from the list of
   *                          activities respond from get_activities API
   * @param {Object} opts optional object with
   *                 - hasSubmission: to indicateif user is accessing a in
   *                   progress assessment
   */
  goAssessment(submission?, opts = { hasSubmission: false }) {
    if ((this.inProgressSubmission()).length > 0 && opts.hasSubmission === false) {
      let alert = this.alertCtrl.create({
        title: 'You have a submission in progress.',
        buttons: ["Ok"]
      });
      alert.present();
    } else if (opts.hasSubmission === true) {
      this.navCtrl.push(AssessmentsPage, {
        activity: this.activity,
        assessment: this.assessment,
        submissions: this.submissions,
        currentSubmission: submission
      });
    } else {
      this.navCtrl.push(AssessmentsPage, {
        activity: this.activity,
        assessment: this.assessment
      });
    }
  }

  getSubmissionTitle(Submissions){
    let title: any = [];
    for (let index = 0; index<Submissions.length; index++){
      if (Submissions[index].status == "published"){
        switch (Submissions[index].moderated_score){
          case "1":
            title.push("Outstanding");
            break;
          case  "0.75":
            title.push("Commendable");
            break;
          case "0.5":
            title.push("Competent");
            break;
          case "0.25":
            title.push("Developing");
            break;
          case "0":
            title.push("Needs Improvement");
        }
      }else{
        title.push(false);
      }
    }
    return title;
  }
}
