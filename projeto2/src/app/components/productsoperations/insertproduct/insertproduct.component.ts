import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Product } from '../../../models/product.type';
import { ProducttypeserviceService } from '../../../services/producttypeservice.service';
import { ProductType } from '../../../models/productType.type';
import { ConfirmationmodalComponent } from "../../confirmationmodal/confirmationmodal.component";
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-insertproduct',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule, ConfirmationmodalComponent],
  templateUrl: './insertproduct.component.html',
  styleUrl: './insertproduct.component.css'
})
export class InsertproductComponent {
  @Output() newProduct = new EventEmitter<Product>();
  @Input() productsList!: Product[];

  productForm: FormGroup;

  productTypes: ProductType[] = [];
  showSuccessMessage: boolean = false;
  dropdownOpen: boolean = false;
  modalTitle: string = '';
  modalMessage: string = '';
  actionType: 'logout' | 'register' | 'confirmation' | 'delete' | 'other' = 'other';

  constructor(private fb: FormBuilder, private snackBar: MatSnackBar, private productTypeService: ProducttypeserviceService) {

    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
      brand: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
      type: ['', [Validators.required]],
      color: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
      price: [null, [Validators.required, Validators.min(1), Validators.max(99999)]],
      description: ['', [Validators.required]],
      mainImage: ['', [Validators.required]],
      secondaryImage: ['', [Validators.required]],
      featured: [false, [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadProductTypes();
  }

  loadProductTypes(): void {
    this.productTypeService.getAll().subscribe({
      next: (types) => {
        this.productTypes = types;
      },
      error: (error) => {
        this.handleError('Erro ao carregar tipos de produto' + error);
      }
    });
  }

  insertProduct(): void {
    if (this.productForm.invalid) {
      this.openSnackBar("Formulário é inválido");
      return;
    }
    this.newProduct.emit(this.productForm.value);
    this.productForm.reset();
    this.openInsertConfirmationModal();
  }

  openInsertConfirmationModal() {
    this.modalTitle = 'Confirmação';
    this.modalMessage = 'Produto inserido com sucesso! Deseja continuar?';
    this.actionType = 'confirmation';
    this.showSuccessMessage = true;
  }

  onMessageConfirmed(): void {
    this.showSuccessMessage = false;
  }

  onCancelAction(): void {
    this.showSuccessMessage = false;
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