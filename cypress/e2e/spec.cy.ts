describe('My First Test', () => {
  it('Visits the initial project page', () => {
    cy.visit('/');
    cy.contains('Ingresar');
    cy.url().should('include','/login');
  });

  it('Valid credentials goes to /dashboard', () => {
    cy.visit('/');
    cy.get('[aria-label=Email]').type('manja@example.com');
    cy.get('[aria-label=Contraseña]').type('admin123');
    cy.get('[type=submit').click();
    cy.url().should('include','/dashboard');

  })


  it('invalid credentials goes to /dashboard', () => {
    cy.visit('/');
    cy.get('[aria-label=Email]').type('manja@example.com');
    cy.get('[aria-label=Contraseña]').type('admin1234');
    cy.get('[type=submit').click();
    cy.contains('Error al autenticar. Intente de nuevo.')
  })

  it('Open library page', () => {

    
    cy.visit('/');
    cy.get('[aria-label=Email]').type('manja@example.com');
    cy.get('[aria-label=Contraseña]').type('admin123');
    cy.get('[type=submit').click();
    cy.url().should('include','/dashboard');
    cy.get('[data-cy=open-menu]').click();
    cy.get('[data-cy=Biblioteca]').click();
    cy.url().should('include','/library');
  })

  it('creates a new book from library page', () => {
    // usar comando personalizado de login para reutilizar lógica
    //cy.login('manja@example.com', 'admin123');

    cy.intercept('POST', '**/api/books', {statusCode: 201}).as('apiCall');

    cy.visit('/');
    cy.get('[aria-label=Email]').type('manja@example.com');
    cy.get('[aria-label=Contraseña]').type('admin123');
    cy.get('[type=submit').click();
    cy.url().should('include','/dashboard');

    // navegar a la biblioteca
    cy.get('[data-cy=open-menu]').click();
    cy.get('[data-cy=Biblioteca]').click();
    cy.url().should('include','/library');

    // abrir formulario de creación de libro
    cy.get('[data-cy=library-add-book-button]').click();
    cy.url().should('include','/library/new');
    cy.get('[data-cy=book-form]').should('exist');

    // completar formulario con datos válidos
    cy.get('[data-cy=book-title-input]').type('Cypress Testing Book');
    cy.get('[data-cy=book-authors-input]').type('Autor Uno, Autor Dos');
    cy.get('[data-cy=book-isbn-input]').type('1234567890');
    cy.get('[data-cy=book-thumbnail-input]').type('https://example.com/cover.jpg');
    cy.get('[data-cy=book-description-textarea]').type('Libro creado desde prueba E2E.');
    cy.get('[data-cy=book-status-select]').select('COMPRADO');
    cy.get('[data-cy=book-rating-input]').clear().type('5');
    cy.get('[data-cy=book-islent-checkbox]').check();

    // enviar formulario
    cy.get('[data-cy=book-submit-button]').click();

    cy.wait('@apiCall');

    // por ahora la página redirige de vuelta a /library tras el submit
    cy.url().should('include','/library');
  })

})
