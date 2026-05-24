import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const locales = [
  'ar', 'fr', 'en', 'nl', 'de', 'it', 'es', 'pt', 'tr', 'ru', 'be', 'uk', 'pl', 'ro', 'el', 'hu', 'cs', 'da', 'no', 'sv', 'fi', 'ga', 'af', 'zu', 'xh', 'zh', 'ms', 'ta', 'ja', 'ko', 'hi', 'mi', 'th', 'vi', 'id', 'ku', 'DZ-ar', 'DZ-fr', 'MA-ar', 'MA-fr', 'TN-ar', 'TN-fr', 'EG-ar', 'SA-ar', 'AE-ar', 'QA-ar', 'KW-ar', 'LB-ar', 'LB-fr', 'LY-ar', 'SY-ar', 'IQ-ar', 'IQ-ku', 'JO-ar', 'OM-ar', 'BH-ar', 'YE-ar', 'SD-ar', 'FR-fr', 'BE-fr', 'BE-nl', 'CH-fr', 'CH-de', 'CH-it', 'CA-fr', 'CA-en', 'US-en', 'GB-en', 'DE-de', 'ES-es', 'IT-it', 'PT-pt', 'BR-pt', 'TR-tr', 'RU-ru', 'BY-be', 'BY-ru', 'UA-uk', 'PL-pl', 'RO-ro', 'GR-el', 'HU-hu', 'CZ-cs', 'DK-da', 'NO-no', 'SE-sv', 'FI-fi', 'FI-sv', 'NL-nl', 'IE-en', 'IE-ga', 'AT-de', 'MX-es', 'AR-es', 'CO-es', 'CL-es', 'PE-es', 'SN-fr', 'AO-pt', 'ZA-en', 'ZA-af', 'ZA-zu', 'ZA-xh', 'CN-zh', 'SG-en', 'SG-zh', 'SG-ms', 'SG-ta', 'TW-zh', 'JP-ja', 'KR-ko', 'IN-hi', 'IN-en', 'AU-en', 'NZ-en', 'NZ-mi', 'TH-th', 'VN-vi', 'ID-id', 'MY-ms'
] as const;

export const routing = defineRouting({
  locales: locales,
  defaultLocale: "fr",
  localePrefix: "always",
});

export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);
