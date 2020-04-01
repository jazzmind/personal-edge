import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CacheService } from '../../shared/cache/cache.service';

const DEFAULT_IMAGE = '../../assets/img/main/logo.svg';

@Component({
  selector: 'custom-logo',
  templateUrl: './custom-logo.directive.html',
})
export class CustomLogoDirective implements OnChanges {
  @Input() logo: string;

  constructor(public cache: CacheService) {
    if (!this.logo) {
      this.logo = DEFAULT_IMAGE;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.logo.currentValue) {
      this.logo = changes.logo.currentValue;
    } else {
      this.logo = DEFAULT_IMAGE;
    }
  }
}
