import { Component } from '@angular/core';
import { CarouselComponent } from "../carousel/carousel.component";
import { FeaturedproductsgridComponent } from "../featuredproductsgrid/featuredproductsgrid.component";

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [CarouselComponent, FeaturedproductsgridComponent],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent {

}
