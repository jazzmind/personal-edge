import { Injectable } from '@angular/core';
import { CacheService } from '../shared/cache/cache.service';
import { RequestService } from '../shared/request/request.service';
import { Observable } from 'rxjs/Observable';
import { pipe } from 'rxjs/util';
import { switchMap, concatMap, tap, retryWhen, take, delay } from 'rxjs/operators';

@Injectable()
export class VersionCheckService {
  private currentHash = '{{POST_BUILD_ENTERS_HASH_HERE}}';

  constructor(
    private request: RequestService,
    private cacheService: CacheService,
  ) {}

  // check every 5 seconds
  initiateVersionCheck(frequency = 1000 * 5) {
    return this.trackVersion(frequency).subscribe(
      (res: { hash: string; version: string; }) => {
        if (this.hasHashChanged(this.currentHash, res.hash)) {
          // force user logout
          this.cacheService.clear();
          window.location.replace('/');
        }
      },
      (err) => console.log
    );
  }

  trackVersion(frequency) {
    return Observable.interval(frequency)
      .switchMap(() => this.request.get(`${window.location.origin}/version.json?t=${new Date().getTime()}`, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
          'Pragma': 'no-cache',
          'Expires': 0,
        }}),
      )
      .retryWhen(errors => errors.delay(1000).take(5)); // retry for 5 times if anything go wrong
  }

  private hasHashChanged(currentHash, newHash) {
    if (!currentHash || currentHash === '{{POST_BUILD_ENTERS_HASH_HERE}}') {
      return false;
    }

    return currentHash !== newHash;
  }
}
