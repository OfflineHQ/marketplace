import { renderWithIntl } from '@test-utils/next-intl';
import { NavMobile } from './NavMobile';
import { menuSections } from './examples';

describe('NavMobile', () => {
  it('should render successfully', () => {
    const { baseElement } = renderWithIntl(
      <NavMobile menuSections={menuSections} />
    );
    expect(baseElement).toBeTruthy();
  });
});
