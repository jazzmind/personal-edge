import { Injectable } from '@angular/core';
import { RequestService, CustomQueryEncoder } from '../shared/request/request.service';
import { Http, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { default as Configuration } from '../configs/config';
import { Observable } from 'rxjs';
import { CacheService } from '../shared/cache/cache.service';

const APIs = {
  experience: 'api/v2/plan/experience/list'
};

export interface ProfileData {
  image:string
}

export interface HTMLBranding {
  header?: string;
  footer?: string;
}

export interface CustomBranding {
  logo?: string;
  color?: string;
  html_branding?: HTMLBranding;
}
@Injectable()
export class AuthService {
  private appkey: any = this.request.getAppkey();
  private prefixUrl: any = this.request.getPrefixUrl();
  private AUTH_ENDPOINT: any = this.prefixUrl + 'api/auths.json?action=';
  public headerData() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    headers.append('appkey', this.appkey);
    return headers;
  }
  constructor(
    private request: RequestService,
    private http: Http,
    private cacheService: CacheService
  ) {}

  // cache experience config from auth.json endpoint
  cacheUserSpecificConfig(res): void {
    const configKeys = {
      logo: 'user.branding.logo',
      color: 'user.branding.color',
      html: 'user.branding.html',
      spinwheel: 'user.spinwheel',
      customConfig: 'user.customConfig',
    };

    const thisExperience = res.Experience || {};
    if (thisExperience && thisExperience.config) {
      if (thisExperience.config.theme_color) {
        this.cacheService.setLocalObject(configKeys.color, thisExperience.config.theme_color);
      }

      if (thisExperience.config.spinwheel) {
        this.cacheService.setLocalObject(configKeys.spinwheel, thisExperience.config.spinwheel);
      }

      if (thisExperience.config.html_branding) {
        this.cacheService.setLocalObject(configKeys.html, thisExperience.config.html_branding);
      }

      this.cacheService.setLocalObject(configKeys.customConfig, thisExperience.config);
    }

    return;
  }

  // cache experience config from api/v2/plan/experience/list endpoint
  cacheConfig(res, options = {
    isUserSpecfic: false
  }) {
    let result = {
      logo: '',
      color: '',
      html_branding: {},
    };

    const configKeys = {
      logo: 'branding.logo',
      color: 'branding.color',
      html: 'branding.html',
      spinwheel: 'spinwheel',
      customConfig: 'customConfig',
    };

    if (res && res.data && res.data.length > 0) {
      const thisExperience = res.data[0];

      if (thisExperience.logo) {
        const logo = `${Configuration.prefixUrl}${thisExperience.logo}`;
        this.cacheService.setLocalObject(configKeys.logo, logo);
        result.logo = logo;
      }

      if (thisExperience.config) {
        if (thisExperience.config.theme_color) {
          result.color = thisExperience.config.theme_color;
          this.cacheService.setLocalObject(configKeys.color, thisExperience.config.theme_color);
        }

        if (thisExperience.config.spinwheel) {
          this.cacheService.setLocalObject(configKeys.spinwheel, thisExperience.config.spinwheel);
        }

        if (thisExperience.config.html_branding) {
          this.cacheService.setLocalObject(configKeys.html, thisExperience.config.html_branding);
          result.html_branding = thisExperience.config.html_branding;
        }

        this.cacheService.setLocalObject(configKeys.customConfig, thisExperience.config);
      }
    }

    return result;
  }

  /**
   * get color and logo from custom branding config
   * @return {Promise}
   */
  async getConfig(domain?): Promise<CustomBranding> {
    const res = await this.experienceConfig('dev-skills.practera.com').toPromise();
    const result = this.cacheConfig(res);
    return result;
  }

  experienceConfig(domain?): Observable<any> {
    const location: Location = window.location;
    let options = new RequestOptions({headers: this.headerData()});
    return this.http.get(`${this.prefixUrl}${APIs.experience}?domain=${domain || location.host}`, options).map(res => res.json());
  }

  getTerms() {
    let options = new RequestOptions({headers: this.headerData()});
    return this.http.get(this.prefixUrl+'api/registration_details.json', options)
                    .map(res => res.json());
  }

  verifyRegistration(data) {
    let options = new RequestOptions({headers: this.headerData()});
    let urlSearchParams = new URLSearchParams([
      `email=${data.email}`,
      `key=${data.key}`
    ].join('&'));
    return this.http.post(this.AUTH_ENDPOINT+'verify_registration', urlSearchParams.toString(), options).map(res => res.json());
  }

  register(data) {
    let urlSearchParams = new URLSearchParams([
      `password=${data.password}`,
      `user_id=${data.user_id}`,
      `key=${data.key || 'thisissamplekey'}`
    ].join('&'));
    return this.request.post('api/auths.json?action=registration', urlSearchParams, {
      'Content-Type': 'application/x-www-form-urlencoded',
    });
  }

  loginAuth(email, password) {
    let urlSearchParams = new URLSearchParams([
      `data[User][email]=${email}`,
      `data[User][password]=${password}`
    ].join('&'));
    return this.request.post('api/auths.json?action=authentication', urlSearchParams, {
      'Content-Type': 'application/x-www-form-urlencoded',
    }).map(res => {
      this.cacheUserSpecificConfig(res);
      return res;
    });
  }

  forgotPassword(email){
    let options = new RequestOptions({headers: this.headerData()});
    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('email', email);
    return this.http.post(this.AUTH_ENDPOINT+'forgot_password', urlSearchParams.toString(), options).map(res => res.json());
  }

  verifyUserKeyEmail(key, email){
    let options = new RequestOptions({headers: this.headerData()});
    let urlSearchParams = new URLSearchParams([
      `key=${key}`,
      `email=${email}`
    ].join('&'));
    return this.request.post('api/auths.json?action=verify_reset_password', urlSearchParams);
  }

  resetUserPassword(key, email, password, verify_password) {
    let urlSearchParams = new URLSearchParams([
      `key=${key}`,
      `email=${email}`,
      `password=${password}`,
      `verify_password=${verify_password}`
    ].join('&'));
    return this.request.post('api/auths.json?action=reset_password', urlSearchParams);
  }

  magicLinkLogin(auth_token){
    let options = new RequestOptions({headers: this.headerData()});
    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('auth_token', auth_token);
    return this.http.post(this.prefixUrl+'api/auths.json?', urlSearchParams.toString(), options)
                    .map(res => res.json());
  }

  getUser() {
    return this.request.get('api/users.json');
  }

  isAuthenticated() {
    return true;
  }

  editUserProfile(profiledata: ProfileData) {
    return this.request.post('api/v2/user/account/edit', profiledata, {
      'Content-Type': 'application/json'
    });
  }

}
