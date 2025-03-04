import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeaturedproductsgridComponent } from './featuredproductsgrid.component';

describe('FeaturedproductsgridComponent', () => {
  let component: FeaturedproductsgridComponent;
  let fixture: ComponentFixture<FeaturedproductsgridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeaturedproductsgridComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeaturedproductsgridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
