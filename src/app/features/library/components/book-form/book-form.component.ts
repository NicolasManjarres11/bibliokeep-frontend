import { Component, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { BookStatus } from '../../../../core/models/book.model';

export interface BookFormValue {
  isbn: string;
  title: string;
  authors: string;
  description: string;
  thumbnail: File | null;
  status: BookStatus;
  rating: number;
  isLent: boolean;
}

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './book-form.component.html'
})
export class BookFormComponent {
  private readonly fb = inject(FormBuilder);

  readonly loading = input(false);
  readonly serverError = input<string | null>(null);

  readonly submitBook = output<BookFormValue>();
  readonly cancel = output<void>();

  protected readonly form = this.buildForm();

  protected readonly statuses: { value: BookStatus; label: string }[] = [
    { value: 'DESEADO', label: 'Deseado' },
    { value: 'COMPRADO', label: 'Comprado' },
    { value: 'LEYENDO', label: 'Leyendo' },
    { value: 'LEIDO', label: 'Leído' },
    { value: 'ABANDONADO', label: 'Abandonado' }
  ];

  protected get f() {
    return this.form.controls;
  }

  protected onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    const value: BookFormValue = this.form.getRawValue();
    this.submitBook.emit(value);
  }

  protected onCancel(): void {
    this.cancel.emit();
  }

  private buildForm() {
    return this.fb.nonNullable.group({
      isbn: this.fb.nonNullable.control('', {
        validators: [Validators.required, Validators.pattern(/^[0-9\-]{10,17}$/)]
      }),
      title: this.fb.nonNullable.control('', {
        validators: [Validators.required, Validators.minLength(3), Validators.maxLength(200)]
      }),
      authors: this.fb.nonNullable.control('', {
        validators: [Validators.required, Validators.minLength(3), Validators.maxLength(200)]
      }),
      description: this.fb.nonNullable.control('', {
        validators: [Validators.required, Validators.maxLength(1000)]
      }),
      thumbnail: 
      [
        null as File | null, [
          Validators.required
        ]
      ]
      
      
      /* this.fb.nonNullable.control('', {
        validators: [
          Validators.maxLength(500),
          // Permite vacío o una ruta/nombre de archivo de imagen (opcional)
          Validators.pattern(/^$|^.*\.(jpe?g|png|gif|webp|bmp)$/i)
        ]
      }) */,
      status: this.fb.nonNullable.control<BookStatus>('DESEADO', {
        validators: [Validators.required]
      }),
      rating: this.fb.nonNullable.control(3, {
        validators: [Validators.min(1), Validators.max(5)]
      }),
      isLent: this.fb.nonNullable.control(false)
    });
  }
}

