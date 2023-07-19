import { users } from '@test-utils/gql';
import { mock, resetMocks } from '@depay/web3-mock-evm';

// TODO, set back when optimization of next dev is done: https://github.com/Offline-Project/marketplace/issues/23
describe.skip('Authentication tests', () => {
  // beforeEach(() => {
  //   // cy.task('db:delete-users');
  //   // cy.task('db:seed-db', '../../hasura/app/seeds/default/users.sql');
  //   cy.on('window:before:load', (win) => {
  //     mock({
  //       blockchain: 'ethereum',
  //       accounts: {
  //         return: [users.alpha_user.address],
  //       },
  //     });
  //     win.ethereum = cy.window().specWindow.window.ethereum;
  //   });
  // });

  it('cypress direct login allow logged user to see his infos', function () {
    cy.login('alpha_user');
    cy.on('window:before:load', (win) => {
      mock({
        blockchain: 'ethereum',
        accounts: {
          return: [users.alpha_user.address],
        },
      });
      win.ethereum = cy.window().specWindow.window.ethereum;
    });
    cy.visit('/user');
    cy.findByText(users.alpha_user.address.slice(0, 3), {
      exact: false,
    }).should('be.visible');
  });
});
