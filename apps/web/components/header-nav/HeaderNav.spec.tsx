import { render } from '@testing-library/react';
import { menuSections } from '../nav-desktop/examples';

import HeaderNav from './HeaderNav';

jest.mock('next/router', () => require('next-router-mock'));

describe('HeaderNav', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <HeaderNav session={null} menuSections={menuSections} signIn={() => null} />
    );
    expect(baseElement).toBeTruthy();
  });
});
