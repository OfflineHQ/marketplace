import { pick } from 'remeda';
import {
  render as rtlRender,
  RenderOptions,
  RenderResult,
} from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { messages } from '@client/i18n';

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
    return (
      <NextIntlClientProvider
        locale={locale}
        messages={pick(messages.en, ui.messages || [])}
      >
        {children}
      </NextIntlClientProvider>
    );
  }

  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

export { renderWithIntl };
