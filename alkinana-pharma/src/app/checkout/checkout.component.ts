import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CartService } from '../shared/services/cart.service';
import { OrderService } from '../shared/services/order.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-checkout',
  imports: [CommonModule,FormsModule,ReactiveFormsModule,RouterModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {
  cartItems: any; 

  regexPhone = "^\\+\\d{1,3}\\d{9,15}$";

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.cartItems = this.cartService.getCartItems();
  }

  getTotal() {
    return this.cartService.getTotal();
  }
  validateNumber(event: KeyboardEvent) {
    const inputChar = String.fromCharCode(event.keyCode);
    if (!/^\\d+$/.test(inputChar)) {
      event.preventDefault();
    }
  }
  

  submitOrder(formData?: any) {
    const order = {
      name:formData.value.name,
      pharmaName: formData.value.pharmaName,
      phone: formData.value.phone,
      address: formData.value.address,
      items: this.cartItems.map((item:any) => ({
        productId: item.productId.value,
        quantity: item.quantity,
      }))
    };

    this.orderService.createOrder(order).subscribe({
      next: () => {
        this.cartService.clearCart();
        this.router.navigate(['/order-confirmation']);
      },
      error: (err) => {
        alert('حدث خطأ أثناء إرسال الطلبية!');
      }
    });
  }
}