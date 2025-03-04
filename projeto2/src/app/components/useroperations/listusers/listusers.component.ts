import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from '../../../models/user.type';
import { CommonModule } from '@angular/common';
import { ConfirmationmodalComponent } from "../../confirmationmodal/confirmationmodal.component";
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listusers',
  standalone: true,
  imports: [CommonModule, ConfirmationmodalComponent],
  templateUrl: './listusers.component.html',
  styleUrl: './listusers.component.css'
})
export class ListusersComponent {
  @Input() users: User[] = [];
  @Output() statusChange = new EventEmitter<User>();
  @Output() roleChange = new EventEmitter<User>();
  @Output() deleteUser = new EventEmitter<number>();

  showMessage: boolean = false;
  userToDeleteId!: number;
  modalTitle: string = '';
  modalMessage: string = '';
  actionType: 'logout' | 'register' | 'confirmation' | 'delete' | 'other' = 'other';
  
  constructor(private snackBar: MatSnackBar, private router: Router) { }

  onToggleStatus(user: User): void {
    user.active = !user.active;
    this.statusChange.emit(user);
  }

  onToggleRole(user: User): void {
    user.role = user.role === 'admin' ? 'user' : 'admin';
    this.roleChange.emit(user);
  }

  openDeleteConfirmationModal(id: number, event: Event) {
    event.stopPropagation();

    this.modalTitle = 'Eliminar utilizador';
    this.modalMessage = 'Deseja eliminar o utilizador selecionado?';
    this.actionType = 'delete';
    this.showMessage = true;
    this.userToDeleteId = id;
  }

  onDeleteConfirmed() {
    this.deleteUser.emit(this.userToDeleteId);
    this.showMessage = false;
    this.openSnackBar('Produto eliminado com sucesso.')
  }

  onCancelAction(): void {
    this.showMessage = false;
    this.userToDeleteId = 0;
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, "OK", {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'right'
    });
  }
}
