// Types
type Language = string;
type Namespace = string;
type I18nOptions = {
  supportedLngs: Language[];
  fallbackLng: Language;
  lng: Language;
  fallbackNS: Namespace;
  defaultNS: Namespace;
  ns: Namespace | Namespace[];
  debug?: boolean;
};

export const fallbackLng: Language = 'en';
export const languages: Language[] = [fallbackLng, 'fr'];
export const defaultNS: Namespace = 'translation';

export function getOptions(
  lng: Language = fallbackLng,
  ns: Namespace | Namespace[] = defaultNS
): I18nOptions {
  return {
    // debug: true,
    supportedLngs: languages,
    fallbackLng,
    lng,
    fallbackNS: defaultNS,
    defaultNS,
    ns,
  };
}
