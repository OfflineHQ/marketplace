import { getGreeting } from '../support/app.po';
import { users } from '@test-utils/gql';
import { mock, resetMocks } from '@depay/web3-mock';
const blockchain = 'ethereum';
const accounts = ['0xd8da6bf26964af9d7eed9e03e53415d37aa96045'];

describe('Authentication tests', () => {
  before(() => {
    cy.task('db:delete-users');
    cy.task('db:seed-db', '../../tools/test/seeds/users.sql');
    mock({ blockchain, accounts: { return: accounts } });
  });

  it('cypress direct login allow logged user to see his infos', function () {
    cy.login('alpha_admin');
    cy.visit('/user');
    cy.findAllByText(new RegExp(users.alpha_admin.email, 'i')).should(
      'be.visible'
    );
  });
});
