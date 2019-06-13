import { Injectable } from '@angular/core';
import { CacheService } from '../shared/cache/cache.service';
import { RequestService } from '../shared/request/request.service';
import { Observable } from 'rxjs/Observable';
import { Observable, interval, pipe } from 'rxjs';
import { switchMap, concatMap, tap, retryWhen, take, delay } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class VersionCheckService {
  private currentHash = '{{POST_BUILD_ENTERS_HASH_HERE}}';

  constructor(
    private request: RequestService,
    private cacheService: CacheService,
    private router: Router
  ) {}

  // check every 5 seconds
  initiateVersionCheck(frequency = 1000 * 5) {
    return this.trackVersion(frequency).subscribe(
      (res: { hash: string; version: string; }) => {
        if (this.hasHashChanged(this.currentHash, res.hash)) {
          this.router.navigate(['logout', { t: new Date().getTime() }]);
        }
      },
      (err) => console.log
    );
  }

  trackVersion(frequency): Observable<any> {
    return interval(frequency).pipe(
      switchMap(() => this.request.get(`${window.location.origin}/version.json?t=${new Date().getTime()}`, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
          'Pragma': 'no-cache',
          'Expires': 0,
        }}),
      ),
      retryWhen(errors => {
        // retry for 5 times if anything go wrong
        return errors.pipe(delay(1000), take(5));
      })
    );
  }

  private hasHashChanged(currentHash, newHash) {
    if (!currentHash || currentHash === '{{POST_BUILD_ENTERS_HASH_HERE}}') {
      return false;
    }

    return currentHash !== newHash;
  }
}
