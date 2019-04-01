import { Component } from '@angular/core';
import {
  ActionSheetController,
  NavController,
  ToastController,
  LoadingController,
  ModalController,
  PopoverController,
  Events
} from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';
import * as _ from 'lodash';
import { errMessages } from '../../../app/messages';
import { default as Configure } from '../../../configs/config';
// services
import { ActivityService } from '../../../services/activity.service';
import { AssessmentService } from '../../../services/assessment.service';
import { AchievementService } from '../../../services/achievement.service';
import { CacheService } from '../../../shared/cache/cache.service';
import { EventService } from '../../../services/event.service';
import { GameService } from '../../../services/game.service';
import { SubmissionService } from '../../../services/submission.service';
import { TranslationService } from '../../../shared/translation/translation.service';
// pages
import { ActivitiesViewPage } from '../view/activities-view.page';
import { ActivityListPopupPage } from './popup';
import { AssessmentsPage } from '../../assessments/assessments.page';
import { PopoverTextPage } from './popover-text';
import { EventsListPage } from '../../events/list/list.page';
import { RankingsPage } from '../../rankings/list/rankings.page';
import { InstructionPage } from './instruction/instruction.page';
import { NewItemsPage } from './new-items/new-items.page';
// pipes
import { WindowRef } from '../../../shared/window';

/**
 * @TODO: remove after development is complete
 * flag to tell whether should UI popup toast error message at the bottom
 * @type {Boolean}
 */
@Component({
  selector: 'activities-list-page',
  templateUrl: 'list.html'
})
export class ActivitiesListPage {
  public initilized_varible() {
    this.bookedEventsCount = 0;
    this.characterCurrentExperience = 0;
    this.currentPercentage = 0;
    this.activityIDs = [];
    this.completedActivityIndexes = [];
    this.completedActivityIds = [];
    this.tickedIDsArray = [[], [], [], [], [], [],[]];
    this.averageScore = [0, 0, 0, 0, 0, 0, 4];
    this.userExperiencePoint = 0;
    this.eachActivityScores = [];
    this.totalAverageScore = 0;
    this.submissionStatus = null;
  }
  public hardcode_assessment_id: any = Configure.hardcode_assessment_id;
  public hardcode_context_id: any = Configure.hardcode_context_id;
  public portfolio_domain: any = Configure.portfolio_domain;
  public activityIndex: any = 0;
  public activities: any = [];
  public activityIDs: any = [];
  public completedActivityIndexes: any = [];
  public completedActivityIds: any = [];
  public averageScore: any = [];
  public totalAverageScore: any = 0;
  public eachActivityScores: any = [];
  public finalAverageScoreShow: any = '0';
  public show_badge: boolean = true;
  public portfolio_request: boolean = false;
  public view_portfolio: boolean = false;
  public bookedEventsCount: number = 0;
  public eventsData: any = [];
  public initialItems: any = [];
  public totalAchievements: any = [];
  public currentPoints: number = 0;
  public maxPoints: number = 0;
  public currentPercentage: any = '0';
  public filteredSubmissions: any = [];
  public submissionStatus: string = null;
  public characterData: any = [];
  public submissionData: any = [];
  public sameFontSize: boolean = false;
  public userExperiencePoint: any = 0;
  public characterCurrentExperience: any = '0';
  public percentageValue: number = 0;
  public submissionPoints: number = 0;
  public returnError: boolean = false;
  public rankingsPage = RankingsPage;
  public eventsListPage = EventsListPage;
  public program_id: any = "1";
  public email: any = "test@test.com";
  public viewPortfolioLink: any = '';
  // loading & err message variables
  public activitiesLoadingErr: any = errMessages.General.loading.load;
  public activitiesEmptyDataErr: any = errMessages.Activities.activities.empty;
  // Achievements
  private achievements = {
    maxPoint: {},
    obtained: {},
    available: []
  };
  public achievementListIDs: any = Configure.achievementListIDs;
  public show_score: any = [
    false,false,false,false,false,false,false
  ];
  public getUserAchievementData: any = [];
  public changeColor: Array<Array<Boolean>> = [
    [false,false,false,false],
    [false,false,false,false],
    [false,false,false,false],
    [false,false,false,false],
    [false,false,false,false],
    [false,false,false,false],
    [false,false,false,false]
  ];
  public tickedIDsArray: any = [];
  public userAchievementsIDs: any = [];
  public checkUserPointer: boolean = false;

