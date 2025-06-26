import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly apiUrl = 'https://alkinanamedstore.com/api/patients/';


  constructor(private http:HttpClient,
    private authServic:AuthService
  ) { }

  getUserProfile(){
    return this.http.get(this.apiUrl+'accounts/UserProfile');
  }
}
