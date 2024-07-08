import React from 'react';
import { createFromIconfontCN } from '@ant-design/icons';

export interface IconProps {
  type:
    | 'icon-checked-fill'
    | 'icon-checked'
    | 'icon-uncheck'
    | 'icon-chevron--left'
    | 'icon-help'
    | 'icon-sousuo'
    | 'icon-draggable'
    | 'icon-chevron--right'
    | 'icon-chevron--down'
    | 'icon-close'
    | 'icon-image'
    | 'icon-delete'
    | 'icon-checkbox--checked--filled'
    | 'icon-checkbox--undeterminate--filled'
    | 'icon-checkbox'
    | 'icon-caret--down';
  className?: string;
  style?: React.CSSProperties;
}

const Icon = (props: IconProps) => {
  const { type, ...others } = props;
  const Iconfont = createFromIconfontCN({
    scriptUrl: '////at.alicdn.com/t/font_2074058_5jzehfppv7d.js', // 更新iconfont后记得更新这个js
  });
  return <Iconfont type={type} {...others} />;
};

export default Icon;