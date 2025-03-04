import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SessionserviceService } from '../../services/sessionservice.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  @Input() showLogin: boolean = false;
  @Output() loginSuccess = new EventEmitter<boolean>();
  @Output() closeModal = new EventEmitter<void>();
  
  loginForm: FormGroup;
  
  errorMessage: string = "";
  isLogged: boolean = false;

  constructor(private fb: FormBuilder, private sessionService: SessionserviceService, private router: Router,  private snackBar: MatSnackBar) {

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.sessionService.isLogged$.subscribe(isLogged => {
      this.isLogged = isLogged;
    });
    this.router.navigate(['/']);
  }

  login(): void {
    if (this.loginForm.valid) {

      let email = this.loginForm.get('email')?.value;
      let password = this.loginForm.get('password')?.value;

      this.sessionService.login(email, password).subscribe({
        next: () => {
          this.errorMessage = "";
          this.loginSuccess.emit(true);
          this.closeModal.emit();
        },
        error: (error) => {
          this.errorMessage = 'Credenciais inválidas';
          this.loginSuccess.emit(false);
        }
      });
    } else {
      if (this.loginForm.get('email')?.hasError('required')) {
        this.errorMessage = 'O campo de email é obrigatório. ';
      }
      if (this.loginForm.get('email')?.hasError('email')) {
        this.errorMessage = 'O formato do email é incorreto. ';
      }

      if (this.loginForm.get('password')?.hasError('required')) {
        this.errorMessage = 'A senha é obrigatória. ';
      }
    }
  }
}
