import { Component } from '@angular/core';
import { User } from '../../../models/user.type';
import { UserserviceService } from '../../../services/userservice.service';
import { ListusersComponent } from '../listusers/listusers.component';
import { RegisteruserComponent } from '../registeruser/registeruser.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-manageruseroperations',
  standalone: true,
  imports: [ListusersComponent, RegisteruserComponent],
  templateUrl: './manageruseroperations.component.html',
  styleUrl: './manageruseroperations.component.css'
})
export class ManageruseroperationsComponent {
  usersList: User[] = [];

  constructor(private userService: UserserviceService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAll().subscribe((users) => {
      this.usersList = users;
    });
  }

  updateUserStatus(user: User): void {
    const updatedUser: Partial<User> = {
      ...user,
      active: user.active
    };

    this.userService.updateUserProfile(updatedUser).subscribe({
      next: () => {
        this.openSnackBar(`Estado do utilizador ${user.name} atualizado`);
        this.loadUsers();
      },
      error: () => {
        this.openSnackBar('Erro ao atualizar estado do utilizador');
      }
    });
  }

  updateUserRole(user: User): void {
    const updatedUser: Partial<User> = {
      ...user,
      role: user.role
    };

    this.userService.updateUserProfile(updatedUser).subscribe({
      next: () => {
        this.openSnackBar(`Tipo do utilizador ${user.name} alterado`);
        this.loadUsers();
      },
      error: () => {
        this.openSnackBar('Erro ao atualizar tipo de utilizador');
      }
    });
  }

  deleteUser(userId: number): void {
    this.userService.deleteUser(userId).subscribe({
      next: () => {
        this.openSnackBar(`Utilizador eliminado com sucesso`);
        this.loadUsers();
      },
      error: () => {
        this.openSnackBar('Erro ao eliminar utilizador');
      }
    });
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, "OK", {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'right'
    });
  }
}
