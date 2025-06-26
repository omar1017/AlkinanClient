import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  // تجنب إضافة الهيدر لطلبات معينة
  if (req.url.includes('/refresh-token') || req.url.includes('/login')) {
    return next(req);
  }

  const authToken = authService.getAccessToken();
  const authReq = authToken ? addTokenHeader(req, authToken) : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !authReq.url.includes('/refresh-token')) {
        return handle401Error(authReq, next, authService, router);
      }
      return throwError(() => error);
    })
  );
};

function addTokenHeader(req: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
  return req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });
}

function handle401Error(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  authService: AuthService,
  router: Router
) {
  // منع طلبات متعددة للتجديد في نفس الوقت
  if (!authService.isRefreshing) {
    authService.isRefreshing = true;
    
    return authService.refreshToken().pipe(
      switchMap((newTokens) => {
        authService.isRefreshing = false;
        const newRequest = addTokenHeader(req, newTokens.token);
        return next(newRequest);
      }),
      catchError((refreshError) => {
        authService.isRefreshing = false;
        authService.deleteToken();
        router.navigate(['/signin']);
        return throwError(() => refreshError);
      })
    );
  }
  
  // إذا كان هناك طلب تجديد قيد التنفيذ، انتظر حتى ينتهي
  return authService.tokenRefreshed$.pipe(
    switchMap(() => {
      const newToken = authService.getAccessToken();
      const newRequest = addTokenHeader(req, newToken);
      return next(newRequest);
    })
  );
}