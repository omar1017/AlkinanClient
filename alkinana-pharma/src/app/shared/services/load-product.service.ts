import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadProductService {
  private buttonClickedSource = new Subject<void>();

  buttonClicked = this.buttonClickedSource.asObservable();
  
  
  trigerButtonClicked(data:any){
    this.buttonClickedSource.next(data);
  }
}
