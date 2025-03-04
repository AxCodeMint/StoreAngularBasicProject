import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserserviceService } from '../../services/userservice.service';
import { CommonModule } from '@angular/common';
import { SessionserviceService } from '../../services/sessionservice.service';
import { User } from '../../models/user.type';
import { MatSnackBar } from '@angular/material/snack-bar';
import { switchMap } from 'rxjs';
import { Userinfo } from '../../models/userinfo.type';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profilepage',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profilepage.component.html',
  styleUrl: './profilepage.component.css'
})
export class ProfilepageComponent {
  userForm: FormGroup;
  passwordForm: FormGroup;
  isEditing = false;
  message: string = "";
  userLogged: User | null = null;
  userInfo: Userinfo | null = null;
  isLogged: boolean = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserserviceService,
    private sessionService: SessionserviceService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: ['', [Validators.required]],
      postalCode: ['', Validators.required],
      country: ['', Validators.required],
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/)]],
      confirmPassword: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.sessionService.isLogged$.subscribe(isLogged => {
      this.isLogged = isLogged;
    });

    this.sessionService.userInfo$.subscribe(userInfo => {
      this.userInfo = userInfo;
    });

    if (this.isLogged === false) {
      this.router.navigate(['**']);
    }

    if (this.isLogged) {
      this.userService.getUserById(this.userInfo?.id!).subscribe({
        next: (user) => {
          this.userForm.patchValue(user);
          this.userLogged = user;
        }
      });
    }
  }

  toggleEditMode() {
    this.isEditing = !this.isEditing;
  }

  saveProfile() {
    if (this.userForm.valid && this.userInfo?.id) {
      if (this.userForm.get('name')?.dirty) this.userLogged!.name = this.userForm.get('name')?.value;
      if (this.userForm.get('email')?.dirty) this.userLogged!.email = this.userForm.get('email')?.value;
      if (this.userForm.get('address')?.dirty) this.userLogged!.address = this.userForm.get('address')?.value;
      if (this.userForm.get('postalCode')?.dirty) this.userLogged!.postalCode = this.userForm.get('postalCode')?.value;
      if (this.userForm.get('country')?.dirty) this.userLogged!.country = this.userForm.get('country')?.value;

      this.userService.updateUserProfile(this.userLogged!).pipe(
        switchMap(() => {
          this.isEditing = false;
          this.displayMessage('Perfil atualizado com sucesso!');
          this.openSnackBar('Perfil atualizado com sucesso!');
          return this.sessionService.getUserInfo(true);
        })
      ).subscribe({
        next: () => {
        },
        error: () => {
          this.openSnackBar('Erro ao atualizar o perfil');
        }
      });
    }
  }

  changePassword() {
    const currentPassword = this.passwordForm.get('currentPassword')?.value;
    const newPassword = this.passwordForm.get('newPassword')?.value;
    const confirmPassword = this.passwordForm.get('confirmPassword')?.value;

    if (currentPassword !== this.userLogged!.password) {
      this.openSnackBar('A senha atual está incorreta!');
      return;
    }

    if (newPassword !== confirmPassword) {
      this.openSnackBar('As senhas não correspondem!');
      return;
    }

    if (newPassword.length < 8) {
      this.openSnackBar('O tamanho da senha é mínimo 8 caracteres.');
      return;
    }

    const updatedUser = {
      ...this.userLogged,
      password: newPassword
    };

    this.userService.updateUserProfile(updatedUser).subscribe({
      next: () => {
        this.isEditing = false;
        this.displayMessage('Senha atualizada com sucesso!');
        this.passwordForm.reset();
      },
      error: (err) => {
        this.openSnackBar('Erro ao atualizar a senha');
      }
    });
  }

  displayMessage(messageInput: string) {
    this.message = messageInput;
    setTimeout(() => (this.message = ""), 3000);
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, "OK", {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'right'
    });
  }
}