import { Injectable } from '@angular/core';
import { CacheService } from '../shared/cache/cache.service';
import { RequestService } from '../shared/request/request.service';
import { Observable } from 'rxjs/Observable';
@Injectable()
export class VersionCheckService {
  private currentHash = '{{POST_BUILD_ENTERS_HASH_HERE}}';

  constructor(
    private request: RequestService,
    private cacheService: CacheService,
  ) {}

  // check every 5 seconds
  initiateVersionCheck(frequency = 1000 * 5) {
    return this.trackVersion(frequency).subscribe(res => {
      if (this.hasHashChanged(this.currentHash, res.hash)) {
        // force user logout
        localStorage.clear();
        window.location.replace(`/index.html?t=${new Date().getTime()}`);
      }
    });
  }

  trackVersion(frequency) {
    return Observable.interval(frequency)
      .flatMap(() => this.request.get(`${window.location.origin}/version.json?t=${new Date().getTime()}`))
      .retryWhen(errors => errors.delay(1000).take(5)); // retry for 5 times if anything go wrong
  }

  private hasHashChanged(currentHash = '{{POST_BUILD_ENTERS_HASH_HERE}}', newHash) {
    if (currentHash === newHash) {
      return false;
    }

    return currentHash !== newHash;
  }
}
