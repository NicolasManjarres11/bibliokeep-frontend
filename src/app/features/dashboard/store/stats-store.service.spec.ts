import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { StatsStoreService } from './stats-store.service';
import { StatsService } from '../../../core/services/stats.service';
import { Stats } from '../../../core/models/stats.model';
import { describe, it, expect, beforeEach, vi, type Mocked } from 'vitest';

describe('StatsStoreService', () => {
  let service: StatsStoreService;
  let statsServiceMock: Mocked<StatsService>;

  const sampleStats: Stats = {
    totalBooks: 10,
    reading: 2,
    activeLoans: 1,
    returnedLoansThisYear: 3,
    annualGoal: 20,
    progressPercentage: 50
  };

  beforeEach(() => {
    statsServiceMock = {
      getStats: vi.fn(() => of(sampleStats))
    } as unknown as Mocked<StatsService>;

    TestBed.configureTestingModule({
      providers: [{ provide: StatsService, useValue: statsServiceMock }, StatsStoreService]
    });

    service = TestBed.inject(StatsStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load stats and update state on success', () => {
    service.loadStats();

    expect(statsServiceMock.getStats).toHaveBeenCalled();
    expect(service.stats()).toEqual(sampleStats);
    expect(service.isLoading()).toBe(false);
  });

  it('should reset stats to empty on error', () => {
    statsServiceMock.getStats.mockReturnValueOnce(
      throwError(() => new Error('failed'))
    );

    service.loadStats();

    expect(service.stats()).toEqual({
      totalBooks: 0,
      reading: 0,
      activeLoans: 0,
      returnedLoansThisYear: 0,
      annualGoal: 0,
      progressPercentage: 0
    });
    expect(service.isLoading()).toBe(false);
  });
});

