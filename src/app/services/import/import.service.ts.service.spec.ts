import { TestBed } from '@angular/core/testing';

import { ImportServiceTsService } from './import.service.ts.service';

describe('ImportServiceTsService', () => {
  let service: ImportServiceTsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImportServiceTsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
