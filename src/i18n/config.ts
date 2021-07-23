import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import regEn from './en/reg.json';
import statesEn from './en/states.json';

export const resources = {
  en: {
    reg: regEn,
    states: statesEn
  },
} as const;

i18n.use(initReactI18next).init({
  lng: 'en',
  ns: ['reg', 'states'],
  resources
});
