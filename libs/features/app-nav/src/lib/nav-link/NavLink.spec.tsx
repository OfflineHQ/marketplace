import { renderWithIntl } from '@test-utils/next-intl';
import { NavLinkExample } from './examples';

jest.mock('@next/navigation'); // <-- tell Jest to mock the entire module

describe('NavLink', () => {
  it('should render successfully', () => {
    const { baseElement } = renderWithIntl(
      <NavLinkExample href={'/dummy'}>dummy</NavLinkExample>,
    );
    expect(baseElement).toBeTruthy();
  });
});
