import { render, fireEvent, screen } from '@testing-library/react';
import { usePathname } from 'next/navigation'; // <-- usePathname is used in your component

import { NavLinkExample } from './examples';
import { NextIntlClientProvider } from 'next-intl';

jest.mock('next/navigation'); // <-- tell Jest to mock the entire module

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
    usePathname.mockReturnValue('/'); // <-- mock the usePathname hook

    const href = '/test';
    render(<NavLinkExample href={href}>Test</NavLinkExample>);

    const linkElement = screen.getByRole('link', { name: /Test/i });

    expect(linkElement.getAttribute('href')).toBe(href);
  });
});
