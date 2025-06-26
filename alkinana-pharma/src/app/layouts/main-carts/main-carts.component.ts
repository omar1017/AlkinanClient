import { Component, inject, OnInit } from '@angular/core';
import { PagenationComponent } from "../pagenation/pagenation.component";
import { LoadingComponent } from "../loading/loading.component";
import { TableCartsComponent } from "../table-carts/table-carts.component";
import { AbstractControl, FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { catchError, of, Subscription } from 'rxjs';
import { LoadProductService } from '../../shared/services/load-product.service';
import { CartService } from '../../shared/services/cart.service';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../shared/services/order.service';
import { FilterComponent } from "../filter/filter.component";
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-main-carts',
  imports: [PagenationComponent, LoadingComponent, CommonModule, FormsModule, ReactiveFormsModule, FilterComponent],
  templateUrl: './main-carts.component.html',
  styleUrl: './main-carts.component.css'
})
export class MainCartsComponent implements OnInit {
  carts!: any[];
  isLoading = false;
  errorMessage: string | null = null;

  pageNumber: number = 1;
  pageSize: number = 10;
  totalCount: number = 0;

  options = ['Customer Name', 'Pharma Name']

  constructor(private fb: FormBuilder, private cartService: CartService, private orderService:OrderService, private authService: AuthService, private router:Router) {
    
  }

  
  ngOnInit(): void {
    this.loadCarts(this.pageNumber, this.pageSize);
  }

  onLogout(){
    this.authService.deleteToken();
    this.router.navigateByUrl('/signin');
  }

  markAsFulfilled(orderId: any): void {
    this.isLoading = true;
  
    this.orderService.fulfillOrder(orderId)
      .pipe(
        catchError(error => {
          console.error(error);
          this.isLoading = false;
          return of(null);
        })
      )
      .subscribe(() => {
        this.carts = this.carts.map(cart => {
          if (cart.cartId.value !== orderId.cartId) return cart;
  
          // تعديل حالة المنتج المعني (toggle)
          const updatedProducts = cart.products.map((product: any) => {
            if (product.lineItemId.value === orderId.lineItemId) {
              return { ...product, isFulfilled: !product.isFulfilled };
            }
            return product;
          });
  
          // التحقق إن كانت كل المنتجات مفعّلة
          const allFulfilled = updatedProducts.every((p: any) => p.isFulfilled);
  
          return {
            ...cart,
            products: updatedProducts,
            isFulfilled: allFulfilled
          };
        });
  
        this.isLoading = false;
      });
  }
  
  

 
  async loadCarts(pn: number, pz: number, fil?:string, opt?:string): Promise<void> {
    this.isLoading = true;

    try {
      this.cartService.getCarts(pn, pz,fil,opt).subscribe(response => {
        this.totalCount = response.totalCount;
        this.carts = response.carts.map(cart => ({
          ...cart, dateCreated: new Date(cart.dateCreated).toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true
          })
        }));
        this.isLoading = false;
      });
    } catch (error) {
      this.errorMessage = 'فشل في تحميل بيانات العربات';
      console.error(error);
      this.isLoading = false;
    }
  }

  previousPage() {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.loadCarts(this.pageNumber, this.pageSize);
    }
  }

  nextPage() {
    if (this.pageNumber * this.pageSize < this.totalCount) {
      this.pageNumber++;
      this.loadCarts(this.pageNumber, this.pageSize);
    }
  }

  get totalPages() {
    return Math.ceil(this.totalCount / this.pageSize);
  }
}