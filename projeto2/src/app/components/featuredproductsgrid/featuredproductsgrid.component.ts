import { Component, EventEmitter, Output } from '@angular/core';
import { Product } from '../../models/product.type';
import { ProductserviceService } from '../../services/productservice.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-featuredproductsgrid',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './featuredproductsgrid.component.html',
  styleUrl: './featuredproductsgrid.component.css'
})
export class FeaturedproductsgridComponent {
  featuredProducts: Product[] = [];
  @Output() productSelected = new EventEmitter<number>();

  constructor(private productService: ProductserviceService, private router: Router, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.fetchFeaturedProducts();
  }

  fetchFeaturedProducts() {
    this.productService.getFeaturedProducts().subscribe({
      next: (products) => (this.featuredProducts = products),
      error: (error) => this.handleError('Erro ao buscar produtos em destaque:' + error)
    });
  }

  productSelection(productId: number) {
    this.router.navigate(['/productdetail', productId]);
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
