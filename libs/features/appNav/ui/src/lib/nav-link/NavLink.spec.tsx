import { render, fireEvent, screen } from '@testing-library/react';
import { useRouter } from 'next/router';

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
  it('should render with the correct href', () => {
    const mockRouter = {
      pathname: '/',
    };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);

    const href = '/test';
    render(<NavLinkExample href={href}>Test</NavLinkExample>);

    const linkElement = screen.getByRole('link', { name: /Test/i });

    expect(linkElement.getAttribute('href')).toBe(href);
  });
});
