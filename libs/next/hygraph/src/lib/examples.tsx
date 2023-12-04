import { type RichTextFieldProps } from './RichTextField';
export const rtfProps = {
  content: {
    children: [
      {
        type: 'heading-four',
        children: [
          {
            text: 'This is a basic description with a title text',
          },
        ],
      },
      {
        type: 'paragraph',
        children: [
          {
            text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse at dignissim urna. Donec sit amet tristique orci. Nunc consectetur sit amet orci nec tristique. Donec metus odio, dapibus id eros id, congue porttitor erat. Fusce ullamcorper est eros, id feugiat eros interdum sed. Fusce quis pellentesque est. Suspendisse aliquet dui sed mattis dictum. Donec ultrices ullamcorper risus at ullamcorper. Cras semper massa mollis lectus lobortis commodo. Integer nec sapien ut urna congue suscipit. Nam eu vulputate arcu.',
          },
        ],
      },
    ],
  },
} satisfies RichTextFieldProps;

export const rtfWithImageProps = {
  content: {
    children: [
      {
        type: 'heading-four',
        children: [
          {
            text: 'This is a basic description with a title text',
          },
        ],
      },
      {
        type: 'paragraph',
        children: [
          {
            text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse at dignissim urna. Donec sit amet tristique orci. Nunc consectetur sit amet orci nec tristique. Donec metus odio, dapibus id eros id, congue porttitor erat. Fusce ullamcorper est eros, id feugiat eros interdum sed. Fusce quis pellentesque est. Suspendisse aliquet dui sed mattis dictum. Donec ultrices ullamcorper risus at ullamcorper. Cras semper massa mollis lectus lobortis commodo. Integer nec sapien ut urna congue suscipit. Nam eu vulputate arcu.',
          },
        ],
      },
      {
        type: 'paragraph',
        children: [
          {
            text: 'And here is an ',
          },
          {
            text: 'image',
            underline: true,
          },
        ],
      },
      {
        src: 'https://media.graphassets.com/s5fv5Kr2T2mCLhb6WeFq',
        type: 'image',
        title: 'test_image.jpg',
        width: 499,
        handle: 's5fv5Kr2T2mCLhb6WeFq',
        height: 640,
        children: [
          {
            text: '',
          },
        ],
        mimeType: 'image/jpeg',
      },
      {
        type: 'paragraph',
        children: [
          {
            text: '',
          },
        ],
      },
    ],
  },
} satisfies RichTextFieldProps;

export const rtfWithLinkProps = {
  content: {
    children: [
      {
        type: 'heading-four',
        children: [
          {
            text: 'This is a basic description with a title text',
          },
        ],
      },
      {
        type: 'paragraph',
        children: [
          {
            text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse at dignissim urna. Donec sit amet tristique orci. Nunc consectetur sit amet orci nec tristique. Donec metus odio, dapibus id eros id, congue porttitor erat. Fusce ullamcorper est eros, id feugiat eros interdum sed. Fusce quis pellentesque est. Suspendisse aliquet dui sed mattis dictum. Donec ultrices ullamcorper risus at ullamcorper. Cras semper massa mollis lectus lobortis commodo. Integer nec sapien ut urna congue suscipit. Nam eu vulputate arcu.',
          },
        ],
      },
      {
        type: 'paragraph',
        children: [
          {
            text: "I'm adding a ",
          },
          {
            href: 'https://dictionary.cambridge.org/dictionary/english/offline',
            type: 'link',
            title: 'offline Oxford dictionnaire',
            children: [
              {
                text: 'Link here',
              },
            ],
            openInNewTab: true,
          },
          {
            text: '',
          },
        ],
      },
    ],
  },
} satisfies RichTextFieldProps;

