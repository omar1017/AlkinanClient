import { Component } from '@angular/core';
import { CartService } from '../shared/services/cart.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cart',
  imports: [CommonModule,FormsModule,ReactiveFormsModule,RouterModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  cartItems: any[] = [];

  constructor(
    private cartService: CartService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.loadCartItems();
  }

  // تحميل عناصر السلة عند التهيئة
  private loadCartItems() {
    this.cartItems = this.cartService.getCartItems();
  }

  // تحديث الكمية
  updateQuantity(item: any, change: number) {
    const newQuantity = item.quantity + change;
    
    if (newQuantity < 1) {
      this.removeItem(item.id);
      return;
    }
    
    item.quantity = newQuantity;
    this.cartService.updateQuantity(item.id, newQuantity);
  }

  // حذف العنصر
  removeItem(productId: string) {
    this.cartService.removeFromCart(productId);
    this.cartItems = this.cartService.getCartItems(); // تحديث القائمة
  }

  // حساب المجموع الكلي
  getTotal(): number {
    return this.cartService.getTotal();
  }

  // الانتقال إلى صفحة الدفع
  checkout() {
    if (this.cartItems.length === 0) {
      this.toastr.error('السلة فارغة');
      return;
    }
    this.router.navigate(['/checkout']);
  }
}