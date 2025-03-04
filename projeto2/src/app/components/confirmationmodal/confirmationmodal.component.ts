import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirmationmodal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirmationmodal.component.html',
  styleUrl: './confirmationmodal.component.css'
})
export class ConfirmationmodalComponent {
  @Input() showModal: boolean = false;
  @Input() title: string = 'Outra mensagem';
  @Input() message: string = 'Tem certeza que deseja continuar?';
  @Input()  actionType: 'logout' | 'register' | 'confirmation' | 'delete' | 'other' = 'other';
  
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm(): void {
    this.confirm.emit(); 
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
