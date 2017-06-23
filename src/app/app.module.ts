// libs
import { NgModule, ErrorHandler, OnInit } from '@angular/core';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { FormsModule }   from '@angular/forms';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { CacheModule } from '../shared/cache/cache.module';
import { NotificationModule } from '../shared/notification/notification.module';
import { MyApp } from './app.component';
import { FilestackModule } from '../shared/filestack/filestack.module';
import { TestModule } from '../shared/testModules/test.module';

// services
import { AchievementService } from '../services/achievement.service';
import { ActivityService } from '../services/activity.service';
import { AssessmentService } from '../services/assessment.service';
import { AuthService } from '../services/auth.service';
import { SessionService } from '../services/session.service';
import { RequestModule } from '../shared/request/request.module';
import { ResponsiveService } from '../services/responsive.service';
import { EventService } from '../services/event.service';
import { FilestackService } from '../shared/filestack/filestack.service';
import { LevelService } from '../services/level.service';
import { MilestoneService } from '../services/milestone.service';
import { NotificationService } from '../shared/notification/notification.service';
import { SubmissionService } from '../services/submission.service';
import { TeamService } from '../services/team.service';
import { WindowRef } from '../shared/window';

// components
import { ModalComponent } from '../shared/notification/modal.component';
import { ActivityComponent } from '../components/activity/activity.component';
import { CurrentActivitiesComponent } from '../components/currentActivities/currentActivities';
import { CurrentLevelsComponent } from '../components/currentLevels/currentLevels';
import { EventComponent } from '../components/event/event.component';
import { LevelComponent } from '../components/level/level';
import { LoadingMarkerComponent } from '../components/loadingMarker/loadingMarker';
import { LockerComponent } from '../components/locker/locker';
import { MemberComponent } from '../components/member/member';
import { PhotoComponent } from '../components/photo/photo';
import { TermContentComponent } from '../pages/term-condition/term-content.component';

// pages
import { AchievementsViewPage } from '../pages/achievements/view/achievements-view.page';
import { ActivitiesListPage } from '../pages/activities/list/list.page';
import { ActivityListPopupPage } from '../pages/activities/list/popup';
import { ActivitiesViewPage } from '../pages/activities/view/view.page';
import { EventCheckinPage } from '../pages/events/checkin/event-checkin.page';
import { EventsComponent } from '../components/events/events.component';
import { EventsDownloadPage } from '../pages/events/download/events-download.page';
import { EventsListPage } from '../pages/events/list/list.page';
import { EventsPreviewPage } from '../pages/events/download/events-preview.page';
import { EventsViewPage } from '../pages/events/view/events-view.page';
import { ForgetPasswordPage } from '../pages/forget-password/forget-password';
import { GalleryPage } from '../pages/gallery/gallery';
import { HomePage } from '../pages/home/home';
import { LevelsListPage } from '../pages/levels/list/list';
import { LoginModalPage } from '../pages/login-modal/login-modal';
import { LoginPage } from '../pages/login/login';
import { MagicLinkPage } from '../pages/magic-link/magic-link';
import { RegisterPage } from '../pages/registration/register.page';
import { RegistrationModalPage } from '../pages/registration/modal';
import { RegistrationPage } from '../pages/registration/registration.page';
import { ResetpasswordModelPage } from '../pages/resetpassword-model/resetpassword-model';
import { ResetPasswordPage } from '../pages/reset-password/reset-password';
import { SettingsPage } from '../pages/settings/settings.page';
import { SidenavPage } from '../pages/sidenav/sidenav';
import { TabsPage } from '../pages/tabs/tabs.page';
import { TeamPage } from '../pages/team/team';
import { TermConditionPage } from '../pages/term-condition/term-condition.page';
import { TestPage } from '../pages/tabs/test.page';

// pipes
import { TruncatePipe } from '../pipes/truncate.pipe';

// configs
import { default as Configure } from '../configs/config';

