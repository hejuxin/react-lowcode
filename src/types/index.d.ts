type TEntry = 'delivery' | 'togo' | 'dinein' | 'meals' | 'mall' | 'class' | 'member' | 'orders' | 'integral' | 'home' | 'scancode';
type IDiyModuleTab = 'entry' | 'member' | 'extend'

// 模式
type ITabMode = 'brandCode' | 'storeCode'

interface IDiyModule {
  name: string; // 名称
  module: IDiyModuleTab; // 入口 | 会员 | 扩展
  type: TEntry | string; // 类型
  typeExtraContent?: IDiyModuleExtraContent; // 相关内容 暂定为any
  style: {
    width: number;
    height: number;
    left?: number;
    top?: number;
  }
}

interface IDiyModuleExtraContent {
  fontSize?: number;
  color?: string;
  style?: {
    left?: number;
    top?: number;
  }
  phone?: string;
  url?: string;
  media?: IMedia;
  // memberCard?: IDiyMemberCardStyle;
  // memberInfo?: IDiyMemberInfoStyle;
  // memberPointInfo?: IPointsInfoStyle;
}

interface IHomeDiyDetailItem {
  backgroundImages: IMedia[];
  modules: IDiyModule[];
  backgroundColor: string;
}

declare const i18n;
declare module 'lodash';
declare module 'react-color';
declare module 'react-color/lib/components/common';
declare module 'antd/es/locale-provider/LocaleReceiver';

interface Window {
  i18n: any;
  bo: 'cn'
}


interface ITabItem {
  type: string;
  name: any;
  icon: string;
  pic: string;
  activePic: string;
  isShow: number;
  mode: number;
}

interface ITabbarConfig {
  tabs: ITabItem[];
  enableName: number;
  enablePosition: number;
  backgroundColor: string;
  pagesShow: Record<string, number>
}
