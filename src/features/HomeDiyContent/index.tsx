import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { ModuleAddModal, ModuleEditModal } from '../modal'
import { deepClone } from '../../utils'
import { pick } from 'lodash'
import { Tooltip } from 'antd'
import './index.scss'
import { ColorInput, ImageUploadWrap, ModuleItem, CollapseWrap } from '../../components'
interface IProps {
  value: IHomeDiyDetailItem
  onSetData: (value: IHomeDiyDetailItem) => void
  moduleIndex: number
  onModuleIndexChange: (index: number) => void
  tabMode: ITabMode
}

type TAction = 'add' | 'del' | 'replace'

const removeVideo = (index?: number) => {
  const videoList: any = document.querySelector('.diy-video-list')
  if (index) {
    const video: any = document.getElementById(`video${index}`)
    videoList.removeChild(video)
  } else {
    videoList.childNodes.forEach((child: any) => {
      videoList.removeChild(child)
    })
  }
}

const HomeDiyItem: React.FC<IProps> = props => {
  const { value, onSetData, moduleIndex, onModuleIndexChange, tabMode } = props
  const [addVisible, setAddVisible] = useState<boolean>(false)
  const [editVisible, setEditVisible] = useState<boolean>(false)
  const images = useMemo(() => {
    return value?.backgroundImages ? deepClone(value?.backgroundImages) : []
  }, [value])

  const modules = useMemo(() => {
    return value?.modules ? deepClone(value?.modules) : []
  }, [value])

  const backgroundColor = useMemo(() => {
    return value?.backgroundColor || '#fff'
  }, [value])

  useEffect(() => {
    const module = modules[moduleIndex]
    if (module?.module !== 'entry' && moduleIndex > -1) {
      setEditVisible(true)
    } else {
      setEditVisible(false)
    }
  }, [value, moduleIndex])
  const handleUpload = (action: TAction, info: any, index?: number) => {
    let newValue = null
    if (action !== 'del') {
      newValue = {
        ...pick(info.info, ['width', 'height']),
        url: info.url,
      }
    }
    if (action === 'add') {
      images.push(newValue)
    } else if (action === 'replace') {
      images.splice(index, 1, newValue)
    } else if (action === 'del') {
      images.splice(index, 1)
    }
    handleSetDiyData()
  }

  const handleModuleOk = (action: TAction, info?: IDiyModule | null, index?: number) => {
    if (action === 'add') {
      modules.push(info)
      const newModuleIndex = modules.length - 1
      setAddVisible(false)
      onModuleIndexChange(newModuleIndex)
    } else if (action === 'replace') {
      modules.splice(index, 1, info)
    } else if (action === 'del') {
      if (info?.type === 'uploadVideo') {
        const typeExtraContent = info?.typeExtraContent
        const media = typeExtraContent?.media
        if (media?.url) {
          removeVideo(index)
        }
      }

      modules.splice(index, 1)
      if (moduleIndex === index) {
        onModuleIndexChange(-1)
      }
    }
    // handleSetDiyData('modules', modules)
    handleSetDiyData()
  }

  const handleModuleClick = (action: TAction, index: number, module?: IDiyModule) => {
    if (action === 'del') {
      handleModuleOk(action, module, index)
    }

    if (action === 'replace') {
      onModuleIndexChange(index)
      if (module?.module !== 'entry') {
        setEditVisible(true)
      }
    }
  }

  const handleSetDiyData = (color?: string) => {
    onSetData({
      backgroundImages: images,
      modules,
      backgroundColor: color || backgroundColor
    })
  }

  const handleEditModalCancel = () => {
    setEditVisible(false)
    onModuleIndexChange(-1)
  }
  return (
    <>
      <CollapseWrap title={i18n.t('decorate.diy.bgImgs')} desc={i18n.t('decorate.diy.bgImgsDesc')} visible={!images.length}>
        <div className='home-diy-content-item'>
          <div className='home-diy-item-bgs'>
            {
              images.map((bgInfo: IMedia, index: number) => (
                <ImageUploadWrap
                  key={`${bgInfo.url}_${index}`}
                  value={bgInfo.url}
                  onChange={(action: TAction, info: any) => handleUpload(action, info, index)}
                  maxSize={3}
                />
              ))
            }
            <ImageUploadWrap notShowImage={true} maxSize={3} onChange={handleUpload}/>
          </div>
        </div>
        <div className='home-diy-item-color'>
          <p className='name'>{i18n.t('decorate.diy.bgColor')}</p>
          <ColorInput
            color={backgroundColor}
            onChange={(res: any) => {
              handleSetDiyData(res.hex)
            }}
            onReset={() => {
              handleSetDiyData()
            }}
          />
        </div>
      </CollapseWrap>
      <CollapseWrap title={<><p style={{ marginRight: 8 }}>{i18n.t('decorate.diy.modules')}</p><Tooltip title={i18n.t('decorate.diy.moduleTip')} placement='bottomLeft'><i className="iconfont icon-information" /></Tooltip></>}>
        <div className="home-diy-content-item">
          <div className="home-diy-content-modules">
            {
              modules.map((module: IDiyModule, index: number) => (
                <ModuleItem key={`${module.name}_${index}`} value={module} handleModuleClick={(action) => handleModuleClick(action, index, module)} />
              ))
            }
            <ModuleItem handleModuleClick={(action) => setAddVisible(true)} />
          </div>
        </div>
      </CollapseWrap>
      {
        addVisible && (
          <ModuleAddModal
            tabMode={tabMode}
            visible={addVisible}
            onCancel={() => setAddVisible(false)}
            onOk={(info: IDiyModule) => handleModuleOk('add', info)}
          />
        )
      }
      {
        editVisible && (
          <ModuleEditModal
            moduleIndex={moduleIndex}
            moduleArr={modules}
            visible={editVisible}
            onCancel={handleEditModalCancel}
            onOk={(info: IDiyModule) => handleModuleOk('replace', info, moduleIndex)}
          />
        )
      }
    </>
  )
}

export default HomeDiyItem
