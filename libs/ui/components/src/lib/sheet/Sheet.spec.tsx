// Sheet.spec.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { SheetDemo } from './examples';

describe('Sheet', () => {
  it('should close when the close button is clicked', async () => {
    // Render the component in the initial state with the "Open sheet" button
    render(<SheetDemo />);
    // Trigger the sheet
    const openButton = screen.getByRole('button', { name: /open sheet/i });
    fireEvent.click(openButton);

    // Wait for the sheet to open
    let sheetTitle;
    try {
      sheetTitle = await screen.findByText('Edit profile');
    } catch (error) {
      // If it doesn't find the sheet title, fail the test
      fail('The sheet did not open');
    }

    // Find the close button and click it
    const closeButton = screen.getByTestId('sheet-close');
    fireEvent.click(closeButton);

    // Ensure the sheet is closed
    sheetTitle = screen.queryByText('Edit profile');
    // queryByText will return null if it doesn't find the element, so you can assert that the result is null
    expect(sheetTitle).toBeNull();
  });
});
