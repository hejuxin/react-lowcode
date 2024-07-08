import React from 'react'
import './index.scss'
interface IProps {
  value?: IDiyModule
  handleModuleClick: (action: 'add' | 'del' | 'replace') => void
}

const ModuleItem: React.FC<IProps> = props => {
  const { value, handleModuleClick } = props
  return (
    <div className='content-module-item'>
      {
        value && <span className='close-x' onClick={() => handleModuleClick('del')}></span>
      }
      <div className={`content-module-item-content ${value?.module ? `module_type_${value?.module} ` : ''}`} onClick={() => handleModuleClick(value ? 'replace' : 'add')}>
        {
          value ? value.name : <span className='add-icon'>+</span>
        }
      </div>
    </div>
  )
}

export default ModuleItem
