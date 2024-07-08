import React from 'react'
import './index.scss'

interface IProps {
  children: any;
}

const WrapItemBlock: React.FC<IProps> = React.memo((props) => {
  const { children } = props
  return (
    <div className='wrap-item-block'>
      {children}
    </div>
  )
})

export default WrapItemBlock
