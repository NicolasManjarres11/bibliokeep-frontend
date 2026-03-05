import { TestBed } from '@angular/core/testing';

import { BookCardComponent } from './book-card.component';
import { Book, BookStatus } from '../../../../core/models/book.model';
import { describe, it, expect, beforeEach } from 'vitest';

describe('BookCardComponent', () => {
  let component: BookCardComponent;
  let fixture: any;

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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(BookCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('book', sampleBook);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit statusChange when setStatus is called', () => {
    let emitted: BookStatus | null = null;
    component.statusChange.subscribe((value) => {
      emitted = value;
    });

    (component as any).setStatus('LEIDO' as BookStatus);

    expect(emitted).toBe('LEIDO');
  });

  it('should emit ratingChange when setRating is called', () => {
    let emitted: number | null = null;
    component.ratingChange.subscribe((value) => {
      emitted = value;
    });

    (component as any).setRating(5);

    expect(emitted).toBe(5);
  });

  it('should emit statusChange when onStatusSelect is called', () => {
    let emitted: BookStatus | null = null;
    component.statusChange.subscribe((value) => {
      emitted = value;
    });

    (component as any).onStatusSelect('COMPRADO');

    expect(emitted).toBe('COMPRADO');
  });
});

