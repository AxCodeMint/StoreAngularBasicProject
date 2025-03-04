import { Component } from '@angular/core';
import { ManagerproductsoperationsComponent } from "../productsoperations/managerproductsoperations/managerproductsoperations.component";
import { ManageruseroperationsComponent } from '../useroperations/manageruseroperations/manageruseroperations.component';
import { Userinfo } from '../../models/userinfo.type';
import { SessionserviceService } from '../../services/sessionservice.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-administrationpage',
  standalone: true,
  imports: [ManagerproductsoperationsComponent, ManageruseroperationsComponent],
  templateUrl: './administrationpage.component.html',
  styleUrl: './administrationpage.component.css'
})
export class AdministrationpageComponent {
  isLogged: boolean = false;
  userInfo: Userinfo | null = null;

  constructor(private sessionService: SessionserviceService, private router: Router) {
  }

  ngOnInit() {
    this.sessionService.isLogged$.subscribe(isLogged => {
      this.isLogged = isLogged;
    });

    this.sessionService.userInfo$.subscribe(userInfo => {
      this.userInfo = userInfo;
    });

    if (this.isLogged === false || this.userInfo?.role != 'admin') {
      this.router.navigate(['**']);
    }
  }
}
