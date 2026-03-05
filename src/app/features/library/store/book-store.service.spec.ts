import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { BookStoreService } from './book-store.service';
import { BookService, type BookRequestDTO } from '../../../core/services/book.service';
import { Book } from '../../../core/models/book.model';
import { describe, it, expect, beforeEach, vi, type Mocked } from 'vitest';

describe('BookStoreService', () => {
  let service: BookStoreService;
  let bookServiceMock: Mocked<BookService>;

  const sampleBook: Book = {
    id: 1,
    ownerId: "968813af-11aa-4434-9d78-bb30b756fe7d",
    isbn: "1234567890",
    title: 'Sample',
    authors: ['Author'],
    description: "descripción",
    thumbnail: "http://url.com",
    status: 'DESEADO',
    rating: 3,
    isLent: false
  };

  beforeEach(() => {
    bookServiceMock = {
      getAllBooks: vi.fn(() => of([sampleBook])),
      searchBooks: vi.fn(() => of([sampleBook])),
      updateBook: vi.fn((id: number, dto: BookRequestDTO) => of({ ...(dto as Book), id }))
    } as unknown as Mocked<BookService>;

    TestBed.configureTestingModule({
      providers: [{ provide: BookService, useValue: bookServiceMock }, BookStoreService]
    });

    service = TestBed.inject(BookStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load collection and update books and loading state', () => {
    service.loadCollection();

    expect(bookServiceMock.getAllBooks).toHaveBeenCalled();
    expect(service.books().length).toBe(1);
    expect(service.isLoading()).toBe(false);
  });

  it('should search books when query is not empty', () => {
    service.search('Angular');

    expect(bookServiceMock.searchBooks).toHaveBeenCalledWith('Angular');
  });

  it('should ignore search when query is empty or whitespace', () => {
    service.search('   ');
    expect(bookServiceMock.searchBooks).not.toHaveBeenCalled();
  });

  it('should update status optimistically and rollback on error', () => {
    service.books.set([sampleBook]);

    bookServiceMock.updateBook.mockReturnValueOnce(
      throwError(() => new Error('update failed'))
    );

    service.updateStatusOptimistic(1, 'COMPRADO');

    expect(service.books()[0].status).toBe('DESEADO');
  });

  it('should clamp rating between 1 and 5 when updating optimistically', () => {
    service.books.set([sampleBook]);

    service.updateRatingOptimistic(1, 10);

    expect(service.books()[0].rating).toBe(5);
  });
});

