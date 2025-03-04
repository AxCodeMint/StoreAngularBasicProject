import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerproductsoperationsComponent } from './managerproductsoperations.component';

describe('ManagerproductsoperationsComponent', () => {
  let component: ManagerproductsoperationsComponent;
  let fixture: ComponentFixture<ManagerproductsoperationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagerproductsoperationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagerproductsoperationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
