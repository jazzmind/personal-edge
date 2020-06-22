import { Component, NgZone } from '@angular/core';
import { App, NavController, MenuController, LoadingController, AlertController, ModalController } from 'ionic-angular';
import { TranslationService } from '../../shared/translation/translation.service';
import { loadingMessages } from '../../app/messages';
// services
import { GameService } from '../../services/game.service';
import { CacheService } from '../../shared/cache/cache.service';
import { AuthService } from '../../services/auth.service';
import { FilestackService } from '../../shared/filestack/filestack.service';
import { UtilsService } from '../../shared/utils/utils.service';
// pages
import { LeaderboardSettingsPage } from '../settings/leaderboard/leaderboard-settings.page';
import { LoginPage } from '../../pages/login/login';
import { TutorialPage } from '../settings/tutorial/tutorial.page';
import { TermConditionPage } from '../term-condition/term-condition.page';
@Component({
  selector: 'settings-page',
  templateUrl: 'settings.html'
})
export class SettingsPage {
  public handbookUrl = "./assets/files/handbook.pdf";
  public helpline = "help@practera.com";
  public logoutMessage: any = loadingMessages.Logout.logout;
  public hideMe: boolean;
  public config: any = {};
  private user: any = {};
  constructor(
    private cache: CacheService,
    private navCtrl: NavController,
    private menuCtrl: MenuController,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public translationService: TranslationService,
    private appCtrl: App,
    private gameService: GameService,
    private authService: AuthService,
    private fs: FilestackService,
    private zone: NgZone,
    private utils: UtilsService,
  ) {
    this.config = this.cache.getLocalObject('config');
    if (this.config.handbookUrl) {
      this.handbookUrl = this.config.handbookUrl;
    }
  }
  public settings = [];
  ionViewWillEnter() {
    if (this.navCtrl.getPrevious() !== undefined) {
      // Move to dashboard
      this.navCtrl.parent.select(0);
    } else {
      const loading = this.loadingCtrl.create();
      loading.present();

      let gameId = this.cache.getLocalObject('game_id');
      this.gameService.getCharacters(gameId)
        .subscribe((characters) => {
          let me = characters.Characters[0];
          if(me.meta == null){
            this.hideMe = false;
          }
          if(me.meta != null){
            if (me.meta.private === 0) {
              this.hideMe = false;
            } else {
              this.hideMe = true;
            }
          }
          loading.dismiss();
        }, (err) => {
          loading.dismiss();
        });
    }
    // getting user data saved in cashe
    this.user = this.cache.getLocalObject('user');

  }
  public getUserEmail() {
    return this.cache.getLocalObject('email') || '';
  }
  public getUserName() {
    return this.cache.getLocalObject('name') || '';
  }
  public changePrivate() {
    const showAlert = (msg) => {
      let alert = this.alertCtrl.create({
        subTitle: msg,
        buttons: ['OK']
      });
      alert.present();
    }
    const loader = this.loadingCtrl.create();
    loader.present()
    .then(() => {
      this.gameService.postCharacter({
        Character: {
          id: this.cache.getLocalObject('character_id'),
          meta: {
            private: (this.hideMe) ? 1 : 0
          }
        }
      })
      .subscribe((result) => {
        loader.dismiss();
        let msg = 'You name will now be hidden if in the leaderboard';
        if (!this.hideMe) {
          msg = 'Your name will now be displayed if in the leaderboard';
        }
        showAlert(msg);
      }, (err) => {
        this.hideMe = !this.hideMe;
        showAlert('Unabled to change your privacy setting.');
        loader.dismiss();
      });
    });
  }
  public goLeaderBoardSettings() {
    this.navCtrl.push(LeaderboardSettingsPage);
  }
  public goToTutorial() {
    // this.navCtrl.push(TutorialPage);
    let tutorialModal = this.modalCtrl.create(TutorialPage);
    tutorialModal.present();
  }
  public goToTermConditions() {
    this.navCtrl.push(TermConditionPage);
  }
  public logout() {
    let loader = this.loadingCtrl.create({
      spinner: 'hide',
      content: this.logoutMessage
    });
    loader.present().then(() => {
      this.cache.clear().then(() => {
        localStorage.clear();
        window.location.reload(); // the reason of doing this is because of we need to refresh page content instead of API data cache issue occurs
        loader.dismiss();
        this.navCtrl.push(LoginPage);
      });
    });
  }

  private _updateProfile(imageUrl) {
    const showAlert = (msg) => {
      let alert = this.alertCtrl.create({
        subTitle: msg,
        buttons: ['OK']
      });
      alert.present();
    }
    const loader = this.loadingCtrl.create();
    loader.present()
    .then(() => {
      this.authService.editUserProfile({
        image: imageUrl
      })
      .subscribe((result) => {
        // set uploaded image to priview.
        this.user.image = imageUrl;
        // updating cashed image
        this.cache.setLocalObject('user', this.user);
        loader.dismiss();
        let msg = 'Profile picture successfully updated';
        showAlert(msg);
      }, (err) => {
        loader.dismiss();
        let msg = 'Profile picture update fail';
        showAlert(msg);
      });
    });
  }

  async upload(event) {
    let self = this;

    const fs = await this.fs.pick(this.user.userhash, {
      maxFiles: 1, // default by max 5 files
      onUploadDone: (response) => {
        if (response.filesUploaded && response.filesUploaded[0]) {
          self.zone.run(() => {
            const file = response.filesUploaded[0]; // pick the first file
            file.icon = self.utils.getIcon(file.mimetype);
            this._updateProfile(file.url);
          });
        }
      },
      onFileUploadFailed: (err) => {
        console.log(err);
      }
    });

    return fs;
  }

}
