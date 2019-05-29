import {
  ModuleWithProviders,
  NgModule,
  SkipSelf,
  Optional
} from '@angular/core';
import { HttpModule, XHRBackend, RequestOptions } from '@angular/http';
import { CommonModule} from '@angular/common';
import '../rxjs-operators';
import { RequestServiceConfig, RequestService } from './request.service';
import { TokenInterceptor } from './token.interceptor';
import { CacheService } from '../../shared/cache/cache.service';

@NgModule({
  imports: [HttpModule, CommonModule, /* spare a space for appcache module*/],
  providers: [
    RequestService,
    {
      provide: TokenInterceptor,
      useFactory:
        (backend: XHRBackend, defaultOptions: RequestOptions) => new TokenInterceptor(backend, defaultOptions),
      deps: [XHRBackend, RequestOptions]
    }
    // { provide: RequestOptions, useClass: CustomRequestOption }
  ]
})

export class RequestModule {
  constructor(@Optional() @SkipSelf() parentModule: RequestModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only');
    }
  }

  static forRoot(config: RequestServiceConfig): ModuleWithProviders {
    return {
      ngModule: RequestModule,
      providers: [
        {
          provide: RequestServiceConfig, useValue: config
        }
      ]
    }
  }
}
