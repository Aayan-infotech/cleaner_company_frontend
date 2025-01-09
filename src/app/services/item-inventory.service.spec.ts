import { TestBed } from '@angular/core/testing';

import { ItemInventoryService } from './item-inventory.service';

describe('ItemInventoryService', () => {
  let service: ItemInventoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItemInventoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
