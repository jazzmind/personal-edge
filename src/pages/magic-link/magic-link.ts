import { Component } from '@angular/core';
import { NavController,
         NavParams,
         LoadingController,
         AlertController } from 'ionic-angular';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';
import { loadingMessages, errMessages } from '../../app/messages';
// services
import { AuthService } from '../../services/auth.service';
import { CacheService } from '../../shared/cache/cache.service';
import { GameService } from '../../services/game.service';
import { MilestoneService } from '../../services/milestone.service';
// pages
import { TabsPage } from '../tabs/tabs.page';
import { LoginPage } from '../login/login';
@Component({
  selector: 'page-magic-link',
  templateUrl: 'magic-link.html'
})
export class MagicLinkPage {
  private auth_token: string;
  private token_fail: boolean;
  public milestone_id: string;
  // loading & error messages variables
  private loginLoadingMessage: any = loadingMessages.Login.login;
  private misMatchTokenErrMessage: any = errMessages.DirectLink.mismatch;
  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private milestoneService: MilestoneService,
    private cacheService: CacheService,
    private gameService: GameService
  ) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad MagiclinkPage');
    this.auth_token = this.navParams.get('auth_token');
  }

  ionViewWillEnter() {
    this.token_fail = false;
    this.magicLinkAccess();
  }

  async magicLinkAccess() {
    let observable = this.authService.magicLinkLogin(this.auth_token);

    const loading = this.loadingCtrl.create({
      dismissOnPageChange: true,
      content: this.loginLoadingMessage
    });
    loading.present().then(() => {
      observable.subscribe(data => {
        // localStorage.setItem('isAuthenticated', 'true');
        // this.navCtrl.push(TabsPage);
        data = data.data;
        this.cacheService.setLocalObject('apikey', data.apikey);
        this.cacheService.setLocalObject('timelineID', data.Timelines[0].Timeline.id);
        this.cacheService.setLocalObject('teams', data.Teams);
        if (data.Experience.config) {
          this.cacheService.setLocalObject('config', data.Experience.config);
        }

        Observable.forkJoin([
          // get game_id data after login
          this.gameService.getGames(),

          // get milestone data after login
          this.authService.getUser(),

          // get milestone data after login
          this.milestoneService.getMilestones(),
        ]).subscribe(responses => {
          loading.dismiss().then(() => {
            const games = responses[0],
              userData = responses[1],
              milestone = responses[2];

            // game data
            _.map(games, game => {
              this.cacheService.setLocal('game_id', game[0].id);
            });

            // user data
            this.cacheService.setLocalObject('name', userData.User.name);
            this.cacheService.setLocalObject('email', userData.User.email);
            this.cacheService.setLocalObject('program_id', userData.User.program_id);
            this.cacheService.setLocalObject('project_id', userData.User.project_id);

            // milestone
            this.milestone_id = milestone[0].id;
            this.cacheService.setLocalObject('milestone_id', milestone[0].id);
            this.navCtrl.setRoot(TabsPage).then(() => {
              window.history.replaceState({}, '', window.location.origin);
            });

            this.cacheService.write('isAuthenticated', true);
            this.cacheService.setLocal('isAuthenticated', true);
          });
        });

      }, async err => {
        if (this.token_fail == false) {
          this.token_fail = true;
          this.auth_token = decodeURIComponent(this.auth_token);
          return this.magicLinkAccess();
        }
        const failAlert = this.alertCtrl.create({
          title: 'Magic did NOT happen',
          message: this.misMatchTokenErrMessage,
          buttons: ['Close']
        });

        failAlert.present().then(() => {
          this.navCtrl.push(LoginPage).then(() => {
            window.history.replaceState({}, '', window.location.origin);
          });
          this.cacheService.removeLocal('isAuthenticated');
          this.cacheService.write('isAuthenticated', false);
        });
      });
    });
  }
}
