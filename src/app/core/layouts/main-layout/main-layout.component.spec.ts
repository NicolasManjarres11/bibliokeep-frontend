import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { MainLayoutComponent } from './main-layout.component';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';
import { describe, it, expect, beforeEach, vi, type Mocked } from 'vitest';

describe('MainLayoutComponent', () => {
  let component: MainLayoutComponent;
  let fixture: any;

  let authMock: Mocked<AuthService>;
  let storageMock: Mocked<StorageService>;
  let router: Router;

  beforeEach(async () => {
    authMock = {
      logout: vi.fn()
    } as unknown as Mocked<AuthService>;

    storageMock = {
      getEmail: vi.fn(() => 'test@example.com'),
      hasRole: vi.fn(() => true)
    } as unknown as Mocked<StorageService>;

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, MainLayoutComponent],
      providers: [
        { provide: AuthService, useValue: authMock },
        { provide: StorageService, useValue: storageMock }
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigateByUrl');

    fixture = TestBed.createComponent(MainLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should logout and navigate to login', () => {
    (component as any).logout();

    expect(authMock.logout).toHaveBeenCalled();
    expect((router.navigateByUrl as any)).toHaveBeenCalledWith('/login');
  });

  it('should return true from verifyRoles when no roles are provided', () => {
    const result = (component as any).verifyRoles(undefined);
    expect(result).toBe(true);
  });

  it('should delegate verifyRoles to storage service', () => {
    storageMock.hasRole.mockReturnValueOnce(true);

    const result = (component as any).verifyRoles(['ROLE_ADMIN']);

    expect(storageMock.hasRole).toHaveBeenCalledWith('ROLE_ADMIN');
    expect(result).toBe(true);
  });
});

