import { Component, NgZone, ViewChild } from '@angular/core';
import { NavController,
         NavParams,
         LoadingController,
         AlertController,
         ModalController,
         ViewController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
// services
import { AuthService } from '../../services/auth.service';
import { MilestoneService } from '../../services/milestone.service';
import { CacheService } from '../../shared/cache/cache.service';
import { RequestServiceConfig } from '../../shared/request/request.service';

// directives
import {FormValidator} from '../../validators/formValidator';
// pages
import { TabsPage } from '../../pages/tabs/tabs.page';
import { LoginPage } from '../../pages/login/login';
import { ForgetPasswordPage } from '../../pages/forget-password/forget-password';
import * as _ from 'lodash';
/* This page is for handling user login process */
@Component({
  selector: 'page-login-modal',
  templateUrl: 'login-modal.html'
})
export class LoginModalPage {
  email: string;
  password: any;
  userName: string;
  userImage: string;
  API_KEY: string;
  milestone_id: string;
  loginFormGroup: any;
  forgetpasswordPage = ForgetPasswordPage;
  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private viewCtrl: ViewController,
    private authService: AuthService,
    private config: RequestServiceConfig,
    private formBuilder: FormBuilder,
    private milestoneService: MilestoneService,
    private cacheService: CacheService,
    private ngZone: NgZone
  ) {
    this.navCtrl = navCtrl;
    this.loginFormGroup = formBuilder.group({
      email: ['', [FormValidator.isValidEmail,
                   Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }
  ionViewCanLeave(): boolean {
    // user is authorized
    console.log('authorized');
    let authorized = true;
    if (authorized){
      return true;
    } else {
      return false;
    }
  }
  /**
   * user login function to authenticate user with email and password
   */
  userLogin() {
    let self = this;
    this.cacheService.clear().then(() => {
      // add loading effect during login process
      const loading = this.loadingCtrl.create({
        dismissOnPageChange: true,
        content: 'Logging in ..'
      });
      loading.present();
      // This part is calling post_auth() API from backend
      this.authService.loginAuth(this.email, this.password)
        .subscribe(data => {
          // this.getLogInData(data);
          self.cacheService.setLocalObject('apikey', data.apikey);
          // saved for 3 types of timeline id in order for later use
          self.cacheService.setLocalObject('timelineId', data.Timelines[0].Timeline.id);
          self.cacheService.setLocalObject('timelineID', data.Timelines[0].Timeline.id);
          self.cacheService.setLocalObject('teams', data.Teams);
          // get milestone data after login
          this.authService.getUser()
              .subscribe(
                data => {
                  console.log(data);
                },
                err => {
                  console.log(err);
                }
              );
          // get milestone data after login
          this.milestoneService.getMilestones()
              .subscribe(
                data => {
                  console.log(data.data[0].id);
                  this.milestone_id = data.data[0].id;
                  self.cacheService.setLocalObject('milestone_id', data.data[0].id);
                  console.log("milestone id: " + data.data[0].id);
                  this.navCtrl.push(TabsPage);
                },
                err => {
                  console.log(err);
                }
              )
          this.cacheService.write('isAuthenticated', true);
          this.cacheService.setLocal('isAuthenticated', true);
        }, err => {
          loading.dismiss();
          this.logError(err);
          this.cacheService.removeLocal('isAuthenticated');
          this.cacheService.write('isAuthenticated', false);
        });
    });
  }
  /**
   * Insert post_auth() api result into localStorage
   * @param {object} data result from API request
   * @returns Observable/subject
   */
  getLogInData(data){
    let cacheProcesses = [];
    _.forEach(data, (datum, key) => {
      cacheProcesses.push(this.cacheService.write(key, datum));
    });
    cacheProcesses.push(this.cacheService.write('timeline_id', data.Timelines[0].Timeline.id));
    cacheProcesses.push(this.cacheService.write('apikey', data.apikey));
    cacheProcesses.push(this.cacheService.write('timelines', data.Timelines));
    cacheProcesses.push(this.cacheService.write('teams', data.Teams));
    this.cacheService.setLocal('apikey', data.apikey);
    this.cacheService.setLocal('timeline_id', data.Timelines[0].Timeline.id);
    console.log("cache data: " + cacheProcesses);
    return Observable.from(cacheProcesses);
  }
  /**
   * Insert get_user() api result into localStorage
   * @param {object} user result from API request
   */
  getUserKeyData(user){
    let userData = {
      'apikey': user.data.apikey,
      'timelines': user.data.Timelines
    }
    this.cacheService.write('userData', userData);
    this.cacheService.setLocalObject('userData', userData);
    this.API_KEY = user.data.apikey;
    // console.log("Timeline ID: " + user.data.Timelines[0].Timeline.id);
    // to get API KEY and timeline_id and stored in localStorage
    // then other API calls can directly use (API KEY and timeline_id)
  }
  /**
   * @TODO we'll come back to this logging workflow later in this development
   *
   * This function is used to log unexpected error accountered in the client side
   * @param {object} error result from API request
   */
  logError(error) {
    const alert = this.alertCtrl.create({
      title: 'Login Failed ..',
      message: 'Invalid email or password, please type it again',
      buttons: ['Close']
    });
    alert.present();
    // handle API calling errors display with alert controller
  }
  /**
   * forget password page link function
   */
  linkToForgetPassword() {
    this.navCtrl.push(this.forgetpasswordPage);
  }
  closeModal() {
    this.viewCtrl.dismiss();
  }
}