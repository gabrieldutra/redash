Cypress.Commands.add('login', () => {
  const users = {
    admin: {
      email: 'admin@redash.io',
      password: 'password',
    },
  };

  cy.request({
    url: '/login',
    method: 'POST',
    form: true,
    body: users.admin,
  });
});

Cypress.Commands.add('getElement', element => cy.get('[data-test="' + element + '"]'));
