import { render } from '@testing-library/react';

import { NavLinkExample } from './examples';
import { NextIntlClientProvider } from 'next-intl';

describe('NavLink', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <NextIntlClientProvider locale="en">
        <NavLinkExample href={'/dummy'}>dummy</NavLinkExample>
      </NextIntlClientProvider>
    );
    expect(baseElement).toBeTruthy();
  });
});
