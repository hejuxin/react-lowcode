import React from 'react'
import { Tooltip, Popover } from 'antd'

import './index.scss'
import classNames from 'classnames'

declare type RenderFunction = () => React.ReactNode
interface IProps {
  title?: React.ReactChild,
  title18?: string,
  subtitle?: React.ReactChild
  subtitle18?: string,
  subtitle2?: React.ReactChild,
  subtitle218?: string,
  children?: React.ReactNode,
  tooltip?: React.ReactNode | RenderFunction
  wrapClassName?: string,
  wrapStyle?: React.CSSProperties
  tooltipIcon?: string;
}

const WrapContainer: React.FC<IProps> = (props: IProps) => {
  const { title, title18, subtitle, subtitle18, subtitle2, subtitle218, tooltip, children, wrapClassName, wrapStyle, tooltipIcon = 'icon-help' } = props;
  return (
    <div className={classNames('content-item', { [wrapClassName as string]: wrapClassName })} style={{ ...wrapStyle }}>
      {
        title ? (
          <div className='title'>
            <span>{title}</span>
            {tooltip && <Tooltip title={tooltip} placement='bottomLeft'><i className={`iconfont ${tooltipIcon}`} /></Tooltip>}
          </div>
        ) : (
          <></>
        )
      }
      {
        subtitle ? (
          <div className='subtitle'>{subtitle}</div>
        ) : (
          <></>
        )
      }
      {
        subtitle2 ? (
          <div className='subtitle'>{subtitle2}</div>
        ) : (
          <></>
        )
      }
      <div className='content'>{children}</div>
    </div>
  )
}

export default WrapContainer