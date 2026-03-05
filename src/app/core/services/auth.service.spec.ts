import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { AuthService } from './auth.service';
import { StorageService } from './storage.service';
import { LoginCredentials } from '../models/login-credentials.model';
import { AuthResponse } from '../models/auth-response.model';
import { describe, it, expect, beforeEach, vi, type Mocked } from 'vitest';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let storageMock: Mocked<StorageService>;

  beforeEach(() => {
    storageMock = {
      setToken: vi.fn(),
      removeToken: vi.fn()
    } as unknown as Mocked<StorageService>;

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: StorageService, useValue: storageMock }
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login and store token', () => {
    const credentials: LoginCredentials = { email: 'user@example.com', password: 'secret' };
    const response: AuthResponse = {
      access_token: 'token',
      type: 'jwt'
    };

    service.login(credentials).subscribe((resp) => {
      expect(resp).toEqual(response);
      expect(storageMock.setToken).toHaveBeenCalledWith('token');
    });

    const req = httpMock.expectOne('http://localhost:8080/auth/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(credentials);
    req.flush(response);
  });

  it('should logout clearing token and current user', () => {
    service.currentUser.set({ id: 1, email: 'user@example.com' } as any);

    service.logout();

    expect(storageMock.removeToken).toHaveBeenCalled();
    expect(service.currentUser()).toBeNull();
  });
});

