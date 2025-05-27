describe('E-commerce Store Tests', () => {
  const STORE_URL = 'https://r0970901-realbeans.myshopify.com';
  const STORE_PASSWORD = 'eren1234';

  beforeEach(() => {
    // Visit store and handle password page
    cy.visit(STORE_URL, { failOnStatusCode: false });
    cy.get('body').then(($body) => {
      if ($body.find('input[name="password"]').length > 0) {
        cy.get('input[name="password"]').type(STORE_PASSWORD);
        cy.get('form').submit();
        cy.wait(2000); // Wait for page load after password entry
      }
    });
    cy.url().should('not.include', '/password');
  });

  it('Homepage displays intro text and product list correctly', () => {
    cy.visit(STORE_URL);
    // Check intro text (adjust selector and text based on theme)
    cy.get('.shopify-section h1, .banner__content').should('be.visible');
    // Example: cy.get('.banner__content').should('contain.text', 'Your Intro Text');
    
    // Check product list
    cy.get('.product-grid .card, .grid__item').should('have.length.at.least', 1);
    cy.get('.product-grid .card, .grid__item').first().within(() => {
      cy.get('img').should('be.visible');
      cy.get('.price__regular, .price').should('be.visible');
      cy.get('.card__heading, .product-title').should('be.visible');
    });
  });

  it('Product catalog shows correct items', () => {
    cy.visit(`${STORE_URL}/collections/all`);
    // Verify products are displayed
    cy.get('.product-grid .card, .grid__item').should('have.length.at.least', 1);
    cy.get('.product-grid .card, .grid__item').each(($product) => {
      cy.wrap($product).within(() => {
        cy.get('img').should('be.visible');
        cy.get('.price__regular, .price').should('be.visible');
        cy.get('.card__heading, .product-title').should('be.visible');
      });
    });
  });

  it('Sorting products by price changes their order', () => {
    cy.visit(`${STORE_URL}/collections/all`);
    // Ensure products are loaded
    cy.get('.product-grid .card, .grid__item').should('be.visible');
    
    // Get initial product prices
    cy.get('.price__regular').then(($prices) => {
      const initialPrices = Array.from($prices).map(el =>
        parseFloat(el.textContent.replace(/[^0-9.]/g, '').replace(/(\..*?)\./g, '$1'))
      );

      // Sort by price (adjust selector and value based on theme)
      // Inspect <select> for ID (e.g., SortBy) or name (e.g., sort_by) and option values (e.g., price-ascending)
      cy.get('select#SortBy, select[name="sort_by"]').first().select('price-ascending', { force: true });
      cy.wait(1000); // Wait for sort to apply
      cy.url().should('include', 'sort_by=price-ascending'); // Verify sort applied

      // Verify new order
      cy.get('.price__regular').then(($sortedPrices) => {
        const sortedPrices = Array.from($sortedPrices).map(el =>
          parseFloat(el.textContent.replace(/[^0-9.]/g, '').replace(/(\..*?)\./g, '$1'))
        );
        for (let i = 0; i < sortedPrices.length - 1; i++) {
          expect(sortedPrices[i]).to.be.at.most(sortedPrices[i + 1]);
        }
      });
    });
  });

  it('Product detail pages display correct descriptions, prices, and image names', () => {
    cy.visit(`${STORE_URL}/collections/all`);
    // Test first product
    cy.get('.product-grid .card, .grid__item').first().click();
    cy.url().should('include', '/products');
    
    // Verify details
    cy.get('.product__title, h1').should('be.visible');
    cy.get('.price__regular, .product__price').should('be.visible');
    cy.get('.product__description, .product__text').should('not.be.empty');
    cy.get('.product__media img').should('have.attr', 'src').and('not.be.empty');
  });

  it('About page includes history paragraph', () => {
    cy.visit(`${STORE_URL}/pages/about-us`, { failOnStatusCode: false });
    // Verify page and history content
    cy.get('h1, h2').should('contain.text', 'About');
    cy.get('.rte p, .page-content p').should('have.length.at.least', 1);
    cy.get('.rte, .page-content').invoke('text').then((text) => {
      expect(text.length).to.be.greaterThan(50); // Ensure substantial content
    });
  });
});