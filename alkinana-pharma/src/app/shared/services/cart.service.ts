import { HttpClient, HttpParams } from '@angular/common/http';
import { Expansion } from '@angular/compiler';
import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface CartResponse{
  carts : any[]
  totalCount:number;
  pageNumber:number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private storageKey = 'cart';

  cartUpdated = new EventEmitter<void>();

  private readonly apiUrl = 'https://alkinanamedstore.com/api/customers/carts';

  private cartSubject = new BehaviorSubject<any[]>(this.loadCartFromStorage());

  cart$ = this.cartSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadCartFromStorage();
   }

   getCartUpdates(){
    return this.cartSubject.asObservable();
   }

  loadCartFromStorage() {
    const savedCart = localStorage.getItem(this.storageKey);

    return savedCart? JSON.parse(savedCart) : [];
  }

  addToCart(product:any){
    const cartItems = this.loadCartFromStorage();
    const existingItem = cartItems.find((item:any) => item.productId.value === product.productId.value);

    if(existingItem){
      existingItem.quantity += 1;
    }
    else{
      cartItems.push({...product, quantity:1});
    }
    this.saveCart(cartItems);
  }

  removeFromCart(productId: string) {
    let cartItems = this.getCartItems();
    cartItems = cartItems.filter((item: any) => item.productId.value !== productId);
    this.saveCart(cartItems);
  }

  updateQuantity(productId: number, newQuantity: number) {
    const cartItems = this.getCartItems();
    const item = cartItems.find((i: any) => i.id === productId);
    if (item) {
      item.quantity = newQuantity;
      this.saveCart(cartItems);
    }
  }

  getCartItems() {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  clearCart() {
    localStorage.removeItem(this.storageKey);
    this.cartUpdated.emit();
  }

  private saveCart(items: any[]) {
    localStorage.setItem(this.storageKey, JSON.stringify(items));
    this.cartUpdated.emit();
  }

  getTotal() {
    return this.getCartItems().reduce((acc:any, item:any) => 
      acc + (item.publicPrice * item.quantity), 0);
  }

  checkout(){
    const  cartItems = this.loadCartFromStorage();

    return this.http.post(this.apiUrl, {items:cartItems}).pipe(
      tap(() => {
        localStorage.removeItem(this.storageKey);
        this.clearCart();
      })
    );
  }

  getCarts(
    pageNumber: number,
    pageSize: number,
    fil?: string,
    opt?: string,
  ): Observable<CartResponse> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

      if(opt){
        if(fil){
          if (opt == "Customer Name") params = params.set('Name', fil);
          if (opt == "Pharma Name") params = params.set('Pharma', fil);
        }
      }

    if(params){
      return this.http.get<any>(this.apiUrl, { params });
    }
    else{
      return this.http.get<any>(this.apiUrl);
    }

    
  }

  
}
