import { pick } from 'remeda';
import {
  render as rtlRender,
  RenderOptions,
  RenderResult,
} from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { messages } from '@next/i18n';

interface RenderWithProvidersOptions extends Omit<RenderOptions, 'queries'> {
  locale?: string;
}

interface CustomReactElement extends React.ReactElement {
  messages?: any;
}

function renderWithIntl(
  ui: CustomReactElement,
  { locale = 'en', ...renderOptions }: RenderWithProvidersOptions = {}
): RenderResult {
  function Wrapper({ children }: { children?: React.ReactNode }) {
    // mocked date to always get the same result in tests
    const staticDate = new Date('2023-06-05T00:00:00Z');
    return (
      <NextIntlClientProvider
        locale={locale}
        messages={pick(messages.en, ui.messages || [])}
        now={staticDate}
      >
        {children}
      </NextIntlClientProvider>
    );
  }

  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

export { renderWithIntl };