  constructor(
    public navCtrl: NavController,
    public activityService: ActivityService,
    public assessmentService: AssessmentService,
    public achievementService: AchievementService,
    public cacheService: CacheService,
    public eventService: EventService,
    public eventListener: Events,
    public gameService: GameService,
    public submissionService: SubmissionService,
    private actionSheetCtrl: ActionSheetController,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public popoverCtrl: PopoverController,
    public translationService: TranslationService,
    public win: WindowRef
  ) {
    if (this.email && this.program_id) {
      this.program_id = this.cacheService.getLocal('program_id');
      this.email = this.cacheService.getLocalObject('email');
      this.viewPortfolioLink = `${this.portfolio_domain}/${this.program_id}/${this.email}`;
    } else {
      this.viewPortfolioLink = `${this.portfolio_domain}/1/test@test.com`;
    }
  }

  ionViewWillEnter() {
    // reset data to 0 when page reloaded before got new data
    this.initilized_varible();
    this.loadingDashboard();
  }

  ionViewDidEnter() {
    // Open new items modal when submitted no-need-review answer.
    // @NOTE getLocal() return boolean data as string
    if (this.cacheService.getLocal('gotNewItems') === 'true') {
      this.openNewItemsModal({
        newItemsData: this.cacheService.getLocalObject('allNewItems')
      });
    }
  }

  refreshPage() {
    this.initilized_varible();
    this.loadingDashboard();
  }

  openEvent() {
    // Move to event page
    this.navCtrl.parent.select(1); // go to event tab page
  }

  openLeaderboard() {
    // Move to leaderboard page
    this.navCtrl.parent.select(2); // go to leaderboard tab page
  }

  openPortfolio() {
    // Move to portfolio page
    if (this.view_portfolio) {
      // go/open url in window viewPortfolioLink
      // @TODO: open url in new window isn't supported in PWA mode, this happen to be same behavior for opening link through <a> (anchor element) too!
      let win = this.win.nativeWindow;
      return win.open(this.viewPortfolioLink, '_blank');
    } else {
      if (this.portfolio_request) {
        this.requestPortfolio();
      } else {
        this.whatsThis();
      }
    }
  }

  openNewItemsModal(params: any = {}) {
    let modal = this.modalCtrl.create(NewItemsPage, params);
    modal.present();
  }

