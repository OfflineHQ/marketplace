import { renderWithIntl } from '@test-utils/next-intl';
import { NavDesktop } from './NavDesktop';
import { menuSections } from './examples';

describe('NavDesktop', () => {
  it('should render successfully', () => {
    const { baseElement } = renderWithIntl(
      <NavDesktop menuSections={menuSections} />
    );
    expect(baseElement).toBeTruthy();
  });
});
