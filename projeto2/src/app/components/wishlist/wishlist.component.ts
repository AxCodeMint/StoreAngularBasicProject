import { Component, OnInit } from '@angular/core';
import { WishlistserviceService } from '../../services/wishlistservice.service';
import { Router } from '@angular/router';
import { SessionserviceService } from '../../services/sessionservice.service';
import { UserWishlist } from '../../models/userwishlist.type';
import { Product } from '../../models/product.type';
import { CommonModule } from '@angular/common';
import { Userinfo } from '../../models/userinfo.type';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css'
})
export class WishlistComponent implements OnInit {
  wishlistItems: UserWishlist = { id: 0, userId: 0, products: [] };
  isLoading = true;
  userInfo: Userinfo | null = null;
  isLogged:boolean = false;

  constructor(
    private wishlistService: WishlistserviceService,
    private router: Router,
    private sessionService: SessionserviceService
  ) {}

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

    this.getListFromService();
  }

  getListFromService() {
    const userId = Number(this.userInfo?.id);
    this.wishlistService.getListItemsByUserId(userId).subscribe({
      next: list => {
        this.wishlistItems = list || { id: 0, userId: userId, products: [] };
        this.isLoading = false;
      },
      error: () => {
        this.wishlistItems = { id: 0, userId: userId, products: [] };
        this.isLoading = false;
      }
    });
  }

  clearList() {
    const userId = Number(this.userInfo?.id);
    this.wishlistService.clearList(userId).subscribe(() => {
      this.wishlistItems.products = [];
    });
  }

  goToProductPage(item: Product) {
    this.router.navigate(['/productdetail', item.id]);
  }

  removeFromList(item: Product, event: Event) {
    event.stopPropagation();
    const userId = Number(this.userInfo?.id);
    this.wishlistService.removeFromList(userId, item.id).subscribe(() => {
      this.wishlistItems.products = this.wishlistItems.products.filter(product => product.id !== item.id);
    });
  }
}