  // display user achievemnt statistics score points
  async loadingDashboard() {
    let loadingFailed = await this.toastCtrl.create({
      message: this.activitiesLoadingErr,
      duration: 4000,
      position: 'bottom'
    });

    this.activityService.getList().subscribe(results => {
      // get activities data
      this.activities = results;
      if (this.activities.length == 0) {
        this.returnError = true;
      }

      if (this.activities.length == 1 && document.cookie == "") {
        document.cookie = "visitStatus=true; expires=Fri, 31 Dec 9999 23:59:59 GMT";
        this.navCtrl.push(InstructionPage);
      }

      const milestoneId = this.cacheService.getLocalObject('milestone_id');
      this.achievementListIDs = Configure.achievementsByMilestone[milestoneId] || this.achievementListIDs;
      if (this.activities.length == 1) {
        this.achievementListIDs = Configure.newbieOrderedIDs;
      }

      // extract activity ids
      _.forEach(this.activities, ((act, index) => {
        this.activities[index].Activity.indexID = index + 1;
        this.activityIDs.push(act.Activity.id);
      }));

      let gameId = this.cacheService.getLocalObject('game_id');
      let getCharacter = this.gameService.getCharacters(gameId);
      let getSubmission = this.submissionService.getSubmissionsData();
      let getUserAchievemnt = this.achievementService.getAchievements();
      let getUserEvents = this.eventService.getUserEvents(this.activityIDs);

      Observable.forkJoin([
        getSubmission,
        getCharacter,
        getUserAchievemnt,
        getUserEvents
      ]).subscribe(results => { // save API request results as a single integrated object
        this.submissionData = results[0];
        this.characterData = results[1].Characters[0]; // Now only support 1 character in a game
        this.getUserAchievementData = results[2];
        this.eventsData = results[3];

        this.cacheService.setLocalObject('character', this.characterData);
        this.cacheService.setLocal('character_id', this.characterData.id);

        // display user experience points
        this.showUserExperience(this.characterData.experience_points);
        // achievement list data handling
        _.forEach(this.getUserAchievementData.Achievement, (achievement, index) => {
          this.userAchievementsIDs[index] = achievement.id;
        });

        // render ticks for each acheivements
        if (this.userAchievementsIDs) {
          // find if awarded achievement ID whether inside hardcoded achievemnt list
          this.changeColor = this.isTicked(this.userAchievementsIDs);
        }

        // find activity with 4 boxes ticked from changeColor array (result: this.completedActivityIndexes)
        _.forEach(this.changeColor, (activityIds, index) => {
          let completedAndMatched: any = _.uniqBy(activityIds, 'true'); // find any available `true`
          if (completedAndMatched[0] == true && completedAndMatched.length == 1) {
            this.completedActivityIndexes.push(index);
          }
        });

        // submission data handling
        _.forEach(this.submissionData, submission => {
          if (submission.Assessment.id == this.hardcode_assessment_id) { // hardcode for post program assessment_id
            this.submissionStatus = submission.AssessmentSubmission.status;
          }
        });

        if (this.submissionStatus != "done") {
          this.view_portfolio = false;
        } else {
          this.view_portfolio = true;
        }

        // find matching array index from activityIDs array and find each of activity IDs
        for (let index = 0, len = this.completedActivityIndexes.length; index < len; index++) {
          this.completedActivityIds.push(this.activityIDs[this.completedActivityIndexes[index]]);
        }

        // find submission based on founded activity IDs
        this.displayAverageScore(
          this.completedActivityIds,
          this.submissionData,
          this.show_score,
          this.completedActivityIndexes,
          this.averageScore
        );

        // get items API call
        this.gameService.getItems({
          character_id: this.characterData.id
        }).subscribe(
          data => {
            this.initialItems = data.Items;
            this.cacheService.setLocalObject('initialItems', this.initialItems);
            // dispatch event
            this.eventListener.publish('spinner:update', data);
          },
          err => {
            console.log("Items Data error: ", err);
          }
        );
        if (this.eventsData) {
          _.forEach(this.eventsData, (element, index) => {
            if (this.eventsData[index].isBooked == true && moment().isBefore(moment(this.eventsData[index].end))) {
              this.bookedEventsCount++;
            }
          });
        } else {
          this.bookedEventsCount = 0;
        }
      }, error => {
        loadingFailed.present();
      });
    }, error => {
        loadingFailed.present();
    });
  }

  // redirect to activity detail page
  goToDetail(activity: any) {
    this.navCtrl.push(ActivitiesViewPage, {
      achievements: this.achievements,
      activity: activity,
      activityIDs: this.activityIDs,
      tickArray: this.changeColor,
      eachFinalScore: this.eachActivityScores.slice(0, 7),
      newTickIDsArray: this.achievementListIDs,
      portfolioView: this.view_portfolio
    });
  }

  // view the disabled activity popup
  goToPopup(unlock_id: any) {
    let disabledActivityPopup = this.modalCtrl.create(ActivityListPopupPage, {unlock_id: unlock_id});
    disabledActivityPopup.present();
  }

  // link to certain pages
  whatsThis() {
    let popover = this.popoverCtrl.create(PopoverTextPage);
    popover.present();
  }

