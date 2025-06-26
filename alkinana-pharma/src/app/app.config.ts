import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, RouterModule } from '@angular/router';
import { BsModalRef, BsModalService, ModalModule } from 'ngx-bootstrap/modal';

import { routes } from './app.routes';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { authInterceptor } from './interceptors/auth.interceptor';
import { JWT_OPTIONS, JwtHelperService, JwtModule } from '@auth0/angular-jwt';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export function jwtOptionsFactory() {
  return {
    tokenGetter: () => localStorage.getItem('token'),
    allowedDomains: ['http://localhost'], 
    disallowedRoutes: [''] 
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),    
    importProvidersFrom(BrowserModule),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimationsAsync(),
    provideToastr({positionClass:'toast-top-center'}),
    RouterModule,
    ModalModule,
    BsModalRef,
    BsModalService,
    JwtHelperService,
    importProvidersFrom(
      JwtModule.forRoot({
        jwtOptionsProvider: {
          provide: JWT_OPTIONS,
          useFactory: jwtOptionsFactory,
        },
      })
    )
  ]
};
