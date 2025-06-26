import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly apiUrl = 'https://alkinanamedstore.com/api/carts';
  constructor(private http: HttpClient) {}

  createOrder(order: any) {
    return this.http.post(this.apiUrl, order);
  }

  fulfillOrder(request:any):Observable<any>{
    return this.http.post<any>(this.apiUrl+'/active',request);
  }
}
