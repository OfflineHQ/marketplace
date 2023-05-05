import { render } from '@testing-library/react';
import type { Route } from 'next';

import { NavLinkExample } from './examples';
import { NextIntlClientProvider } from 'next-intl';

describe('NavLink', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <NextIntlClientProvider locale="en">
        <NavLinkExample href={'/dummy' as Route}>dummy</NavLinkExample>
      </NextIntlClientProvider>
    );
    expect(baseElement).toBeTruthy();
  });
});
