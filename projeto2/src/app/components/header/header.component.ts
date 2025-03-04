import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { SessionserviceService } from '../../services/sessionservice.service';
import { LoginComponent } from '../login/login.component';
import { ConfirmationmodalComponent } from "../confirmationmodal/confirmationmodal.component";
import { Userinfo } from '../../models/userinfo.type';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, LoginComponent, ConfirmationmodalComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  @Output() handleLoginValue = new EventEmitter<boolean>();
  @Output() handleLogoutValue = new EventEmitter<boolean>();

  showLogin: boolean = false;
  showModal: boolean = false;
  modalTitle: string = '';
  modalMessage: string = '';
  actionType: 'logout' | 'register' | 'confirmation' | 'delete' | 'other' = 'other';
  isLogged: boolean = false;
  userInfo: Userinfo | null = null;

  constructor(private sessionService: SessionserviceService, private router: Router) {}

  ngOnInit() {
    this.sessionService.isLogged$.subscribe(isLogged => {
      this.isLogged = isLogged;
    });
    this.sessionService.userInfo$.subscribe(userInfo => {
      this.userInfo = userInfo;
    });
  }

  openLoginForm(): void {
    this.showLogin = true;
  }

  onLoginSuccess(isLoggedIn: boolean): void {
    if (isLoggedIn) {
      this.isLogged = true;
    } else {
      this.isLogged = false;
    }
  }

  closeLoginForm(): void {
    this.showLogin = false;
  }

  openCart(): void {
    this.router.navigate(['/cart']);
  }

  openProfilePage(): void {
    this.router.navigate(['/profile']);
  }

  openList(): void {
    this.router.navigate(['/wishlist']);
  }

  openRegisterPage(): void {
    this.router.navigate(['/registry']);
  }

  openAdministrationPage(): void {
    this.router.navigate(['/adminpage']);
  }

  openLogoutModal(): void {
    this.modalTitle = 'Fecho de Sessão';
    this.modalMessage = 'Quer terminar a sessão?';
    this.actionType = 'logout';
    this.showModal = true;
  }

  onLogoutConfirmed(): void {
    this.sessionService.logout();
    this.isLogged = false;
    this.showModal = false;
    this.router.navigate(['/']);
  }

  onCancelAction(): void {
    this.showModal = false;
  }

  logoClick(): void {
    this.router.navigate(['/']);
  }

  goToProducts(): void {
    this.router.navigate(['/products']);
  }
}
