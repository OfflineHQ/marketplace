import { render } from '@testing-library/react';

import { NavMobile } from './NavMobile';
import { menuSections } from './examples';

jest.mock('next/router', () => require('next-router-mock'));

describe('NavMobile', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<NavMobile menuSections={menuSections} />);
    expect(baseElement).toBeTruthy();
  });
});
