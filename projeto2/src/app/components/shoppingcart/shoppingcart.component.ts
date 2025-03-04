import { Component } from '@angular/core';
import { Product } from '../../models/product.type';
import { CartserviceService } from '../../services/cartservice.service';
import { CommonModule } from '@angular/common';
import { UserCart } from '../../models/usercart.type';
import { Router } from '@angular/router';
import { SessionserviceService } from '../../services/sessionservice.service';
import { Userinfo } from '../../models/userinfo.type';

@Component({
  selector: 'app-shoppingcart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shoppingcart.component.html',
  styleUrl: './shoppingcart.component.css'
})
export class ShoppingcartComponent {
  cartItems: UserCart = { id: 0, userId: 0, products: [] };
  isLoading = true;
  userInfo: Userinfo | null = null;
  isLogged: boolean = false; 

  constructor(private cartService: CartserviceService, private router: Router, private sessionService: SessionserviceService) { }

  ngOnInit() {
    this.sessionService.isLogged$.subscribe(isLogged => {
      this.isLogged = isLogged;
    });

    this.sessionService.userInfo$.subscribe(userInfo => {
      this.userInfo = userInfo;
    });

    if (this.isLogged === false) {
      this.router.navigate(['**']);
    }

    this.getCartFromService();
  }

  getCartFromService() {
    const userId = Number(this.userInfo?.id);
    this.cartService.getCartItemsByUserId(userId).subscribe({
      next: cart => {
        this.cartItems = cart || { id: 0, userId: userId, products: [] };
        this.isLoading = false;
      },
      error: () => {
        this.cartItems = { id: 0, userId: userId, products: [] };
        this.isLoading = false;
      }
    });
  }

  getTotalPrice(): number {
    return this.cartItems.products.reduce((total, product) => total + product.price, 0);
  }

  clearCart() {
    const userId = Number(this.userInfo?.id);
    this.cartService.clearCart(userId).subscribe(() => {
      this.cartItems.products = [];
    });
  }

  goToProductPage(item: Product) {
    this.router.navigate(['/productdetail', item.id]);
  }

  removeFromCart(item: Product, event: Event) {
    event.stopPropagation();
    const userId = Number(this.userInfo?.id);
    this.cartService.removeFromCart(userId, item.id).subscribe(() => {
      this.cartItems.products = this.cartItems.products.filter(product => product.id !== item.id);
    });
  }
}