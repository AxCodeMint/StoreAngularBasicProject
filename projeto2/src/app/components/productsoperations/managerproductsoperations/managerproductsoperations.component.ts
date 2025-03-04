import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../../../models/product.type';
import { ProductserviceService } from '../../../services/productservice.service';
import { InsertproductComponent } from '../insertproduct/insertproduct.component';
import { SearchproductComponent } from '../searchproduct/searchproduct.component';
import { ListproductsComponent } from '../listproducts/listproducts.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-managerproductsoperations',
  standalone: true,
  imports: [InsertproductComponent, SearchproductComponent, ListproductsComponent],
  templateUrl: './managerproductsoperations.component.html',
  styleUrl: './managerproductsoperations.component.css'
})
export class ManagerproductsoperationsComponent {
  productsList!: Product[];

  constructor(private productsservice: ProductserviceService, private router: Router, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.loadAllProducts();
  }

  loadAllProducts() {
    this.productsservice.getAll().subscribe({
      next: (products) => {
        this.productsList = products;
      },
      error: (error) => {
          this.handleError('Erro ao carregar produtos: ' + error)}
    });
  }

  insertNewProduct(newProduct: Product) {
    this.productsservice.insertProduct(newProduct).subscribe({
      next: products => {
      this.productsList=products;
      this.openSnackBar('Produto inserido com sucesso!');
    },
    error: () =>   this.openSnackBar('Erro ao inserir produto')
  });
  }

  searchProducts(searchValue: string) {
    this.productsservice.searchProducts(searchValue).subscribe({
      next: (products) => {
        this.productsList = products;
      },
      error: () => this.openSnackBar('Erro na pesquisa')
    });
  }

  deleteProduct(id: number) {
    this.productsservice.deleteProduct(id).subscribe({
      next: (products) => {
        this.productsList = products;
        this.openSnackBar('Produto excluído com sucesso!');
      },
      error: () => this.openSnackBar('Erro ao excluir produto')
    });
  }

  showInfo(id: number) {
    this.router.navigate(['products', id]);
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