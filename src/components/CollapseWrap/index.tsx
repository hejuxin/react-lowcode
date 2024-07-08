import React, { useState, useEffect } from 'react'
import { Icon } from '..'
import classnames from 'classnames'
import './index.scss'
interface IProps {
  title: string | React.ReactChild
  visible?: boolean
  wrapClassName?: string
  desc?: string;
  children?: React.ReactNode
}

const CollapseWrap: React.FC<IProps> = props => {
  const { title, visible = true, wrapClassName = '', desc } = props
  const [isShowMore, setShowMore] = useState<boolean>(visible)
  return (
    <div className={`collapse-wrap ${wrapClassName}`}>
      <div className="collapse-wrap-header" onClick={() => setShowMore(!isShowMore)}>
        <div className="collapse-wrap-title">{title}</div>
        <div className="type-change-icon-wrap">
          <Icon name="chevron--down" className={classnames('chevron--down', { rotate: isShowMore })} />
        </div>
      </div>
      {/* <div className="collapse-wrap-content"></div> */}
      <div className={classnames('collapse-wrap-content', { 'show-more': isShowMore })}>
        {
          desc && <p className="collapse-wrap-desc">{desc}</p>
        }
        {props.children}
      </div>
    </div>
  )
}

export default CollapseWrap
