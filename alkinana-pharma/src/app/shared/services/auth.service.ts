import { Injectable } from '@angular/core';
import { TOKEN_KEY } from '../utils/constants';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, Subject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly ACCESS_TOKEN = 'access_token';
  private readonly REFRESH_TOKEN = 'refresh_token';

  isRefreshing = false;
  tokenRefreshed$ = new Subject<void>();


  private readonly apiUrl = 'https://alkinanamedstore.com/api/';

  constructor(private http: HttpClient, private jwtHelper: JwtHelperService) { }

  createUser(formData:any){
    return this.http.post(this.apiUrl+'accounts/register',formData);
  }

  signin(formData:any):Observable<any>{
    return this.http.post(this.apiUrl+'accounts/login',formData).pipe(tap(res => this.storeTokens(res)));
  }

  isLoggedIn():boolean{
    return this.getAccessToken() != null ? true :false;
  }

  deleteToken(){
    localStorage.removeItem(this.ACCESS_TOKEN);
    localStorage.removeItem(this.REFRESH_TOKEN);
  }

  getClaims(){
    return JSON.parse(window.atob(this.getAccessToken()!.split('.')[1]));
  }

  

  saveToken(token:string){
    localStorage.setItem(TOKEN_KEY,token);
  }

  getUserRole(): string | null {
    const token = this.getAccessToken();
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      return decodedToken.role;
    }
    return '';
  }

  isAdmin():boolean{
    const token = this.getAccessToken();
    if(token){
      const decodedToken = this.jwtHelper.decodeToken(token);

      return decodedToken && decodedToken.role === 'Administrator';
    }
    return false;
  }

   storeTokens(tokens: any): void {
    localStorage.setItem(this.ACCESS_TOKEN, tokens.token);
    localStorage.setItem(this.REFRESH_TOKEN, tokens.refreshToken);
  }


  refreshToken(): Observable<any> {
    const refreshToken = localStorage.getItem(this.REFRESH_TOKEN);
    const request = {
      token: localStorage.getItem(this.ACCESS_TOKEN),
      refreshToken: refreshToken
    };
    return this.http.post<any>(this.apiUrl+'accounts/refresh-token', request)

      .pipe(tap(res => {
        this.storeTokens(res);
        this.tokenRefreshed$.next();
      }));
  }

  // الدالة الجديدة لاسترجاع الـ Access Token
  getAccessToken(): string{
    return localStorage.getItem(this.ACCESS_TOKEN)!;
  }

  // الدالة الجديدة لاسترجاع الـ Refresh Token
  getRefreshToken(): string {
    return localStorage.getItem(this.REFRESH_TOKEN)!;
  }
}
