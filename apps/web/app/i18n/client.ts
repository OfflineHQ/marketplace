// use client;

import i18next, { TFunction, i18n } from 'i18next';
import { initReactI18next, useTranslation as useTranslationOrg } from 'react-i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { getOptions } from './settings';
//
i18next
  .use(initReactI18next)
  .use(
    resourcesToBackend(
      (language: I18nLanguage, namespace: I18nNamespace) =>
        import(`./locales/${language}/${namespace}.json`)
    )
  )
  .init(getOptions());

export { i18next };

export function useTranslation(
  lng: I18nLanguage,
  ns?: I18nNamespace | I18nNamespace[],
  options: I18nNextOptions = {}
): { t: TFunction; i18n: i18n } {
  if (i18next.resolvedLanguage !== lng) i18next.changeLanguage(lng);
  return useTranslationOrg(ns, options);
}
