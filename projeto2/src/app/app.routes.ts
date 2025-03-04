import { Routes } from '@angular/router';
import { HomepageComponent } from './components/homepage/homepage.component';
import { ProductspageComponent } from './components/productspage/productspage.component';
import { ProfilepageComponent } from './components/profilepage/profilepage.component';
import { ProductdetailpageComponent } from './components/productdetailpage/productdetailpage.component';
import { ErrorpageComponent } from './components/errorpage/errorpage.component';
import { ShoppingcartComponent } from './components/shoppingcart/shoppingcart.component';
import { WishlistComponent } from './components/wishlist/wishlist.component';
import { RegisteruserComponent } from './components/useroperations/registeruser/registeruser.component';
import { AdministrationpageComponent } from './components/administrationpage/administrationpage.component';

export const routes: Routes = [
    { path: '', component: HomepageComponent },
    { path: 'products', component: ProductspageComponent },
    { path: 'cart', component: ShoppingcartComponent },
    { path: 'wishlist', component: WishlistComponent },
    { path: 'profile', component: ProfilepageComponent },
    { path: 'registry', component: RegisteruserComponent },
    { path: 'adminpage', component: AdministrationpageComponent },
    { path: 'productdetail/:id', component: ProductdetailpageComponent },
    { path: '**', component: ErrorpageComponent, title: 'Page not found'  }  
];
