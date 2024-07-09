import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ConfigProvider } from 'antd';
import i18nInstance from './common/i18n';
import { localStore } from './utils/store';

import enUS from './assets/locales/en-US';
import zhCN from './assets/locales/zh-CN';
import deDE from './assets/locales/de-DE';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const getAntdLocale = () => {
  switch (localStore.get('i18nextLng')) {
    case 'en-US':
      return enUS;
    case 'zh-CN':
      return zhCN;
    case 'de-DE':
      return deDE
    default:
      return enUS;
  }
}

// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

window.bo = 'cn'
i18nInstance.then(() => {
  root.render(
    <ConfigProvider locale={zhCN as any}>
        <App />
    </ConfigProvider>
  )
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
