import { Component, Input, OnChanges, SimpleChange } from '@angular/core';
import { CacheService } from '../../shared/cache/cache.service';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { Platform } from 'ionic-angular';
import * as _ from 'lodash';

@Component({
  selector: 'custom-header',
  templateUrl: 'custom-header.html'
})
export class CustomHeaderComponent implements OnChanges {
  @Input() customHeader: SafeStyle;
  isMobile: boolean = true;
  private screenWidth: number;

  constructor(
    private cacheService: CacheService,
    private sanitizer: DomSanitizer,
    private platform: Platform
  ) {
    this.screenWidth = platform.width();
    this.isMobile = this.isSmallScreen(this.screenWidth);
  }

  isSmallScreen(size): boolean {
    return (size < 460) ? true: false;
  }

  ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
    if (changes.customHeader) {
      if (changes.customHeader.currentValue) {
        console.log(changes.customHeader.currentValue);
        this.customHeader = this.sanitizer.bypassSecurityTrustHtml(changes.customHeader.currentValue);
      } else if (_.isEmpty(changes.customHeader.currentValue)) {
        const html_branding = this.cacheService.getLocalObject('user.branding.html');
        if (html_branding && html_branding.header) {
          this.customHeader = this.sanitizer.bypassSecurityTrustHtml(html_branding.header);
        }
      }
    }
  }
}
