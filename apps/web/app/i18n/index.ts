import { createInstance, TFunction, i18n } from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next } from 'react-i18next';
import { getOptions } from './settings';

export async function initI18next(
  lng: I18nLanguage,
  ns?: I18nNamespace | I18nNamespace[]
): Promise<i18n> {
  const i18nInstance = createInstance();
  await i18nInstance
    .use(initReactI18next)
    .use(
      resourcesToBackend(
        (language: I18nLanguage, namespace: I18nNamespace) =>
          import(`./locales/${language}/${namespace}.json`)
      )
    )
    .init(getOptions(lng, ns));
  return i18nInstance;
}

export async function useTranslation(
  lng: I18nLanguage,
  ns?: I18nNamespace | I18nNamespace[],
  options: I18nNextOptions = {}
): Promise<{ t: TFunction; i18n: i18n }> {
  const i18nextInstance = await initI18next(lng, ns);
  return {
    t: i18nextInstance.getFixedT(lng, Array.isArray(ns) ? ns[0] : ns, options.keyPrefix),
    i18n: i18nextInstance,
  };
}
