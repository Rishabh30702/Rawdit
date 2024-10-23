import { TestBed } from '@angular/core/testing';

import { TransServiceService } from './trans-service.service';

describe('TransServiceService', () => {
  let service: TransServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