  requestPortfolio() { // request protfolio link action sheet box display functionality
    let requestPortfolioPopup = this.actionSheetCtrl.create({
      title: `Please note, that once you have requested the digital portfolio your grade can not be changed by doing more submissions. It will be final.`,
      buttons:[
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {}
        },
        {
          text: 'Confirm',
          role: 'OK',
          handler: () => {
            let refs = {
              References: [{
                Assessment: {
                  id: this.hardcode_assessment_id,
                  name: "Personal Edge pre-program questionnaire"
                },
                context_id: this.hardcode_context_id // hardcode for context_id
              }],
              assessment: {
                id: this.hardcode_assessment_id,
                context_id: this.hardcode_context_id // hardcode for context_id
              }
            };

            this.navCtrl.push(AssessmentsPage, {
              activity: refs
            });
          }
        },
      ]
    });
    requestPortfolioPopup.present();
  }

  showUserExperience(experience_points) {
    this.userExperiencePoint = experience_points;
    if (this.userExperiencePoint >= 10000) {
      this.sameFontSize = true;
    } else {
      this.sameFontSize = false;
    }
    this.characterCurrentExperience = experience_points;
    if (experience_points >= 100000) {
      this.characterCurrentExperience = (experience_points/1000).toFixed(1)+'K';
    }
    if (experience_points >= 1000000) {
      this.characterCurrentExperience = (experience_points/1000000).toFixed(1)+'M';
    }
    if (experience_points == 0) {
      this.characterCurrentExperience = '0';
    }
  }

  isTicked(userAchievementIDs) {
    let tick = this.changeColor;
    for (let i = 0; i < 7; i++) { // we have 7 activities
      for (let j = 0; j < 4; j++) { // we have 4 ticks
        if (userAchievementIDs.includes(this.achievementListIDs[i][j])) {
          tick[i][j] = true;
        } else {
          tick[i][j] = false;
        }
      }
    }
    return tick;
  }

  displayAverageScore(completedActivityIds, submissionData, show_score, activityIndexes, averageScore) {
    let scoresBySubmission = {
      0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6:[]
    };

    for (let j = 0; j < completedActivityIds.length; j++) {
      // extract score from reviewed subsmission
      for (let i = 0; i < submissionData.length; i++) {
        const submission = submissionData[i].AssessmentSubmission;
        if (submission.activity_id == completedActivityIds[j] && submission.status == 'published') {
          scoresBySubmission[j].push(parseFloat(submission.moderated_score));
        }
      }

      scoresBySubmission[j].reverse();
      show_score[activityIndexes[j]] = true;

      if (scoresBySubmission[j].length > 1) { // only first 2 highest reviews are counted
        averageScore[activityIndexes[j]] = (scoresBySubmission[j][0] + scoresBySubmission[j][1]) * 2;
      } else if (scoresBySubmission[j].length == 1) {
        averageScore[activityIndexes[j]] = scoresBySubmission[j][0] * 4;
      }
      // if index = 6, just assign full score
      if (activityIndexes[j] == 6) {
        averageScore[activityIndexes[j]] = 5;
      }

      if (activityIndexes[j] <= 5) { // add up together about each acitity average score
        this.totalAverageScore += averageScore[activityIndexes[j]];
      }
    }

    this.totalAverageScore = this.totalAverageScore/6;
    this.finalAverageScoreShow = this.totalAverageScore.toFixed(2);

    this.show_badge = false;
    this.portfolio_request = false;
    // check if every activity has a score
    if (!show_score.includes(false)) {
      this.show_badge = true;
      this.portfolio_request = true;
    }

    // prepare scores for each activity for Detailed view (ActivitiesViewPage)
    _.forEach(show_score, (ele, index=6) => {
      if (ele == false) {
        this.eachActivityScores[index] = -1;
      } else {
        this.eachActivityScores[index] = averageScore[index];
      }
      this.eachActivityScores.push(this.eachActivityScores[index]);
    });
  }
}
