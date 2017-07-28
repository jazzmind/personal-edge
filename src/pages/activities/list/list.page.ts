import { Component, Input, OnInit } from '@angular/core';
import {
  NavController,
  ToastController,
  LoadingController,
  ModalController,
  AlertController
} from 'ionic-angular';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { TranslationService } from '../../../shared/translation/translation.service';
import { loadingMessages, errMessages } from '../../../app/messages'; 
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/map';
import * as _ from 'lodash';
// services
import { ActivityService } from '../../../services/activity.service';
import { AchievementService } from '../../../services/achievement.service';
import { CharactersService } from '../../../services/characters.service';
import { SubmissionService } from '../../../services/submission.service';
// pages
import { ActivitiesViewPage } from '../view/activities-view.page';
import { ActivityListPopupPage } from './popup';
// pipes
import { TruncatePipe } from '../../../pipes/truncate.pipe';
/**
 * @TODO: remove after development is complete
 * flag to tell whether should UI popup toast error message at the bottom
 * @type {Boolean}
 */
const ACTIVATE_TOAST = false;

@Component({
  selector: 'activities-list-page',
  templateUrl: 'list.html'
})
export class ActivitiesListPage implements OnInit {
  public activities = [];
  public currentPercentage: number = 0;
  public characterData: any = [];
  public submissionData: any = [];
  public characterCurrentExperience: number = 0;
  public percentageValue: number = 0;
  public submissionPoints: number = 0;
  public returnError: boolean = false;
  // public shiftLang: boolean = false;
  // loading & err message variables
  public activitiesLoadingErr: any = errMessages.General.loading.load;
  public activitiesEmptyDataErr: any = errMessages.Activities.activities.empty;
  constructor(
    public navCtrl: NavController,
    public http: Http,
    public activityService: ActivityService,
    public achievementService: AchievementService,
    public charactersService: CharactersService,
    public submissionService: SubmissionService,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public translationService: TranslationService,
    public alertCtrl: AlertController
  ) {}
  // shiftLanguageTrial(){
  //   this.shiftLang = !this.shiftLang;
  //   this.translationService.isTranslated(this.shiftLang);
  // }               
  ngOnInit(){ 
    this.loadingAchievements();
  }
  // display user achievemnt statistics score points
  loadingAchievements(){
    let loadingFailed = this.toastCtrl.create({
      message: this.activitiesLoadingErr,
      duration: 4000,
      position: 'bottom'
    });
    let getCharacter = this.charactersService.getCharacter();
    let getSubmission = this.submissionService.getSubmissionsData();
    Observable.forkJoin([getSubmission, getCharacter])
    // Observable.forkJoin([getSubmission]) // this line will be removed when ISDK-57 is merged
              .subscribe(results => {
                  this.submissionData = results[0];
                  _.forEach(this.submissionData, element => {
                    if(element.AssessmentSubmission.status == 'published'){
                      this.submissionPoints += parseFloat(element.AssessmentSubmission.moderated_score);
                    }
                  });
                  this.percentageValue = this.submissionPoints/this.submissionData.length;
                  this.currentPercentage = parseFloat(this.percentageValue.toFixed(4))*100; 
                  console.log("percent: ", this.currentPercentage);
                  this.characterData = results[1].Character;
                  this.characterCurrentExperience = this.characterData.experience;
                  console.log("Experience: ", this.characterCurrentExperience);
                },
                err => {
                  if (ACTIVATE_TOAST) {
                    loadingFailed.present();
                  }
                }
              );
  }
  // loading activity list data
  loadingActivities = () => {
    let loadingActivities = this.loadingCtrl.create({
      content: 'Loading ..'
    });
    let loadingFailed = this.toastCtrl.create({
      message: this.activitiesLoadingErr,
      duration: 4000,
      position: 'bottom'
    });
    loadingActivities.present();
    this.activityService.getActivities()
        .subscribe(
          data => {
            this.activities = data;
            if(this.activities.length == 0){
              this.returnError = true;
            }
            loadingActivities.dismiss().then(() => {
              console.log("Activities: ", this.activities);
            });
          },
          err => {
            loadingActivities.dismiss().then(() => {
              if (ACTIVATE_TOAST) {
                loadingFailed.present();
              }
            });
          }
        )
  }

  /**
   * @TODO: remove this feature after development near complete
   * Prompt user to skip loading to skip forced long wait of API
   * @param {Function} cb callback if user choose to load API call
   */
  promptSkipLoading(cb: Function) {
    let prompt = this.alertCtrl.create({
      title: "Skip loading?",
      message: "Skip to speed up development (skip waiting).",
      buttons: [
        {
          text: 'Load it',
          handler: data => {
            return cb();
          }
        },
        {
          text: 'Skip',
          handler: data => console.log(data)
        }
      ]
    })
    prompt.present();
  }

  // load activity data
  ionViewWillEnter() {
    this.promptSkipLoading(this.loadingActivities);
  }
  // refresher activities
  doRefresh(e) {
    this.loadingActivities()
    e.complete();
  }
  // redirect to activity detail page
  goToDetail(activity: any, id: any){
    this.navCtrl.push(ActivitiesViewPage, { activity: activity, id: id });
  }
  // view the disabled activity popup
  goToPopup(unlock_id: any){
    let disabledActivityPopup = this.modalCtrl.create(ActivityListPopupPage, {unlock_id: unlock_id});
    console.log("Achievement ID: ", unlock_id);
    disabledActivityPopup.present();
  }
}
