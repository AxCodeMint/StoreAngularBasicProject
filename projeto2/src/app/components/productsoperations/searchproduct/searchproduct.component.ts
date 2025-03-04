import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-searchproduct',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './searchproduct.component.html',
  styleUrl: './searchproduct.component.css'
})
export class SearchproductComponent {
  @Output() handleSearchValue = new EventEmitter<string>();

  searchValue : string = "";

  searchProduct() {
    this.handleSearchValue.emit(this.searchValue);
  }

  clearSearch() {
    this.searchValue="";
    this.searchProduct();
  }
}
