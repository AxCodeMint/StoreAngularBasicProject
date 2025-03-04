import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { UserserviceService } from '../../../services/userservice.service';
import { Router } from '@angular/router';
import { ConfirmationmodalComponent } from "../../confirmationmodal/confirmationmodal.component";
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { User } from '../../../models/user.type';
import { SessionserviceService } from '../../../services/sessionservice.service';
import { Userinfo } from '../../../models/userinfo.type';

@Component({
  selector: 'app-registeruser',
  standalone: true,
  imports: [ConfirmationmodalComponent, CommonModule, ReactiveFormsModule, MatSnackBarModule],
  templateUrl: './registeruser.component.html',
  styleUrl: './registeruser.component.css'
})
export class RegisteruserComponent {
  @Output() handleLoginValue = new EventEmitter<boolean>();
  @Output() handleLogoutValue = new EventEmitter<boolean>();

   registerForm: FormGroup;
   
   showModal: boolean = false;
  modalTitle: string = '';
  modalMessage: string = '';
  actionType: 'logout' | 'register' | 'confirmation' = 'confirmation';
  emailExists: boolean = false;
  isLogged: boolean = false;
  userInfo: Userinfo | null = null;

  constructor(
    private userService: UserserviceService,
    private router: Router,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private sessionService: SessionserviceService
  ) {

    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/)]],
      address: ['', [Validators.required]],
      postalCode: ['', [Validators.required]],
      country: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.sessionService.isLogged$.subscribe(isLogged => {
      this.isLogged = isLogged;
    });

    this.sessionService.userInfo$.subscribe(userInfo => {
      this.userInfo = userInfo;
    });

    if (this.isLogged === true && this.userInfo?.role === 'admin') {
      this.router.navigate(['adminpage']);
    } else if (this.isLogged === false ) {
      this.router.navigate(['registry']);
    }else {
      this.router.navigate(['**']);
    }

  }

  validateEmailExists(email: string): void {
    this.userService.searchUsersEmail(email).subscribe({
      next: (users) => {
        if (users.length > 0) {
          this.emailExists = true;
          this.openSnackBar("Este email já está registado.");
        } else {
          this.emailExists = false;
          this.openRegisterModal();
        }
      },
      error: () => {
        this.openSnackBar("Erro ao verificar email, tente novamente.");
      }
    });
  }

  cancelAction(): void {
    this.showModal = false;
  }

  openRegisterModal(): void {
    this.modalTitle = 'Confirmação de registo';
    this.modalMessage = 'Deseja proceder ao registo?';
    this.actionType = 'register';
    this.showModal = true;
  }

  onRegisterConfirmed(): void {
    if (this.registerForm.valid) {
      let userData = {
        ...this.registerForm.value,
        role: 'user',
        active: true
      };

      this.userService.insertUser(userData).subscribe({
        next: () => {
          this.showModal = false;
          this.router.navigate(['/']);
          this.openSnackBar("Registo realizado com sucesso!");
        },
        error: (err) => {
          this.showModal = false;
          this.openSnackBar("Erro ao registar. Tente novamente.");
        }
      });
    }
  }

  submitForm(): void {
    if (this.registerForm.valid) {
      this.validateEmailExists(this.registerForm.get('email')?.value);
    } else {
      this.openSnackBar("Por favor, corrija os erros no formulário");
    }
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, "OK", {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'right'
    });
  }
}