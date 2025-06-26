import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {

  private readonly apiUrl = 'https://alkinanamedstore.com/api/suppliers/';

  constructor(private http:HttpClient) { }

  activeSupplier(id:any):Observable<any>{
    return this.http.put<any>(this.apiUrl+id,{id:id});
  }

  getSuppliers(
    pageNumber: number,
    pageSize: number,
    fil?: string,
    opt?: string,
  ): Observable<any> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

      if(opt){
        if(fil){
          if (opt == "Name") params = params.set('Name', fil);
          if (opt == "Address") params = params.set('Address', fil);
        }
      }

    if(params){
      return this.http.get<any>(this.apiUrl, { params });
    }
    else{
      return this.http.get<any>(this.apiUrl);
    }
    
  }

  deleteSupplier(id:any):Observable<any>{
    return this.http.delete<any>(this.apiUrl+id);
  }
}
