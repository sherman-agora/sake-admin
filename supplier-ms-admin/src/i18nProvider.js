import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';
import chineseTraditionalMessages from 'ra-language-chinese-traditional';
import en from './i18n/en';

export const i18nProvider = polyglotI18nProvider(locale => {
  if (locale === 'en') {
    // initial call, must return synchronously
    return { ...englishMessages, ...en };
  }
  if (locale === 'zh-TW') {
    return import('./i18n/zh-TW.js').then(messages => ({ ...chineseTraditionalMessages, ...messages.default }));
  }
}, 'en');
