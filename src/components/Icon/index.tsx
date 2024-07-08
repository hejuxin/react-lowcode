import React, { FC } from 'react'
import classnames from 'classnames'
import './index.scss'

// interface
interface IProps {
  /** icon名称 */
  name: string;
  className?: string;
  /** icon颜色 */
  color?: string;
  /** icon大小 */
  size?: number;
  /** style设置的color和font-size会比props里的color、style高 */
  style?: Record<string, string | number | undefined>;
  onClick?(e: any): void;
}

const Icon: FC<IProps> = (props) => {
  let { name, className, style, color, size, onClick } = props
  if (color || size) {
    style = {
      color,
      fontSize: size ? `${size}px` : undefined,
      ...style
    }
  }
  return (
    <i
      className={classnames(
        'iconfont',
        `icon-${name}`,
        className
      )}
      style={style}
      onClick={onClick}
    >
    </i>
  )
}

export default Icon
