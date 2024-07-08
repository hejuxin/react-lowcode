import React, { useState } from 'react'
import classnames from 'classnames'
import './index.scss'
import { Icon } from '..'
interface IProps {
  children: React.ReactNode;
  isShow: boolean;
  title?: string;
  handleCancel: () => void;
  wrapClassName?: string;
}

const ContentWrapper: React.FC<IProps> = ({ children, title, isShow, handleCancel, wrapClassName }) => {
  return (
    <div className={classnames(
      'content-container-wrapper', {
        'slide-in': isShow,
        [wrapClassName || '']: !!wrapClassName
      }
    )}>
      <div className="content-title-wrap">
        <span className="title">{title}</span>
        <Icon name="close" className="close-icon" onClick={handleCancel} />
      </div>
      <div className="content-wrapper">{children}</div>
    </div>
  )
}

export default ContentWrapper
