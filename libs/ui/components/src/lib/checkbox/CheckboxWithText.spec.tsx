import { render } from '@testing-library/react';

import { CheckboxWithText } from './CheckboxWithText';

describe('CheckboxWithText', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<CheckboxWithText label="test" />);
    expect(baseElement).toBeTruthy();
  });
});
