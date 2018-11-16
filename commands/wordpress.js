require('cypress-testing-library/add-commands');

const selectors = require('../fixtures/selectors.json');

Cypress.Commands.add('uploadFile', (selector, fileUrl, type = '') => {
  return cy.get(selector).then(subject => {
    return cy.fixture(fileUrl, 'base64').
      then(Cypress.Blob.base64StringToBlob).
      then(blob => {
        return cy.window().then(win => {
          const el = subject[0];
          const nameSegments = fileUrl.split('/');
          const name = nameSegments[nameSegments.length - 1];
          const testFile = new win.File([blob], name, { type });
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(testFile);
          el.files = dataTransfer.files;
          return subject;
        });
      });
  });
});

Cypress.Commands.add('login', ({ username, password }) => {
  cy.visit('/wp-admin/media-new.php').
    get('#user_login').
    type(username, { delay: 10 }).
    get('#user_pass').
    type(password, { delay: 10 }).
    get('#wp-submit').
    click();
});

Cypress.Commands.add('deleteMediaFiles', () => {
  cy.get('#cb-select-all-1').
    click().
    get('#bulk-action-selector-top').
    select('Delete Permanently').
    get('#doaction').
    click();
});

Cypress.Commands.add('uploadMediaFile', (fileName) => {
  cy.visit(selectors.pages.uploadFile);
  cy.fixture(fileName).as('bot');
  cy.uploadFile('#async-upload', fileName, 'png').
    get('#html-upload').
    click();
});


Cypress.Commands.add('deleteFile', (fileName) => {
  cy.get(`a[aria-label="Delete “${fileName}” permanently"]`).
    click({ force: true, multiple: true });
});

Cypress.Commands.add('changeSelect2Value', (identifier, value) => {
  cy.get(identifier).
    then(($el) => {
      $el.val(value);
      $el.trigger('change');
    });
});


Cypress.Commands.add('deletePost', (postTitle) => {
    cy.get(`a[aria-label="Move “${postTitle}” to the Trash"]`).click({force: true , multiple: true });
});

Cypress.Commands.add('addNewPost', (postTitle) => {
    cy.get('.page-title-action').click().
    get('#title').type(postTitle).
    get('#content-html').click().
    get('#content').type('page 404').wait(1000).
    get('#publish').click().wait(2000)
});