@NgModule({
  declarations: [
    AchievementsViewPage,
    ActivitiesListPage,
    ActivityListPopupPage,
    ActivitiesViewPage,
    ActivityComponent,
    CurrentActivitiesComponent,
    CurrentLevelsComponent,
    EventCheckinPage,
    EventComponent,
    EventsComponent,
    EventsDownloadPage,
    EventsListPage,
    EventsPreviewPage,
    EventsViewPage,
    ForgetPasswordPage,
    GalleryPage,
    HomePage,
    LevelComponent,
    LevelsListPage,
    LoadingMarkerComponent,
    LockerComponent,
    LoginModalPage,
    LoginPage,
    MagicLinkPage,
    MemberComponent,
    ModalComponent,
    MyApp,
    PhotoComponent,
    RegisterPage,
    RegistrationModalPage,
    RegistrationPage,
    ResetpasswordModelPage,
    ResetPasswordPage,
    SettingsPage,
    SidenavPage,
    TabsPage,
    TeamPage,
    TestPage,
    TermConditionPage,
    TermContentComponent,
    TruncatePipe
  ],
  imports: [
    TestModule,
    CacheModule,
    NotificationModule,
    FormsModule,
    RequestModule.forRoot({
      appKey: Configure.appKey,
      prefixUrl: Configure.prefixUrl
    }),
    FilestackModule.forRoot({
      apikey: Configure.filestack.apiKey
    }),
    IonicModule.forRoot(MyApp, {}, {
       links: [
        {
          component: LoginPage,
          name: 'Login',
          segment: 'login',
          defaultHistory: [ LoginPage ]
        },
        {
          component: ResetPasswordPage,
          name: 'ResetPassword',
          segment: 'resetpassword', //resetpassword?email=XXX&key=XXX
          defaultHistory: [ ResetPasswordPage ]
        },
        {
          component: MagicLinkPage,
          name: 'MagiclinkPage',
          segment: 'secure/:auth_token', //secure?auth_token=XXXXXX
          defaultHistory: [ MagicLinkPage ]
        },
        {
          component: RegistrationPage,
          name: 'Registration',
          segment: 'registration',
          defaultHistory: [ RegistrationPage ]
        }
      ]
    })
  ],
  bootstrap: [
    IonicApp
  ],
  entryComponents: [
    AchievementsViewPage,
    ActivitiesListPage,
    ActivityListPopupPage,
    ActivitiesViewPage,
    ActivityComponent,
    CurrentActivitiesComponent,
    CurrentLevelsComponent,
    EventCheckinPage,
    EventComponent,
    EventsComponent,
    EventsDownloadPage,
    EventsListPage,
    EventsPreviewPage,
    EventsViewPage,
    ForgetPasswordPage,
    GalleryPage,
    HomePage,
    LevelComponent,
    LevelsListPage,
    LoadingMarkerComponent,
    LockerComponent,
    LoginModalPage,
    LoginPage,
    MagicLinkPage,
    MemberComponent,
    ModalComponent,
    MyApp,
    PhotoComponent,
    RegisterPage,
    RegistrationModalPage,
    RegistrationPage,
    ResetpasswordModelPage,
    ResetPasswordPage,
    SettingsPage,
    SidenavPage,
    TabsPage,
    TestPage,
    TermConditionPage,
    TermContentComponent,
  ],
  providers: [
    { provide: AchievementService, useClass: AchievementService },
    { provide: ActivityService, useClass: ActivityService },
    { provide: AssessmentService, useClass: AssessmentService },
    { provide: AuthService, useClass: AuthService },
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    { provide: EventService, useClass: EventService },
    { provide: LevelService, useClass: LevelService },
    { provide: LocationStrategy , useClass: HashLocationStrategy },
    { provide: MilestoneService, useClass: MilestoneService },
    { provide: NotificationService, useClass: NotificationService },
    { provide: ResponsiveService, useClass: ResponsiveService },
    { provide: SessionService, useClass: SessionService },
    { provide: SubmissionService, useClass: SubmissionService },
    { provide: TeamService, useClass: TeamService },
    { provide: FilestackService, useClass: FilestackService },
    WindowRef,
    // { provide: RequestOptions, useClass: CustomRequestOptions }
  ]
})
export class AppModule {}