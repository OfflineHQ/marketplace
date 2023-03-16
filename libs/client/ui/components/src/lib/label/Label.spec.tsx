// Label.spec.tsx
import { render, screen } from '@testing-library/react';
import { Label, LabelProps } from './Label';

describe('Label', () => {
  it('should render successfully', () => {
    const testId = 'label-testid';
    const labelText = 'Test Label';
    const props: LabelProps = {
      htmlFor: 'test-input',
      children: labelText,
    };

    render(<Label data-testid={testId} {...props} />);
    const labelElement = screen.getByTestId(testId);

    expect(labelElement).toBeInTheDocument();
    expect(labelElement).toHaveTextContent(labelText);
    expect(labelElement).toHaveAttribute('for', props.htmlFor);
  });

  it('should apply the correct variant class', () => {
    const labelText = 'Info Label';
    const props: LabelProps = {
      variant: 'info',
      htmlFor: 'test-input',
      children: labelText,
    };

    render(<Label {...props} />);
    const labelElement = screen.getByText(labelText);

    expect(labelElement).toHaveClass('text-blue-500 dark:text-blue-700');
  });
});
