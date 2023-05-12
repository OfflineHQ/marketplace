declare const messages: {
  readonly fr: {
    Index: {
      title: string;
    };
    Header: {
      'display-text': string;
      'display-helper-text': string;
      'display-options': {
        light: string;
        dark: string;
        auto: string;
      };
      'language-text': string;
      'language-helper-text': string;
      'language-options': {
        en: string;
        fr: string;
      };
      'sign-in': string;
      'sign-out': {
        title: string;
        description: string;
      };
      'profile-sections': {
        'my-account': string;
        support: string;
        'support-title': string;
        'support-description': string;
        'sign-out': string;
      };
    };
  };
  readonly en: {
    Index: {
      title: string;
    };
    Header: {
      'display-text': string;
      'display-helper-text': string;
      'display-options': {
        light: string;
        dark: string;
        auto: string;
      };
      'language-text': string;
      'language-helper-text': string;
      'language-options': {
        en: string;
        fr: string;
      };
      'sign-in': string;
      'sign-out': {
        title: string;
        description: string;
      };
      'profile-sections': {
        'my-account': string;
        support: string;
        'support-title': string;
        'support-description': string;
        'sign-out': string;
      };
    };
  };
};
declare const locales: readonly ['en', 'fr'];
declare const defaultLocale = 'en';
export type Messages = (typeof messages)['en'];
export type Locale = (typeof locales)[number];
export { messages, locales, defaultLocale };
