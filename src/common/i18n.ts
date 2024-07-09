import i18n, { InitOptions } from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import HttpApi from 'i18next-http-backend'
import enUs from '../assets/i18n/en-US.json'
import zhCn from '../assets/i18n/zh-CN.json'
import deDe from '../assets/i18n/de-DE.json'
import boConfig from '../assets/i18n/bo-config.json'
import { isObject } from 'lodash'

const langMap: {
  [key: string]: string;
} = {
  zh: 'cn',
  'zh-CN': 'cn',
  en: 'en',
  'en-US': 'en',
  de: 'ger',
  'de-DE': 'de',
};
const languageDetector = new LanguageDetector();
languageDetector.addDetector({
  name: 'navigatorPre',
  lookup (options: any) {
    if (navigator.language === 'zh' || navigator.language === 'zh-CN') {
      return 'zh-CN';
    } else if (navigator.language === 'de') {
      return 'de-DE';
    } else {
      return 'en-US';
    }
  },
});

const i18nInitOption: InitOptions = {
  fallbackLng: 'zh-CN', // en-US
  // lng: localStore.get('i18nextLng'),
  debug: false,
  interpolation: {
    escapeValue: false, // not needed for react as it escapes by default
  },
  detection: {
    // order and from where user language should be detected
    order: [
      'querystring',
      'localStorage',
      'navigatorPre',
      'navigator',
      'htmlTag',
      'path',
      'subdomain',
    ],
    // keys or params to lookup language from
    lookupQuerystring: 'lng',
    lookupCookie: 'i18next',
    lookupLocalStorage: 'i18nextLng',
    lookupFromPathIndex: 0,
    lookupFromSubdomainIndex: 0,
    // cache user language on
    caches: ['localStorage'],
    excludeCacheFor: ['cimode'], // languages to not persist (cookie, localStorage)
    // optional htmlTag with lang attribute, the default is:
    htmlTag: document.documentElement,
    // only detect languages that are in the whitelist
  },
  load: 'currentOnly',
  ns: ['i18n'],
  defaultNS: 'i18n',
};

if (process.env.NODE_ENV === 'development') {
  // 开发环境使用本地资源
  i18nInitOption.resources = {
    'en-US': {
      i18n: enUs,
    },
    'zh-CN': {
      i18n: zhCn,
    },
    'de-DE': {
      i18n: deDe,
    },
  }
}

const i18nInstance = i18n
  .use(languageDetector)
  .use(HttpApi)
  .init(i18nInitOption)

// 将通用组件的多国语言灌入主语言中

window.i18n = i18n
// 根据bo 输出对应的语言
window.i18n.tbo = (key: string) => {
  const arr = key?.split('.')
  const config: any = boConfig[window.bo]
  return config[arr[0]] && isObject(config[arr[0]]) ? config[arr[0]][arr[1]] : config[arr[0]]
}

export { languageDetector }
export default i18nInstance
