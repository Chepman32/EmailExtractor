import React, {createContext, useContext, useEffect, useState} from 'react';

import {
  persistLocalePreference,
  readLocalePreference,
} from './localeStorage';
import {SupportedLocale} from './translations';

type LocaleContextValue = {
  userLocale: SupportedLocale | null;
  setUserLocale: (locale: SupportedLocale | null) => void;
};

export const LocaleContext = createContext<LocaleContextValue>({
  userLocale: null,
  setUserLocale: () => {},
});

export function useLocaleContext() {
  return useContext(LocaleContext);
}

export function LocaleProvider({children}: {children: React.ReactNode}) {
  const [userLocale, setUserLocaleState] = useState<SupportedLocale | null>(null);

  useEffect(() => {
    readLocalePreference()
      .then(saved => {
        if (saved !== null) {
          setUserLocaleState(saved);
        }
      })
      .catch(() => {});
  }, []);

  const setUserLocale = (locale: SupportedLocale | null) => {
    setUserLocaleState(locale);
    persistLocalePreference(locale).catch(() => {});
  };

  return (
    <LocaleContext.Provider value={{userLocale, setUserLocale}}>
      {children}
    </LocaleContext.Provider>
  );
}
