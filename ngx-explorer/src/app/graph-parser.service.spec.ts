import { TestBed } from '@angular/core/testing';

import { GraphParserService } from './graph-parser.service';

describe('GraphParserService', () => {
  let service: GraphParserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GraphParserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
