import React from 'react';
import Button from '@material-ui/core/Button';
import { useLocale, useSetLocale } from 'react-admin';

const LocaleSwitcher = () => {
  const locale = useLocale();
  const setLocale = useSetLocale();
  return (
    <div>
      <div>Language</div>
      <Button
        disabled={locale === 'fr'}
        onClick={() => setLocale('fr')}
      >
        English
      </Button>
      <Button
        disabled={locale === 'en'}
        onClick={() => setLocale('en')}
      >
        French
      </Button>
    </div>
  );
}

export default LocaleSwitcher;
