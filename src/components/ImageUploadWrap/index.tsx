import React from 'react'
import { ImageUploader } from '../';
import './index.scss'

interface IProps {
  notShowImage?: boolean
  value?: string
  onChange: (action: 'add' | 'del' | 'replace', info?: any) => void
  // onChange: (info: any) => void
  maxSize?: number
}

const ImageUploadWrap: React.FC<IProps> = props => {
  const { value, onChange, notShowImage = false, maxSize = 5 } = props
  return (
    <div className='image-upload-wrap'>
      {
        value && <span className='close-x' onClick={() => onChange('del')}></span>
      }
      <ImageUploader
        // onChange={(info) => onChange('add', info)}
        notShowImage={notShowImage}
        // onChange={onChange}
        onChange={(info: any) => onChange(value ? 'replace' : 'add', info)}
        value={value}
        // todo
        host={''}
        extraData={{
          type: 'product',
          brandId: localStorage.getItem('ls.lastBrandId'),
          token: String(localStorage.getItem('ls.token')),
        }}
        maxSize={maxSize}
      />
    </div>
  )
}

export default ImageUploadWrap
