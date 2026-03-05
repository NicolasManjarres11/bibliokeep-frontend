import { TestBed } from '@angular/core/testing';

import { StorageService } from './storage.service';
import { describe, it, expect, beforeEach } from 'vitest';

// Sample JWT whose payload decodes to:
// {
//   "sub": "user@example.com",
//   "name": "John Doe",
//   "roles": ["admin","user"],
//   "iat": 1516239022,
//   "exp": 1516242622
// }
const SAMPLE_JWT =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
  'eyJzdWIiOiJ1c2VyQGV4YW1wbGUuY29tIiwibmFtZSI6IkpvaG4gRG9lIiwicm9sZXMiOlsiYWRtaW4iLCJ1c2VyIl0sImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoxNTE2MjQyNjIyfQ.' +
  'signature';

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StorageService]
    });

    service = TestBed.inject(StorageService);
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set, get and remove token', () => {
    service.setToken('abc');
    expect(service.getToken()).toBe('abc');

    service.removeToken();
    expect(service.getToken()).toBeNull();
  });

  it('should report authentication state based on token existence', () => {
    expect(service.isAuthenticated()).toBe(false);
    service.setToken('abc');
    expect(service.isAuthenticated()).toBe(true);
  });

  it('should return email from decoded token', () => {
    service.setToken(SAMPLE_JWT);
    const email = service.getEmail();

    expect(email).toBe('user@example.com');
  });

  it('should check role from decoded token', () => {
    service.setToken(SAMPLE_JWT);
    const hasRole = service.hasRole('admin');

    expect(hasRole).toBe(true);
  });
});

