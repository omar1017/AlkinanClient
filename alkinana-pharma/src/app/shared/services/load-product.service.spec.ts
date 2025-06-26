import { TestBed } from '@angular/core/testing';

import { LoadProductService } from './load-product.service';

describe('LoadProductService', () => {
  let service: LoadProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadProductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
