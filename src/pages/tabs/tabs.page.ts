import { Component, ViewChild } from '@angular/core';
import { Events, Tabs } from 'ionic-angular';
import { ActivitiesListPage } from '../activities/list/list.page';
import { CacheService } from '../../shared/cache/cache.service';
import { EventsListPage } from '../events/list/list.page';
import { RankingsPage } from '../rankings/list/rankings.page';
import { SettingsPage } from '../settings/settings.page';
import { SpinwheelPage } from '../spinwheel/spinwheel.page';
import { TranslationService } from '../../shared/translation/translation.service';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

@Component({
  templateUrl: 'tabs.html',
  providers: []
})
export class TabsPage {
  @ViewChild('myTabs') tabRef: Tabs;

  // this tells the tabs component which Pages
  // should be each tab's root Page
  ranking: any = RankingsPage;
  dashboard: any = ActivitiesListPage;
  settings: any = SettingsPage;
  events: any = EventsListPage;
  spinner: any = SpinwheelPage;
  spins: number = null;
  public experiencePrimaryColor: SafeStyle = "";
  public experienceSecondaryColor: SafeStyle = "";
  public config: any = {};

  constructor(
    public translationService: TranslationService,
    public eventListener: Events,
    public cacheService: CacheService,
    public sanitization: DomSanitizer
  ) {
    this.traceSpinProgress();
    this.config = this.cacheService.getLocalObject('config');
    if (this.config.primaryColor) {
      // wow... this is a sledgehammer
      var css = document.createElement('style');
      css.type = 'text/css';
      var styles = '.tab-button[aria-selected=true] .tab-button-icon, .tab-button[aria-selected=true] .tab-button-text { color: ' + this.config.primaryColor +  ' !important; }';
      css.appendChild(document.createTextNode(styles));
      document.getElementsByTagName("head")[0].appendChild(css);
      this.experiencePrimaryColor = this.sanitization.bypassSecurityTrustStyle(this.config.primaryColor);
    }
  }

  traceSpinProgress() {
    this.eventListener.subscribe('spinner:update', spin => {
      // cache items & containers
      this.cacheService.setLocalObject('items', spin.Items);
      this.cacheService.setLocalObject('containers', spin.Containers);

      let unopened = [];
      spin.Containers.forEach(container => {
        if (!container.opened) {
          unopened.push(container);
        }
      });

      this.spins = (unopened.length === 0) ? null : unopened.length;
    });
  }

}
