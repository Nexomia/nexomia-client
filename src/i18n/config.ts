import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import regEn from './en/reg.json';
import regGe from './ge/reg.json';

import chatEn from './en/chat.json';
import chatGe from './ge/chat.json';

import settingsEn from './en/settings.json';
import settingsGe from './ge/settings.json';

import statesEn from './en/states.json';
import statesGe from './ge/states.json';

export const resources = {
  en: {
    reg: regEn,
    chat: chatEn,
    settings: settingsEn,
    states: statesEn
  },
  ge: {
    reg: regGe,
    chat: chatGe,
    settings: settingsGe,
    states: statesGe
  }
} as const;

i18n.use(initReactI18next).init({
  lng: 'en',
  ns: ['reg', 'states'],
  resources
});
