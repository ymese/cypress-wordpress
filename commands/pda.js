require('cypress-testing-library/add-commands');

const selectors = require('../fixtures/selectors');

Cypress.Commands.add('protectFiles', (imageLocation, imageName) => {
  cy.visit('/wp-admin/media-new.php?browser-uploader').
  fixture(imageLocation).as(imageName);
  cy.uploadFile('#async-upload', imageLocation, imageName ).
    get('#html-upload').
    click().
    visit('/wp-admin/upload.php?mode=list').
    getByText('Configure file protection').
    click({force: true}).
    getByText(selectors.nameButton.protectButton).
    click();
});

Cypress.Commands.add('syncFiles', (imageLocation, imageName) => {
  cy.visit('/wp-admin/media-new.php?browser-uploader').
  fixture(imageLocation).as(imageName);
  cy.uploadFile('#async-upload', imageLocation, imageName ).
    get('#html-upload').
    click().
    visit('/wp-admin/upload.php?mode=list').
    getByText('Configure file protection').
    click({force: true}).
    get(selectors.popUp.syncButton).
    click();
});

Cypress.Commands.add('clickPrivateLink', () => {
  cy.get('[style="flex: 0 1 600px; overflow: hidden;"] > a').
    should('have.attr', 'href').
    then((url) => {
      cy.request({
        url,
        followRedirect: false,
        timeout: 5000,
      }).then((res) => {
        expect(res.status).to.eq(200);
      });
    });
});

Cypress.Commands.add('clickOriginalLink', (protectedLink = true) => {
  cy.get(selectors.originalLink).
    should('have.attr', 'href').
    then((url) => {
      cy.request({
        url,
        followRedirect: false,
        timeout: 5000,
      }).then((res) => {
        if (protectedLink) {
          expect(res.status).to.eq(301);
          expect(res.redirectedToUrl).to.include('pda_404');
        } else {
          expect(res.status).to.eq(200);
        }
      });
    });
});