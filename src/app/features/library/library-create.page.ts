import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { BookFormComponent, BookFormValue } from './components/book-form/book-form.component';
import { BookRequestDTO, BookService } from '../../core/services/book.service';
import { BookStatus } from '../../core/models/book.model';
import { AuthService } from '../../core/services/auth.service';
import { StorageService } from '../../core/services/storage.service';
import { jwtDecode } from "jwt-decode";
import { TokenInformacion } from '../../core/models/auth-response.model';
import { finalize } from 'rxjs';
import { FileService } from '../../shared/services/file.service';


@Component({
  selector: 'app-library-create-page',
  standalone: true,
  imports: [BookFormComponent],
  templateUrl: './library-create.page.html'
})
export class LibraryCreatePage {

  private readonly router = inject(Router);
  protected readonly  auth = inject(AuthService);
  private readonly fileService = inject(FileService);

  protected readonly isSubmitting = signal(false);
  protected readonly submitError = signal<string | null>(null);

  constructor(private readonly bookApi: BookService, private readonly currentToken: StorageService){};



  protected async onSubmit(value: BookFormValue) {
    // TODO: conectar con BookService.createBook cuando esté disponible.
    // Por ahora simplemente volvemos al listado tras enviar el formulario.

    const token = this.currentToken.getToken();
    if(!token){
      this.router.navigateByUrl('/login')
      return;
    }

    const info = jwtDecode<TokenInformacion>(token);


    //1. enviar a guardar la imagen

    const blob = await this.fileService.compressImage(value.thumbnail!);

    this.fileService.upload(blob ).subscribe({
      next: (data) => {

        const authorsArray =
    value.authors
      ?.split(',')
      .map((a) => a.trim())
      .filter((a) => !!a) ?? [];



    const dto: BookRequestDTO = {

      ownerId: info['user-id'],
      isbn: value.isbn ?? '',
      title: value.title ?? '',
      authors: authorsArray,
      description: value.description ?? '',
      thumbnail: data.url ?? '',
      status: (value.status ?? 'DESEADO') as BookStatus,
      rating: value.rating ?? null,
      isLent: value.isLent ?? false
      
    }

    this.isSubmitting.set(true);

    this.bookApi.createBook(dto)
      .pipe(
        finalize(() => this.isSubmitting.set(false))
      )
      .subscribe({
        next: () => {
          this.router.navigateByUrl('/library');
        },
        error: (error) => {
          console.error('Error al crear el libro', error);
        }
      });;




    console.log('Nuevo libro enviado', value);
    this.router.navigate(['/library']);

      },
      error: (error) => {}
    });
    //2. cargada la imagen, cargo la url en el thumbnail


    
  }

  protected onCancel(): void {
    this.router.navigate(['/library']);
  }

/*   private resolveOwnerId(): string | null {
    const token = this.token.getToken();
    if (!token) return null;
    try {
      const info = jwtDecode<TokenInformacion>(token);
      return info['user-id'] ?? null;
    } catch {
      return null;
    }
  } */
}

