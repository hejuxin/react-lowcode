import { Button } from 'antd'
import React from 'react'

interface IParams {
  type: 'input' | 'export'
}
interface IProps {
  onClick: (params: IParams) => void
}

export default function OperateContent(props: IProps) {
  const { onClick} = props;

  const handleImport = () => {
    onClick({
      type: 'input'
    })
  }

  const handleExport = () => {
    onClick({
      type: 'export'
    })
  }
  return (
    <div>
      <Button type='link' onClick={handleImport}>导入数据</Button>
      <Button type='link' onClick={handleExport}>导出数据</Button>
    </div>
  )
}
