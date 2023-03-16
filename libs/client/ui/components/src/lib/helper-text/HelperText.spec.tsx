import { render, screen } from '@testing-library/react';

import { HelperText } from './HelperText';

describe('HelperText', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<HelperText />);
    expect(baseElement).toBeTruthy();
  });

  it('should render the provided text', () => {
    const testText = 'Test Helper Text';
    render(<HelperText>{testText}</HelperText>);
    const displayedText = screen.getByText(testText);
    expect(displayedText).toBeInTheDocument();
  });
});
