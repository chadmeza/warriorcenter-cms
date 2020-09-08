import { TestBed } from '@angular/core/testing';

import { SermonsService } from './sermons.service';

describe('SermonsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SermonsService = TestBed.get(SermonsService);
    expect(service).toBeTruthy();
  });
});
