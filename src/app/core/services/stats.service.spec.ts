import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { StatsService } from './stats.service';
import { Stats } from '../models/stats.model';
import { describe, it, expect, beforeEach } from 'vitest';
import { environment } from '../../../environments/environment';

describe('StatsService', () => {
  let service: StatsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [StatsService]
    });

    service = TestBed.inject(StatsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call GET to retrieve stats', () => {
    const stats: Stats = {
      totalBooks: 10,
      reading: 2,
      activeLoans: 1,
      returnedLoansThisYear: 3,
      annualGoal: 20,
      progressPercentage: 50
    };

    service.getStats().subscribe((resp) => {
      expect(resp).toEqual(stats);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/stats/dashboard`);
    expect(req.request.method).toBe('GET');
    req.flush(stats);
  });
});

