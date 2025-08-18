import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { defaultRedirectGuard } from './default-redirect.guard';

describe('defaultRedirectGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => defaultRedirectGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
