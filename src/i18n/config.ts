import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import regEn from './en/reg.json';
import regRu from './ru/reg.json';
import regGe from './ge/reg.json';

import chatEn from './en/chat.json';
import chatRu from './ru/chat.json';
import chatGe from './ge/chat.json';

import settingsEn from './en/settings.json';
import settingsRu from './ru/settings.json';
import settingsGe from './ge/settings.json';

export const resources = {
  en: {
    reg: regEn,
    chat: chatEn,
    settings: settingsEn
  },
  ru: {
    reg: regRu,
    chat: chatRu,
    settings: settingsRu
  },
  ge: {
    reg: regGe,
    chat: chatGe,
    settings: settingsGe
  }
} as const;

i18n.use(initReactI18next).init({
  lng: 'ru',
  ns: ['reg', 'states', 'settings', 'chat'],
  resources
});
