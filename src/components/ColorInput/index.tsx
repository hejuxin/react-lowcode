import { Input } from 'antd'
import React, { useState } from 'react'
import { CustomPicker } from 'react-color'
import { EditableInput, Hue, Saturation } from 'react-color/lib/components/common'
import './index.scss'

const ColorInput: React.FC<any> = (props: any) => {
  const { color, hsl, hsv, onChange, onReset, hasAlpha = false, onAlphaChange, alpha, tipText } = props
  const [showPicker, setShowPicker] = useState(false)
  const customProp = {
    hsl,
    hsv,
    onChange,
  }
  return (
    <div className='color-input-blcok'>
      <div className='color-input-top'>
        <div className='input-block'>
          <div className='left' onClick={() => {
            setShowPicker(!showPicker)
          }}>
            <div className='color-con' style={{ background: color }}></div>
          </div>
          <div className='right'>
            <EditableInput
              value={color}
              onChange={onChange}
            />
          </div>
        </div>
        <div className='top-extra'>
          {
            hasAlpha ? <div style={{ display: 'flex', alignItems: 'center' }}>
              <p style={{ width: 80 }}>透明度:</p>
              <Input suffix='%' value={`${alpha * 100}`} onChange={onAlphaChange} type='number' min={0} max={100} />
            </div> : <span>{tipText || "选择配色或输入RGB数值"}</span>
          }
        </div>
      </div>
      {
        showPicker && <div className='color-input-con'>
          <div className='color-picker'>
            <div className='board'>
              <Saturation {...customProp} />
            </div>
            <div className='bar'>
              <Hue
                direction="vertical"
                {...customProp}
              />
            </div>
          </div>
          <div className='reset-area'>
            <span onClick={onReset}>恢复默认</span>
          </div>
        </div>
      }
    </div>
  )
}

export default CustomPicker(ColorInput)
