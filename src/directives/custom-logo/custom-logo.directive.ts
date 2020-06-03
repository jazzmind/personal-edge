import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CacheService } from '../../shared/cache/cache.service';
import { AuthService } from '../../services/auth.service';

const DEFAULT_IMAGE = './assets/img/main/logo.svg';

@Component({
  selector: 'custom-logo',
  templateUrl: './custom-logo.directive.html',
  styleUrls: ['./custom-logo.directive.scss'],
})
export class CustomLogoDirective implements OnChanges, OnInit {
  @Input() logo: string;
  public branding: any;

  constructor(
    private cacheService: CacheService,
    private authService: AuthService
  ) {}

  async ngOnInit() {
    await this.pullFromAPI();
    this.branding = this.findImage();
  }

  findImage() {
    return (!this.logo && this.cacheService.getLocal('branding.logo')) ? this.cacheService.getLocalObject('branding.logo') : DEFAULT_IMAGE;
  }

  async pullFromAPI() {
    const res = await this.authService.getConfig();

    if (res) {
      if (res.logo) {
        this.cacheService.setLocalObject('branding.logo', res.logo);
        return res.logo || DEFAULT_IMAGE;
      }
    }

    return false;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.logo.currentValue) {
      this.logo = changes.logo.currentValue;
    }
  }
}
