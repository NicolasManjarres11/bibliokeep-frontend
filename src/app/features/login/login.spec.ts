import { TestBed } from '@angular/core/testing';
import { Login } from './login';
import { Router } from '@angular/router';
import { of, throwError, Subject } from 'rxjs';

describe('Login', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Login],
    }).compileComponents();
  });

  it('Should create the login component', () => {
    const fixture = TestBed.createComponent(Login);
    const login = fixture.componentInstance;
    expect(login).toBeTruthy();
  });

  it('Should show login form', () => {
    const fixture = TestBed.createComponent(Login);
    fixture.whenStable();

    const login = fixture.componentInstance;
    const compiled = fixture.nativeElement as HTMLElement;

    const inputs = compiled.getElementsByTagName('input');

    expect(inputs.length).toBe(2);
  });

  it('should redirect to /dashboard if the user is already logged in', () => {
    const fixture = TestBed.createComponent(Login);
    const component = fixture.componentInstance;

    const storage = (component as any).storage;
    vi.spyOn(storage, 'isAuthenticated').mockReturnValue(true);

    const router = TestBed.inject(Router);
    const dashboardSpy = vi.spyOn(router, 'navigateByUrl');

    component.ngOnInit();

    expect(storage.isAuthenticated).toHaveBeenCalled();
    expect(dashboardSpy).toHaveBeenCalledWith('/dashboard');
  });

  it('should mark form as touched and not submit when form is invalid', () => {
    const fixture = TestBed.createComponent(Login);
    const component = fixture.componentInstance;

    const authService = (component as any).auth;
    const loginSpy = vi.spyOn(authService, 'login');
    const markAllAsTouchedSpy = vi.spyOn(component.form, 'markAllAsTouched');

    // The form is empty by default, so it's invalid
    component.onSubmit();

    expect(component.form.invalid).toBe(true);
    expect(markAllAsTouchedSpy).toHaveBeenCalled();
    expect(loginSpy).not.toHaveBeenCalled();
  });

  it('should call login and navigate to dashboard when form is valid', () => {
    const fixture = TestBed.createComponent(Login);
    const component = fixture.componentInstance;

    const authService = (component as any).auth;
    const loginSpy = vi.spyOn(authService, 'login').mockReturnValue(of({}));
    const router = TestBed.inject(Router);
    const dashboardSpy = vi.spyOn(router, 'navigateByUrl');

    component.form.patchValue({
      email: 'test@example.com',
      password: 'password123',
    });

    component.onSubmit();

    expect(component.form.valid).toBe(true);
    expect(loginSpy).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password123' });
    expect(dashboardSpy).toHaveBeenCalledWith('/dashboard');
    expect(component.submitting()).toBe(false);
    expect(component.errorMessage()).toBeNull();
  });

  it('should execute onSubmit on form submit and validate button message state during submission', () => {
    const fixture = TestBed.createComponent(Login);
    const component = fixture.componentInstance;
    const authService = (component as any).auth;

    const loginSubject = new Subject<any>();
    vi.spyOn(authService, 'login').mockReturnValue(loginSubject.asObservable());

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const formElement = compiled.querySelector('form');
    const submitButton = compiled.querySelector('button[type="submit"]') as HTMLButtonElement;

    const onSubmitSpy = vi.spyOn(component, 'onSubmit');

    // Initial button text
    expect(submitButton.textContent?.trim()).toBe('Ingresar');

    // Make form valid safely
    component.form.patchValue({
      email: 'test@example.com',
      password: 'password123',
    });
    fixture.detectChanges();

    // Trigger submit via form event
    formElement?.dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    expect(onSubmitSpy).toHaveBeenCalled();

    // Button text while submitting
    expect(submitButton.textContent?.trim()).toBe('Ingresando...');
    expect(submitButton.disabled).toBe(true);

    // Complete the submission
    loginSubject.next({});
    loginSubject.complete();
    fixture.detectChanges();

    // Button text after submission complete
    expect(submitButton.textContent?.trim()).toBe('Ingresar');
  });

  it('should handle login error when form is valid and show error message in template', () => {
    const fixture = TestBed.createComponent(Login);
    const component = fixture.componentInstance;

    const authService = (component as any).auth;
    const errorResponse = { error: { message: 'Credenciales inválidas' } };
    const loginSpy = vi
      .spyOn(authService, 'login')
      .mockReturnValue(throwError(() => errorResponse));
    const router = TestBed.inject(Router);
    const dashboardSpy = vi.spyOn(router, 'navigateByUrl');

    component.form.patchValue({
      email: 'test@example.com',
      password: 'password123',
    });

    component.onSubmit();
    fixture.detectChanges();

    expect(component.form.valid).toBe(true);
    expect(loginSpy).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password123' });
    expect(dashboardSpy).not.toHaveBeenCalled();
    expect(component.submitting()).toBe(false);
    expect(component.errorMessage()).toBe('Credenciales inválidas');

    const compiled = fixture.nativeElement as HTMLElement;
    const errorMessageDiv = compiled.querySelector('.text-red-600');
    expect(errorMessageDiv).toBeTruthy();
    expect(errorMessageDiv?.textContent?.trim()).toBe('Credenciales inválidas');
  });
});
