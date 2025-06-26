import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductService } from '../shared/services/product.service';
import { LoadingComponent } from "../layouts/loading/loading.component";
import { PagenationComponent } from "../layouts/pagenation/pagenation.component";
import { CartService } from '../shared/services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { RouterModule } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { WrongComponent } from '../wrong/wrong.component';
import { FilterComponent } from "../layouts/filter/filter.component";
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-product-items',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, LoadingComponent, PagenationComponent, RouterModule, FilterComponent],
  templateUrl: './product-items.component.html',
  styleUrl: './product-items.component.css'
})
export class ProductItemsComponent implements OnInit {
  isLoading = false;
  errorMessage: string | null = null;

  pageNumber: number = 1;
  pageSize: number = 10;
  totalCount: number = 0;
  searchText: string = '';

  options = ['Name','Company']

  modalRef? : BsModalRef;
  private modalService = inject(BsModalService);

  cartCount = 0;

  products: any[] = [];


  constructor(private productService:ProductService,private cartService : CartService, private toastr: ToastrService, private sanitizer : DomSanitizer) {}

  ngOnInit(): void {
    this.loadProducts(this.pageNumber,this.pageSize);
    this.cartService.cartUpdated.subscribe(() => {
      this.cartCount = this.cartService.getCartItems().length;
    });
    this.cartCount = this.cartService.getCartItems().length;
  }

  addToCart(product : any){
    this.cartService.addToCart(product);
    this.toastr.success('تمت إضافة المنتج إلى السلة');
  }

  openWrong(product:any){
   
     this.modalRef = this.modalService.show(WrongComponent, { initialState:{ product:product } });
  }

  async loadProducts(pn: number, pz: number, opt?: string, fil?: string): Promise<void> {
    try {
        this.isLoading = true;
  
      const response = this.productService.getAllProducts(pn, pz, opt, fil);
      
      response.subscribe(res => {
        this.totalCount = res.totalCount;
        this.pageNumber = res.pageNumber;
        this.products =  res.products;
  
         this.isLoading = false; 
      }); 
    } catch (error) {
      this.errorMessage = 'Failed to load products';
      console.error(error);
    }
  }

  previousPage() {
    if (this.pageNumber > 1) {
      this.loadProducts(this.pageNumber - 1,this.pageSize);
    }
  }

  nextPage() {
    if (this.pageNumber * this.pageSize < this.totalCount) {
      this.loadProducts(this.pageNumber + 1,this.pageSize);
    }
  }

  get totalPages() {
    return Math.ceil(this.totalCount / this.pageSize);
  }
}
