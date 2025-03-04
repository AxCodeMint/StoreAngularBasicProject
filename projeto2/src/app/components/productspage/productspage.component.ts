import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../../models/product.type';
import { ProductserviceService } from '../../services/productservice.service';
import { CartserviceService } from '../../services/cartservice.service';
import { CommonModule } from '@angular/common';
import { SessionserviceService } from '../../services/sessionservice.service';
import { WishlistserviceService } from '../../services/wishlistservice.service';
import { UserWishlist } from '../../models/userwishlist.type';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Userinfo } from '../../models/userinfo.type';

@Component({
  selector: 'app-productspage',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './productspage.component.html',
  styleUrl: './productspage.component.css'
})
export class ProductspageComponent {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  paginatedProducts: Product[] = [];
  selectedType: string = 'Todos';
  selectedColor: string = 'Todos';
  types: string[] = [];
  colors: string[] = [];
  pageSize : number = 6;
  currentPage : number = 0;
  isLogged = true;
  message: string = "";
  originalImage: string = "";
  wishlistItems: UserWishlist = { id: 0, userId: 0, products: [] };
  userInfo: Userinfo | null = null;

  constructor(
    private productService: ProductserviceService,
    private router: Router,
    private cartService: CartserviceService,
    private sessionService: SessionserviceService,
    private wishlistservice: WishlistserviceService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.sessionService.isLogged$.subscribe(isLogged => {
      this.isLogged = isLogged; 
    });   

    this.sessionService.userInfo$.subscribe(userInfo => {
      this.userInfo = userInfo;
    });

    this.getListFromService(Number(this.userInfo?.id));
    this.loadProducts();
  }

  getListFromService(userId: number) {
    this.wishlistservice.getListItemsByUserId(userId).subscribe({
      next: list => {
        this.wishlistItems = list || { id: 0, userId: userId, products: [] };
      },
      error: () => {
        this.wishlistItems = { id: 0, userId: userId, products: [] };
      }
    });
  }

  loadProducts() {
    this.productService.getAll().subscribe(products => {
      this.products = products;
      this.filteredProducts = products;
      this.extractFilters(products);
      this.paginateProducts();
    });
  }

  extractFilters(products: Product[]) {
    const uniqueTypes = new Set<string>();
    const uniqueColors = new Set<string>();

    products.forEach(product => {
      uniqueTypes.add(product.type);
      uniqueColors.add(product.color);
    });

    this.types = Array.from(uniqueTypes).sort();
    this.colors = Array.from(uniqueColors).sort();
  }

  applyTypeFilter(type: string) {
    this.selectedType = type;
    this.filterProducts();
  }

  applyColorFilter(color: string) {
    this.selectedColor = color;
    this.filterProducts();
  }

  filterProducts() {
    this.filteredProducts = this.products.filter(product => {
      const matchesType = this.selectedType === 'Todos' || product.type === this.selectedType;
      const matchesColor = this.selectedColor === 'Todos' || product.color === this.selectedColor;
      return matchesType && matchesColor;
    });
    this.currentPage = 0;
    this.paginateProducts();
  }

  paginateProducts() {
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedProducts = this.filteredProducts.slice(0, end);
  }

  loadMore() {
    this.currentPage++;
    this.paginateProducts();
  }

  showSecondaryImage(product: Product): void {
    this.originalImage = product.mainImage;
    product.mainImage = `${product.secondaryImage}`;
  }

  showMainImage(product: Product): void {
    product.mainImage = this.originalImage;
  }

  goToProductDetails(product: Product) {
    this.router.navigate(['/productdetail', product.id]);
  }

  addToCart(product: Product) {
    if (this.isLogged == false) {
      this.openSnackBar('Utilizador não está logado.');
      return;
    }

    this.cartService.addToCart(this.userInfo?.id!, product).subscribe({
      next: () => {
        this.openSnackBar(`${product.name} adicionado ao carrinho!`);
        setTimeout(() => this.message = "", 3000);
      },
      error: (error) => {
        this.openSnackBar('Erro ao adicionar ao carrinho');
      },
      complete: () => {
        this.openSnackBar('Produto adicionado ao carrinho');
      }
    });
  }

  addOrRemoveFromList(product: Product, event: Event) {
    event.preventDefault();
    if (this.isLogged == false) {
      return;
    }

    const productExists = this.wishlistItems.products.some(item => item.id === product.id);

    if (productExists) {
      this.wishlistservice.removeFromList(this.userInfo?.id!, product.id).subscribe({
        next: () => {
          const indexToRemove = this.wishlistItems.products.findIndex(item => item.id === product.id);
          if (indexToRemove !== -1) {
            this.wishlistItems.products.splice(indexToRemove, 1);
          }
          this.openSnackBar(`${product.name} removido da wishlist!`);
        },
        error: (erro) => {
          this.handleError("Erro ao remover da lista: " + erro);
        }
      });
    } else {
      this.wishlistservice.addToList(this.userInfo?.id!, product).subscribe({
        next: () => {
          this.wishlistItems.products.push(product);
          this.openSnackBar(`${product.name} adicionado à wishlist!`);
        },
        error: (erro) => {
          this.handleError("Erro ao adicionar à lista: " + erro);
        }
      });
    }
  }

  isInWishlist(product: Product): boolean {
    return this.wishlistItems.products.find(x => x.id === product.id) != null ? true : false;
  }

  get hasMoreProducts() {
    return this.paginatedProducts.length < this.filteredProducts.length;
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, "OK", {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'right'
    });
  }  
  
  handleError(error: any) {
    // idealmente não queremos mostrar o erro original ao utilizador, mas sim uma mensagem genérica: ou mostra-se na snackbar ou redireciona-se para uma página de erro genérica
    this.openSnackBar('Ocorreu um erro!');
  }
}