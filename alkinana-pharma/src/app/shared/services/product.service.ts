import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface IProduct {             
  name: string;
  image: string;
  companyName: string;
  description: string;
  price: number;
  supplier: string; 
}

export interface PagedResponse<T> {
  products: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private readonly apiUrl = 'https://alkinanamedstore.com/api/products';

  constructor(private http: HttpClient) { }

  getAllProducts(
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
          if (opt == "Company") params = params.set('Company', fil);
          if (opt == "Supplier") params = params.set('Supplier', fil);
        }
      }

    if(params){
      return this.http.get<any>(this.apiUrl+'/all', { params });
    }
    else{
      return this.http.get<any>(this.apiUrl+'/all');
    }

    
  }

  getProducts(
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
          if (opt == "Company") params = params.set('Company', fil);
          if (opt == "Supplier") params = params.set('Supplier', fil);
        }
      }

    if(params){
      return this.http.get<any>(this.apiUrl, { params });
    }
    else{
      return this.http.get<any>(this.apiUrl);
    }

    
  }

  getProductById(id: string): Observable<IProduct> {
    return this.http.get<IProduct>(`${this.apiUrl}/${id}`);
  }

  addProduct(product: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, product);
  }

  updateProduct(id: string, product: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, product);
  }

  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  
  activeProduct(id:any):Observable<any>{
    return this.http.put<any>(this.apiUrl+'/Active/'+id,{id:id});
  }
}
