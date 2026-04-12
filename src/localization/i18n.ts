import {useMemo} from 'react';

import {ExtractableDataType} from '../shared/extractedData';
import {ExtractionSource} from '../shared/types';
import {ThemeId} from '../theme/themes';
import {
  CountForms,
  SupportedLocale,
  TranslationSet,
  translations,
} from './translations';

const RTL_LOCALES = new Set<SupportedLocale>(['ar', 'he']);

function interpolate(
  template: string,
  params: Record<string, number | string> = {},
): string {
  return template.replace(/\{(\w+)\}/g, (_match, key) =>
    String(params[key] ?? ''),
  );
}

function createPluralRules(locale: SupportedLocale) {
  try {
    return new Intl.PluralRules(locale);
  } catch {
    return new Intl.PluralRules('en');
  }
}

function createListFormatter(locale: SupportedLocale) {
  try {
    const IntlWithListFormat = Intl as typeof Intl & {
      ListFormat?: new (
        locales?: string | string[],
        options?: {style?: 'long' | 'narrow' | 'short'; type?: 'conjunction' | 'disjunction' | 'unit'},
      ) => {format: (values: string[]) => string};
    };

    if (!IntlWithListFormat.ListFormat) {
      return null;
    }

    return new IntlWithListFormat.ListFormat(locale, {
      style: 'long',
      type: 'conjunction',
    });
  } catch {
    return null;
  }
}

function createDateFormatter(
  locale: SupportedLocale,
  options: Intl.DateTimeFormatOptions,
) {
  try {
    return new Intl.DateTimeFormat(locale, options);
  } catch {
    return new Intl.DateTimeFormat('en', options);
  }
}

function pickPluralForm(
  count: number,
  forms: CountForms,
  locale: SupportedLocale,
): string {
  const pluralRules = createPluralRules(locale);
  const category = pluralRules.select(count) as keyof CountForms;

  return (
    forms[category] ??
    (count === 0 ? forms.zero : undefined) ??
    forms.other
  );
}

function getDeviceLocale(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().locale ?? 'en';
  } catch {
    return 'en';
  }
}

export function resolveSupportedLocale(locale = getDeviceLocale()): SupportedLocale {
  const normalized = locale.replace(/_/g, '-').trim().toLowerCase();
  const language = normalized.split('-')[0];

  if (
    normalized === 'zh' ||
    normalized.startsWith('zh-cn') ||
    normalized.startsWith('zh-sg') ||
    normalized.includes('hans')
  ) {
    return 'zh-Hans';
  }

  if (normalized === 'pt' || normalized.startsWith('pt-br')) {
    return 'pt-BR';
  }

  if (
    normalized === 'no' ||
    normalized.startsWith('no-') ||
    normalized === 'nb' ||
    normalized.startsWith('nb-') ||
    normalized === 'nn' ||
    normalized.startsWith('nn-')
  ) {
    return 'no';
  }

  if (normalized === 'iw' || normalized.startsWith('iw-')) {
    return 'he';
  }

  if (normalized === 'in' || normalized.startsWith('in-')) {
    return 'id';
  }

  const supportedByLanguage: Record<string, SupportedLocale> = {
    en: 'en',
    ja: 'ja',
    ko: 'ko',
    de: 'de',
    fr: 'fr',
    es: 'es',
    ar: 'ar',
    ru: 'ru',
    it: 'it',
    nl: 'nl',
    tr: 'tr',
    th: 'th',
    vi: 'vi',
    id: 'id',
    pl: 'pl',
    uk: 'uk',
    hi: 'hi',
    he: 'he',
    sv: 'sv',
    da: 'da',
    fi: 'fi',
    cs: 'cs',
    hu: 'hu',
    ro: 'ro',
    el: 'el',
    ms: 'ms',
  };

  return supportedByLanguage[language] ?? 'en';
}

function localizeKnownMessage(
  message: string,
  strings: TranslationSet,
): string {
  switch (message) {
    case 'error.native.moduleUnavailable':
      return strings.runtime.nativeModuleUnavailable;
    case 'error.extract.multiTypeUnavailable':
      return strings.runtime.multiTypeUnavailable;
    case 'error.extract.noSourceAsset':
      return strings.runtime.noSourceAssetSelected;
    case 'Unsupported file type':
      return strings.runtime.unsupportedFileType;
    case 'Unable to export extracted items':
      return strings.runtime.unableToExportExtractedItems;
    case 'Primary OCR pass failed':
      return strings.runtime.primaryOcrFailed;
    case 'High-contrast OCR fallback failed':
      return strings.runtime.highContrastOcrFailed;
    case 'Unable to process image':
      return strings.runtime.unableToProcessImage;
    case 'Unable to open PDF file':
      return strings.runtime.unableToOpenPdf;
    case 'Unable to decode text file':
      return strings.runtime.unableToDecodeTextFile;
    default:
      break;
  }

  const pdfFallbackMatch = message.match(/^OCR fallback failed for PDF page (\d+)$/);

  if (pdfFallbackMatch) {
    return interpolate(strings.runtime.pdfOcrFallbackFailed, {
      page: pdfFallbackMatch[1],
    });
  }

  const fileMissingMatch = message.match(/^File does not exist at path:\s*(.+)$/);

  if (fileMissingMatch) {
    return interpolate(strings.runtime.fileMissing, {
      path: fileMissingMatch[1],
    });
  }

  const imageReadMatch = message.match(/^Unable to read image at path:\s*(.+)$/);

  if (imageReadMatch) {
    return interpolate(strings.runtime.unableToReadImage, {
      path: imageReadMatch[1],
    });
  }

  return message;
}

export function createI18n(locale = resolveSupportedLocale()) {
  const strings = translations[locale] ?? translations.en;
  const listFormatter = createListFormatter(locale);
  const historyDateFormatter = createDateFormatter(locale, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
  const sampleDateFormatter = createDateFormatter(locale, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return {
    locale,
    isRTL: RTL_LOCALES.has(locale),
    strings,
    t: interpolate,
    formatList(values: string[]) {
      if (values.length === 0) {
        return '';
      }

      if (!listFormatter) {
        return values.join(', ');
      }

      return listFormatter.format(values);
    },
    formatCount(type: ExtractableDataType, count: number) {
      return interpolate(
        pickPluralForm(count, strings.dataTypes[type].count, locale),
        {count},
      );
    },
    formatHistoryDate(value: string) {
      const date = new Date(value);

      if (Number.isNaN(date.getTime())) {
        return strings.history.unknownTime;
      }

      return historyDateFormatter.format(date);
    },
    formatSampleDate(value: string) {
      return sampleDateFormatter.format(new Date(value));
    },
    dataTypeLabel(type: ExtractableDataType) {
      return strings.dataTypes[type].label;
    },
    dataTypeGoalLabel(type: ExtractableDataType) {
      return strings.dataTypes[type].goalLabel;
    },
    dataTypeListLabel(type: ExtractableDataType) {
      return strings.dataTypes[type].listLabel;
    },
    sourceLabel(source: ExtractionSource) {
      return strings.sources[source].label;
    },
    sourceListLabel(source: ExtractionSource) {
      return strings.sources[source].listLabel;
    },
    themeLabel(themeId: ThemeId) {
      return strings.themes[themeId].label;
    },
    themeDescription(themeId: ThemeId) {
      return strings.themes[themeId].description;
    },
    localizeMessage(message: string) {
      return localizeKnownMessage(message, strings);
    },
  };
}

export function useI18n() {
  return useMemo(() => createI18n(), []);
}
