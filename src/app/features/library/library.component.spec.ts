import { TestBed } from '@angular/core/testing';

import { LibraryComponent } from './library.component';
import { BookStoreService } from './store/book-store.service';
import { BookService, type BookRequestDTO } from '../../core/services/book.service';
import { Book, BookStatus } from '../../core/models/book.model';
import { of } from 'rxjs';
import { describe, it, expect, beforeEach, vi, type Mocked } from 'vitest';

describe('LibraryComponent', () => {
  let component: LibraryComponent;
  let store: BookStoreService;
  let fixture: any;

  let bookServiceMock: Mocked<BookService>;

  beforeEach(async () => {
    bookServiceMock = {
      getAllBooks: vi.fn(() => of([] as Book[])),
      searchBooks: vi.fn(() => of([] as Book[])),
      updateBook: vi.fn((id: number, dto: BookRequestDTO) => of({ ...(dto as Book), id }))
    } as unknown as Mocked<BookService>;

    await TestBed.configureTestingModule({
      imports: [LibraryComponent],
      providers: [{ provide: BookService, useValue: bookServiceMock }]
    }).compileComponents();

    fixture = TestBed.createComponent(LibraryComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(BookStoreService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load collection on init via store', () => {
    const loadSpy = vi.spyOn(store, 'loadCollection');

    // Recreate component to trigger constructor/effect again
    const newFixture = TestBed.createComponent(LibraryComponent);
    newFixture.detectChanges();

    expect(loadSpy).toHaveBeenCalled();
  });

  it('should search books when submitting search', () => {
    const searchSpy = vi.spyOn(store, 'search');

    (component as any).onQueryInput('Angular');
    (component as any).onSearchSubmit();

    expect(searchSpy).toHaveBeenCalledWith('Angular');
  });

  it('should delegate filter change to store', () => {
    const filterSpy = vi.spyOn(store, 'setStatusFilter');

    (component as any).onFilterChange('LEIDO');

    expect(filterSpy).toHaveBeenCalledWith('LEIDO');
  });

  it('should delegate status change to store', () => {
    const statusSpy = vi.spyOn(store, 'updateStatusOptimistic');

    (component as any).onStatusChange(1, 'COMPRADO' as BookStatus);

    expect(statusSpy).toHaveBeenCalledWith(1, 'COMPRADO');
  });

  it('should delegate rating change to store', () => {
    const ratingSpy = vi.spyOn(store, 'updateRatingOptimistic');

    (component as any).onRatingChange(1, 5);

    expect(ratingSpy).toHaveBeenCalledWith(1, 5);
  });
});

