import { Injectable } from '@angular/core';
import {
  Request,
  Response,
  RequestOptions,
  RequestOptionsArgs,
  Http,
  Headers,
  ConnectionBackend
} from '@angular/http';
import { tap } from "rxjs/operators";
import { Observable } from 'rxjs/Observable';

@Injectable()
export class TokenInterceptor extends Http {
  constructor(backend: ConnectionBackend, defaultOptions: RequestOptions) {
    super(backend, defaultOptions);
  }

  request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
    return super.request(url, options);
  }

  get(url: string, options?: RequestOptionsArgs): Observable<any> {
    this.beforeRequest();
    return super.get(url, options)//this.requestOptions(options))
      .catch(this.onCatch)
      .do((res: Response) => {
        this.onSuccess(res);
      }, (error: any) => {
        this.onError(error);
      })
      .finally(() => {
        this.onFinally();
      });
  }

  private getRequestOptionArgs(options?: RequestOptionsArgs) : RequestOptionsArgs {
    if (options == null) {
      options = new RequestOptions();
    }
    if (options.headers == null) {
      options.headers = new Headers();
    }
    options.headers.append('Content-Type', 'application/json');

    return options;
  }

  /*private requestOptions(options?: RequestOptionsArgs): RequestOptionsArgs {
    if (options == null) {
      options = new RequestOptions();
    }
    if (options.headers == null) {
      options.headers = new Headers({
        'Authorization': `Basic ${environment.basic_auth_token}`,
        'X-Auth-Token': localStorage.getItem('access_token')
      });
    }
    return options;
  }

  private getFullUrl(url: string): string {
    return environment.apiEndpoint + url;
  }*/

  /**
   * Before any Request.
   */
  private beforeRequest(): void {
    console.log(arguments);
  }

  /**
   * After any request.
   */
  private afterRequest(): void {
    console.log(arguments);
  }

  /**
   * Error handler.
   * @param error
   * @param caught
   * @returns {ErrorObservable}
   */
  private onCatch(error: any, caught: Observable<any>): Observable<any> {
    console.log(error);
    console.log(caught);
    return Observable.throw(error);
  }

  /**
   * onSuccess
   * @param res
   */
  private onSuccess(res: Response): void {
    console.log(res);
  }

  /**
   * onError
   * @param error
   */
  private onError(error: any): void {
    console.log(arguments);
  }

  /**
   * onFinally
   */
  private onFinally(): void {
    this.afterRequest();
  }
}
