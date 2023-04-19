// i18next-types.d.ts

declare type I18nLanguage = string;
declare type I18nNamespace = string;

declare interface I18nNextOptions {
  keyPrefix?: string;
}

declare interface I18nOptions {
  supportedLngs: I18nLanguage[];
  fallbackLng: I18nLanguage;
  lng: I18nLanguage;
  fallbackNS: I18nNamespace;
  defaultNS: I18nNamespace;
  ns: I18nNamespace | I18nNamespace[];
  debug?: boolean;
}
