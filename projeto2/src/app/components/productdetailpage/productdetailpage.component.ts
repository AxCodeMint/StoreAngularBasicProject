import { Component } from '@angular/core';
import { Product } from '../../models/product.type';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CartserviceService } from '../../services/cartservice.service';
import { ProductserviceService } from '../../services/productservice.service';
import { SessionserviceService } from '../../services/sessionservice.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Userinfo } from '../../models/userinfo.type';

@Component({
  selector: 'app-productdetailpage',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './productdetailpage.component.html',
  styleUrl: './productdetailpage.component.css'
})
export class ProductdetailpageComponent {
  productId!: number;
  product: Product | null = null;
  message: string = "";
  isLogged: boolean = false;
  userInfo: Userinfo | null = null;

  constructor(
    private productService: ProductserviceService,
    private cartService: CartserviceService,
    private route: ActivatedRoute,
    private sessionService: SessionserviceService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.sessionService.isLogged$.subscribe(isLogged => {
      this.isLogged = isLogged;
    });

    this.sessionService.userInfo$.subscribe(userInfo => {
      this.userInfo = userInfo;
    });

    this.route.params.subscribe(params => {
      this.productId = +params['id'];

      this.loadProductDetails();
    });
  }

  loadProductDetails() {
    if (this.productId) {
      this.productService.getProduct(this.productId).subscribe({
        next: (product) => {
          this.product = product;
        },
        error: (error) => this.handleError("Erro ao buscar detalhes do produto: " + error)
      });
    }
  }

  addToCart() {
    if (this.product) {
      const userId = Number(this.userInfo?.id);
      this.cartService.addToCart(userId, this.product).subscribe({
        next: () => {
          this.message = 'Produto adicionado ao carrinho!';
        },
        error: (error) => {
          this.handleError('Erro ao adicionar o produto ao carrinho: ' + error);
        }
      });
    }
  }

  goBack() {
    window.history.go(-1);
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, "OK", {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'right'
    });
  }

  handleError(error: any) {
    // idealmente não queremos mostrar o erro original ao utilizador, mas sim uma mensagem genérica: ou mostra-se na snackbar ou redireciona-se para uma página de erro genérica
    this.openSnackBar('Ocorreu um erro!');
  }
}