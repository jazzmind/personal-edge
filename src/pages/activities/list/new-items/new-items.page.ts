import { Component, OnInit } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

import { CacheService } from '../../../../shared/cache/cache.service';

@Component({
  templateUrl: 'new-items.html'
})
export class NewItemsPage implements OnInit {
  newItemsData: any = [];
  newItemImage: string = 'https://www.filepicker.io/api/file/ySw7HfSQbOmkVdowHrag';
  customColor: string = '#00c4dd'; // default to primary color

  constructor(
    public cacheService: CacheService,
    public params: NavParams,
    public viewCtrl: ViewController
  ) {
    this.newItemsData = this.params.get('newItemsData');
    if (this.newItemsData
      && this.newItemsData[0]
      && this.newItemsData[0].meta !== null
      && this.newItemsData[0].meta.img) {
      this.newItemImage = this.newItemsData[0].meta.img;
    }

    // Remove data in localstorage
    this.cacheService.setLocalObject('allNewItems', []);
    this.cacheService.setLocal('gotNewItems', false);
  }

  ngOnInit() {
    if (this.cacheService.getLocal('branding.color')) {
      const color = this.cacheService.getLocalObject('branding.color');

      if (color) {
        this.customColor = color;
      }
    }
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