export const rtfWithAllKindsOfTextProps = {
  content: {
    children: [
      {
        type: 'heading-one',
        children: [
          {
            text: 'Heading 1',
          },
        ],
      },
      {
        type: 'heading-two',
        children: [
          {
            text: 'Heading 2',
          },
        ],
      },
      {
        type: 'heading-three',
        children: [
          {
            text: 'Heading 3',
          },
        ],
      },
      {
        type: 'heading-four',
        children: [
          {
            text: 'Heading 4',
          },
        ],
      },
      {
        type: 'heading-five',
        children: [
          {
            text: 'Heading 5',
          },
        ],
      },
      {
        type: 'heading-six',
        children: [
          {
            text: 'Heading 6',
          },
        ],
      },
      {
        type: 'paragraph',
        children: [
          {
            text: 'Normal text',
          },
        ],
      },
      {
        type: 'paragraph',
        children: [
          {
            text: 'Normal text italic',
            italic: true,
          },
        ],
      },
      {
        type: 'paragraph',
        children: [
          {
            bold: true,
            text: 'Normal text bold',
          },
        ],
      },
      {
        type: 'paragraph',
        children: [
          {
            bold: true,
            text: 'Normal text bold italic',
            italic: true,
          },
        ],
      },
      {
        type: 'paragraph',
        children: [
          {
            bold: true,
            text: 'Normal text bold italic underline',
            italic: true,
            underline: true,
          },
        ],
      },
      {
        type: 'block-quote',
        children: [
          {
            text: 'quoted text ',
          },
        ],
      },
      {
        type: 'paragraph',
        children: [
          {
            code: true,
            text: 'code',
          },
        ],
      },
      {
        type: 'code-block',
        children: [
          {
            text: 'code block',
          },
        ],
      },
      {
        type: 'bulleted-list',
        children: [
          {
            type: 'list-item',
            children: [
              {
                type: 'list-item-child',
                children: [
                  {
                    text: 'bullet list 1',
                  },
                ],
              },
            ],
          },
          {
            type: 'list-item',
            children: [
              {
                type: 'list-item-child',
                children: [
                  {
                    text: 'bullet list 2',
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        type: 'numbered-list',
        children: [
          {
            type: 'list-item',
            children: [
              {
                type: 'list-item-child',
                children: [
                  {
                    text: 'numbered list 1',
                  },
                ],
              },
            ],
          },
          {
            type: 'list-item',
            children: [
              {
                type: 'list-item-child',
                children: [
                  {
                    text: 'numbered list 2',
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        type: 'class',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                text: 'Text with custom tailwind class',
              },
            ],
          },
        ],
        className:
          'underline underline-offset-8 decoration-dashed decoration-pink-500 hover:text-pink-700',
      },
      {
        type: 'paragraph',
        children: [
          {
            text: '',
          },
        ],
      },
      {
        type: 'table',
        children: [
          {
            type: 'table_head',
            children: [
              {
                type: 'table_row',
                children: [
                  {
                    type: 'table_header_cell',
                    children: [
                      {
                        type: 'paragraph',
                        children: [
                          {
                            text: 'Table 1',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    type: 'table_header_cell',
                    children: [
                      {
                        type: 'paragraph',
                        children: [
                          {
                            text: 'Table 2',
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            type: 'table_body',
            children: [
              {
                type: 'table_row',
                children: [
                  {
                    type: 'table_cell',
                    children: [
                      {
                        type: 'paragraph',
                        children: [
                          {
                            text: 'Value 1',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    type: 'table_cell',
                    children: [
                      {
                        type: 'paragraph',
                        children: [
                          {
                            text: 'Value 2',
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              {
                type: 'table_row',
                children: [
                  {
                    type: 'table_cell',
                    children: [
                      {
                        type: 'paragraph',
                        children: [
                          {
                            text: 'Value 1.2',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    type: 'table_cell',
                    children: [
                      {
                        type: 'paragraph',
                        children: [
                          {
                            text: 'Value 2.2',
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        type: 'paragraph',
        children: [
          {
            text: '',
          },
        ],
      },
    ],
  },
} satisfies RichTextFieldProps;
