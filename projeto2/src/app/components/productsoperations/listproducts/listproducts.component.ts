import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '../../../models/product.type';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { ProductserviceService } from '../../../services/productservice.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationmodalComponent } from "../../confirmationmodal/confirmationmodal.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-listproducts',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatIconModule, MatButtonModule, MatPaginatorModule, ConfirmationmodalComponent],
  templateUrl: './listproducts.component.html',
  styleUrl: './listproducts.component.css'
})
export class ListproductsComponent {
  @Input() productsList!: Product[];
  @Output() handlerDeleteProduct = new EventEmitter<number>();
  @Output() handlerShowInfo = new EventEmitter<number>();

  showMessage: boolean = false;
  productToDeleteId!: number;
  modalTitle: string = '';
  modalMessage: string = '';
  actionType: 'logout' | 'register' | 'confirmation' | 'delete' | 'other' = 'other';

  displayedColumns: string[] = ['mainImage', 'title', 'brand', 'type', 'color', 'price', 'description', 'featured', 'actions'];

  constructor(private productsservice: ProductserviceService, private snackBar: MatSnackBar, private router: Router) { }

  deleteProduct(id: number, event: Event) {
    event.stopPropagation();
    this.handlerDeleteProduct.emit(id);
  }

  showProductInfo(id: number) {
    this.handlerShowInfo.emit(id);
  }

  toggleFeatured(product: Product) {

    if (!product.featured && this.productsList.filter(x => x.featured).length === 8) {
      this.openSnackBar("Não pode adicionar mais featured products")
      return;
    }


    this.productsservice.updateFeatured(product.id, !product.featured).subscribe({
      next: (products) => {
        this.productsList = products;
      },
      error: () => this.openSnackBar('Erro ao atualizar destaque')
    });
  }

  openDeleteConfirmationModal(id: number, event: Event) {
    event.stopPropagation();

    this.modalTitle = 'Eliminar produto';
    this.modalMessage = 'Deseja eliminar o produto selecionado?';
    this.actionType = 'delete';
    this.showMessage = true;
    this.productToDeleteId = id;
  }

  onDeleteConfirmed() {
    this.handlerDeleteProduct.emit(this.productToDeleteId);
    this.showMessage = false;
    this.openSnackBar('Produto eliminado com sucesso.')
  }

  onCancelAction(): void {
    this.showMessage = false;
    this.productToDeleteId = 0;
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, "OK", {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'right'
    });
  }
}

