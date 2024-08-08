import { TestBed } from '@angular/core/testing';

import { MessageServicesService } from './message-services.service';

describe('MessageServicesService', () => {
  let service: MessageServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MessageServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
