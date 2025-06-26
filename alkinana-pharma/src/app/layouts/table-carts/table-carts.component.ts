import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableComponent } from "../table/table.component";
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { ProductService } from '../../shared/services/product.service';
import { LoadProductService } from '../../shared/services/load-product.service';

@Component({
  selector: 'app-table-carts',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TableComponent],
  templateUrl: './table-carts.component.html',
  styleUrl: './table-carts.component.css'
})
export class TableCartsComponent implements OnInit {
  @Input() cartForm!: FormGroup;
  @Input() isLoadingCarts!: boolean;
  @Input() errorMessageCarts: string | null = null;


  productForm: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private productService: ProductService) {
    this.productForm = this.fb.group({
      products: this.fb.array([])
    });
  }

  ngOnInit(): void {
    if (!this.cartForm) {
      this.initializeCartForm(); // تأكد من تهيئة النموذج إذا لم يكن موجودًا
    }
    this.loadProductsFromCarts();
  }

  initializeCartForm(): void {
    this.cartForm = this.fb.group({
      carts: this.fb.array([])
    });
  }

  get carts(): FormArray {
    return this.cartForm.get('carts') as FormArray;
  }

  getCustomer(cart: AbstractControl): FormGroup | null {
    return cart.get('customer') as FormGroup | null;
  }

  get products(): FormArray {
    return this.productForm.get('products') as FormArray;
  }

  createProductFormGroup(product?: any): FormGroup {
    return this.fb.group({
      id: product?.productId?.value || '',
      name: product?.productName || '',
      image: product?.image || '',
      imageUrl: product?.productImage?.url || '',
      imageId: product?.productImage?.id || '',
      description: product?.description || '',
      companyName: product?.companyName || '',
      price: product?.price || '',
      supplier: product?.supplier || '',
      notes: product?.notes || '',
      isActive: product?.isActive || false
    });
  }

  loadProductsFromCarts(): void {
    this.products.clear(); // تنظيف المنتجات القديمة

    if (!this.carts) return;

    this.carts.controls.forEach((cartControl) => {
      const cartProducts = cartControl.get('products') as FormArray;
      cartProducts?.controls.forEach((productControl) => {
        this.products.push(this.createProductFormGroup(productControl.value));
      });
    });
  }

  addProducts(): void {
    this.products.push(this.createProductFormGroup());
  }

  patchActive(index: number, product: any) {
    this.products.at(index).patchValue({
      id: product?.id || '',
      name: product?.name || '',
      imageUrl: product?.imageUrl || '',
      imageId: product?.imageId || '',
      companyName: product?.companyName || '',
      description: product?.description || '',
      supplier: product?.supplier || '',
      price: product?.price || '',
      image: product?.image || '',
      isActive: true
    });
  }
}

