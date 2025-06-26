import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private readonly apiUrl = 'https://alkinanamedstore.com/api/files';

  constructor(private http:HttpClient) { }

  uploadImage(image:FormData):Observable<any>{
    return this.http.post(`${this.apiUrl}`,image);
  }

  deleteProductImage(image:any,fileName: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${fileName}`,image);
  }
}
