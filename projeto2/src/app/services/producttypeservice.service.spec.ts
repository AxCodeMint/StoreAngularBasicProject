import { TestBed } from '@angular/core/testing';

import { ProducttypeserviceService } from './producttypeservice.service';

describe('ProducttypeserviceService', () => {
  let service: ProducttypeserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProducttypeserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
