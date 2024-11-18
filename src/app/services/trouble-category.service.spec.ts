import { TestBed } from '@angular/core/testing';

import { TroubleCategoryService } from './trouble-category.service';

describe('TroubleCategoryService', () => {
  let service: TroubleCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TroubleCategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
