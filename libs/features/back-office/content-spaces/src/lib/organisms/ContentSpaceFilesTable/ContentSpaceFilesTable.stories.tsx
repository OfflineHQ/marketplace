import { Meta, StoryObj } from '@storybook/react';

import { userEvent, within } from '@storybook/test';
import { ContentSpaceFilesTable } from './ContentSpaceFilesTable';
import { contentSpaceFilesTableMocks } from './examples';

const meta = {
  component: ContentSpaceFilesTable,
  parameters: {
    layout: 'fullscreen',
    moduleMock: {
      mock: contentSpaceFilesTableMocks,
    },
  },
  render: (props) => (
    <div className="distinct bg-distinct p-6">
      <ContentSpaceFilesTable {...props} className="pb-8" />
    </div>
  ),
} satisfies Meta<typeof ContentSpaceFilesTable>;

export default meta;

type Story = StoryObj<typeof meta>;

const openButtonFileRow = async (fileRow: HTMLElement) => {
  let buttonFileRow = within(fileRow.closest('tr') as HTMLElement).queryByRole(
    'button',
  );
  while (buttonFileRow && buttonFileRow.getAttribute('data-state') !== 'open') {
    await userEvent.click(buttonFileRow);
    buttonFileRow = within(fileRow.closest('tr') as HTMLElement).queryByRole(
      'button',
    );
  }
};

export const Default: Story = {
  args: {
    organizerId: 'organizerId',
    contentSpaceId: 'contentSpaceId',
  },
};

// export const WithFileSelectedAndActions: Story = {
//   ...Default,
//   play: async ({ canvasElement, parameters }) => {
//     const file1 = await screen.findByText(/file1/i);
//     const fileRow = file1.closest('tr') as HTMLElement;

//     await openButtonFileRow(fileRow);
//     expect(await screen.findByText(/Download the file/i)).toBeInTheDocument();
//     userEvent.click(await screen.findByText(/Delete the file/i));
//     await screen.findByRole('status');
//     const mock = getMock(parameters, deleteFile, 'deleteEventPassFile');
//     expect(mock).toHaveBeenCalledWith({
//       organizerId: 'organizerId',
//       eventId: 'eventId',
//       eventPassId: 'eventPassId',
//       filePath: '/local/path/to/file1',
//     });
//     const fileCheckbox = within(fileRow).getByRole('checkbox');
//     await userEvent.click(fileCheckbox);
//     const file3 = await screen.findByText(/file3/i);
//     const fileRow3 = file3.closest('tr') as HTMLElement;
//     const fileCheckbox3 = within(fileRow3).getByRole('checkbox');
//     await userEvent.click(fileCheckbox3);
//     userEvent.click(
//       await screen.findByRole('button', {
//         name: /Menu Actions/i,
//       }),
//     );
//     expect(await screen.findByText(/delete/i)).toBeInTheDocument();
//     expect(await screen.findByText(/download/i)).toBeInTheDocument();
//   },
// };

// export const WithNoFiles: Story = {
//   ...Default,
//   play: async ({ canvasElement, parameters }) => {
//     const mock = getMock(parameters, getPass, 'getContentSpaceFiles');
//     mock.mockReturnValue(Promise.resolve([]));
//     await waitFor(() => {
//       expect(
//         screen.getByRole('button', { name: /upload your files/i }),
//       ).toBeInTheDocument();
//     });
//   },
// };

// export const WithNoFilesUploadModale: Story = {
//   ...Default,
//   parameters: {
//     chromatic: { disableSnapshot: true },
//   },
//   play: async ({ canvasElement, parameters }) => {
//     const mock = getMock(parameters, getPass, 'getContentSpaceFiles');
//     mock.mockReturnValue(Promise.resolve([]));
//     userEvent.click(
//       await screen.findByRole('button', { name: /upload your files/i }),
//     );
//     expect(await screen.findByText(/Upload an image/i)).toBeInTheDocument();
//   },
// };
