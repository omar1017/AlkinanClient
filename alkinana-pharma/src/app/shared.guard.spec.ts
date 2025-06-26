import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { sharedGuard } from './shared.guard';

describe('sharedGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => sharedGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
