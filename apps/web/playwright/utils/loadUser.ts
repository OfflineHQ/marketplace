import { Page } from 'playwright';

const alpha_user = {
  name: 'Alpha User',
  id: '679f92d6-a01e-4ab7-93f8-10840d22b0a5',
  address: '0xB98bD7C7f656290071E52D1aA617D9cB4467Fd6D',
  email: 'alpha_user@test.io',
};

const beta_user = {
  name: 'Beta User',
  id: '76189546-6368-4325-8aad-220e03837b7e',
  address: '0x1B8bD7C7f656290071E52D1aA617D9cB4469BB9F',
  email: 'beta_user@test.io',
};

const google_user = {
  name: 'Google User',
  id: 'ac542c34-1907-451c-94be-5df69a959080',
  address: '0x1bBEdB07706728A19c9dB82d3c420670D8040592',
  email: 'google_user@gmail.com',
};

async function loadUser(page: Page, user: any) {
  await page.exposeFunction('useE2EAuthContext', () => {
    return JSON.stringify({
      safeUser: {
        eoa: user.address,
        safes: [],
        email: user.email,
        name: user.name,
        profileImage: 'https://robohash.org/johndoe.png?size=96x96',
      },
      safeAuth: 'safeAuth',
      provider: 'provider',
      login: 'Login method called',
      logout: 'Logout method called',
      loginSiwe: 'loginSiwe',
      logoutSiwe: 'logoutSiwe',
      connecting: 'connecting',
    });
  });
  await page.exposeFunction('ethereum', () => {
    return {
      blockchain: 'ethereum',
      accounts: {
        return: [user.address],
      },
    };
  });
}

export { alpha_user, beta_user, google_user, loadUser };
