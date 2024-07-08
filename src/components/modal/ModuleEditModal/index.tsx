import React, { useState, useEffect, useMemo } from 'react'
import { Input } from 'antd';
import { WrapContainer, ContentWrapper, WrapUpload } from '../..'
// import BrandStoryIntroModal from '@pages/mobile/decoration/modal/BrandStoryIntroModal'
import './index.scss'
interface IProps {
  visible: boolean
  onCancel: () => void
  onOk: (info: IDiyModule) => void
  value?: IDiyModule
  moduleIndex: number
  moduleArr: IDiyModule[]
}

const ModuleEditModal: React.FC<IProps> = props => {
  const { visible, onCancel, onOk, value, moduleIndex, moduleArr } = props
  const [tab, setTab] = useState<IDiyModuleTab>('entry')
  const [radio, setRadio] = useState(value?.type || '')
  const [addModalVisible, setAddModalVisible] = useState(false)

  useEffect(() => {
    return () => {
      setRadio('')
      setTab('entry')
    }
  }, [])

  const moduleInfo = useMemo(() => {
    return moduleArr[moduleIndex]
  }, [moduleArr, moduleIndex])

  const moduleMediaInfo = useMemo(() => {
    const media = moduleInfo?.typeExtraContent?.media
    return media
  }, [moduleInfo])

  useEffect(() => {
    setTab(moduleInfo?.module || 'entry')
    setRadio(moduleInfo?.type || '')
  }, [moduleInfo])

  const marks = {
    fontSize: { 12: i18n.t('decorate.fontsizeMarks.small'), 14: i18n.t('decorate.fontsizeMarks.middle'), 16: i18n.t('decorate.fontsizeMarks.big') },
    spaceSize: { 12: i18n.t('decorate.fontsizeMarks.small'), 14: i18n.t('decorate.fontsizeMarks.middle'), 16: i18n.t('decorate.fontsizeMarks.big') },
    iconSize: { 52: i18n.t('decorate.fontsizeMarks.small'), 70: i18n.t('decorate.fontsizeMarks.middle'), 88: i18n.t('decorate.fontsizeMarks.big') }
  }

  const handleTypeExtraChange = (keyName: 'media' | any, keyStyle: 'fontSize' | 'fontWeight', keyValue: number | any) => {
    let newValue = {
      ...moduleInfo,
      typeExtraContent: {
        ...moduleInfo?.typeExtraContent,
        [keyName]: keyValue
      }
    }

    onOk(newValue)
  }

  const allTypeExtraChange = (typeExtraContent: IDiyModuleExtraContent | any) => {
    onOk({ ...moduleInfo, typeExtraContent })
  }

  return (
    <ContentWrapper isShow={visible} handleCancel={onCancel}>
      {/* {
        tab === 'member' ? (
          <>
            {
              radio === 'memberBenefits' && (
                <MemberBenefitContent extraContent={moduleInfo?.typeExtraContent} onChange={(info: IDiyModuleExtraContent) => allTypeExtraChange(info)}></MemberBenefitContent>
              )
            }
            {
              radio === 'memberInfo' && (
                <MemberInfoContent extraContent={moduleInfo?.typeExtraContent} onChange={(info: IDiyModuleExtraContent) => allTypeExtraChange(info)}></MemberInfoContent>
              )
            }
            {
              radio === 'memberPointsCard' && (
                <MemberPointsContent moduleInfo={moduleInfo} onChange={(info: IDiyModule) => onOk(info)}></MemberPointsContent>
              )
            }
          </>
        ) : (
          <></>
        )
      } */}
      {
        tab === 'extend' ? (
          <>
            {
              radio === 'uploadVideo' && (
                <WrapContainer title18={tab === 'extend' ? radio !== 'uploadVideo' ? 'customImg' : 'customVideo' : 'memberBg'} subtitle18={tab === 'extend' ? radio !== 'uploadVideo' ? 'customImg' : 'customVideo' : ''}>
                  <WrapUpload data={moduleMediaInfo || {} as IMedia} btnText={`${moduleMediaInfo?.url ? i18n.t('common.replace') : i18n.t('common.add')}${moduleMediaInfo?.type !== 'video' ? i18n.t('common.img') : i18n.t('common.video')}`} showImg={true} accept={moduleMediaInfo?.type !== 'video' ? ['image/*'] : ['video/mp4']} onChange={info => handleTypeExtraChange('media', 'fontSize', info)}/>
                </WrapContainer>
              )
            }
            {
              radio === 'reservedPhone' ? (
                <WrapContainer title18='customPhone' subtitle18='customPhone'>
                  <Input value={moduleInfo?.typeExtraContent?.phone} onChange={(e) => handleTypeExtraChange('phone', 'fontSize', e.target.value)} />
                </WrapContainer>
              ) : radio === 'imgUrl' ? (
                <WrapContainer title18='customLink' subtitle18='customLink'>
                  <Input value={moduleInfo?.typeExtraContent?.url} onChange={(e) => handleTypeExtraChange('url', 'fontSize', e.target.value)} />
                  <p className='content-title-sub' onClick={() => {
                    setAddModalVisible(true)
                  }}>{i18n.t('decorate.WrapContainerSub.customCopyLinkDsc')}</p>
                  {/* {
                    addModalVisible && (<BrandStoryIntroModal
                      visible={addModalVisible}
                      handleCancel={() => setAddModalVisible(false)}
                    />)
                  } */}
                </WrapContainer>
              ) : <></>
            }
          </>
        ) : (
          <></>
        )
      }
    </ContentWrapper>
  )
}

export default ModuleEditModal
