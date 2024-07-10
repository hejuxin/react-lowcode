import React, { useState, useEffect, useMemo } from 'react'
import { Tabs, Input, Radio, Tooltip, Button } from 'antd';
import { getHomeEntriesArr, getHomeEntriesItemDisable } from '../../../utils/decoration'
import { WrapContainer, ContentWrapper } from '../../../components'
import './index.scss'
import classNames from 'classnames';
interface IProps {
  visible: boolean
  onCancel: () => void
  onOk: (info: IDiyModule) => void
  value?: IDiyModule
  tabMode: ITabMode
}
type IModuleName = {
  value: string;
  isWrite: boolean;
}

const ModuleAddModal: React.FC<IProps> = props => {
  const { visible, onCancel, onOk, value, tabMode } = props
  const defaultModuleName = '热区名称'
  const [tab, setTab] = useState<IDiyModuleTab>('entry')
  const [name, setName] = useState<IModuleName>({ value: defaultModuleName, isWrite: false })
  const [radio, setRadio] = useState(value?.type || '')
  const [disable, setDisable] = useState<boolean>(false)
  const [entriesErr, setEntriesErr] = useState<string>('')

  useEffect(() => {
    return () => {
      setRadio('')
      setName({ value: defaultModuleName, isWrite: false })
    }
  }, [])

  const getEntriesArr = useMemo(() => {
    let arr: string[] = []
    if (tab === 'entry') {
      arr = getHomeEntriesArr(tabMode) as string[]
    } else if (tab === 'member') {
      arr = ['memberBenefits', 'memberInfo', 'memberPointsCard']
    } else if (tab === 'extend') {
      arr = ['uploadVideo', 'reservedPhone', 'imgUrl']
    }
    return arr
  }, [tab])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value) {
      setName({ value, isWrite: true })
    } else {
      setName({ value: i18n.t(`decorate.diy.${radio}`), isWrite: false })
    }
  }

  const handleRadioChange = (e: any) => {
    const value = e.target.value
    setRadio(value)
    if (!name.value || name.value && !name.isWrite) {
      setName({ value: tab === 'entry' ? i18n.tbo(`decorate.${value}`) : i18n.t(`decorate.diy.${value}`), isWrite: false })
    }
    const entriesDisable = getHomeEntriesItemDisable(value, tabMode)
    setDisable(entriesDisable.disable)
    setEntriesErr(entriesDisable.errStr)
  }

  const handleTopTabsChange = (key: string) => {
    setTab(key as IDiyModuleTab)
    setName({ value: defaultModuleName, isWrite: false })
    setRadio('')
    setEntriesErr('')
    setDisable(false)
  }

  const getDefaultValue = () => {
    const defaultSize = 100
    const reviewContentWidth = 375
    const ctxPadding = 10
    const diyReviewContent: any = document.querySelector('.page-review-list-diy')
    const diyReviewContentClientHeight = diyReviewContent?.clientHeight || 1
    const scrollY = diyReviewContent.scrollTop
    const defaultStyle = {
      width: defaultSize,
      height: defaultSize,
      left: (reviewContentWidth + 2 * ctxPadding - defaultSize) / 2,
      top: (diyReviewContentClientHeight - defaultSize) / 2 + scrollY,
    }
    let newValue = { name: name.value, module: tab, type: radio, typeExtraContent: {}, style: defaultStyle }
    if (tab === 'extend') {
      if (radio === 'uploadVideo') {
        newValue.typeExtraContent = {
          media: {
            url: '',
            width: 0,
            height: 0,
            type: 'video'
          },
          style: defaultStyle
        }
      }
      if (radio === 'reservedPhone') {
        newValue.typeExtraContent = {
          phone: '',
          style: defaultStyle
        }
      }
      if (radio === 'imgUrl') {
        newValue.typeExtraContent = {
          url: '',
          style: defaultStyle
        }
      }
    }
    if (tab === 'member') {
      if (radio === 'memberBenefits') {
        newValue.style = {
          ...defaultStyle,
          width: 300,
          height: 140,
          left: (reviewContentWidth + 2 * ctxPadding - 300) / 2,
        }
      }
      if (radio === 'memberPointsCard') {
        newValue.style = {
          ...defaultStyle,
          width: 242,
          height: 31,
          left: (reviewContentWidth + 2 * ctxPadding - 242) / 2,
        }
      }
    }

    return newValue
  }

  const handleSureBtnClick = () => {
    if (!disable) {
      const value = getDefaultValue()
      onOk(value)
    }
  }

  const handleCancel = () => {
    onCancel()
  }

  const tooltip = () => {
    return <>该名称仅在后台可见，帮助配置者识别内容</>
  }

  const getTabName = (tab: IDiyModuleTab) => {
    let name = '';
    switch (tab) {
      case 'entry': {
        name = '快捷入口';
        break;
      }
      case 'extend': {
        name = '扩展模块';
        break;
      }
      case 'member': {
        name = '会员营销'
        break
      }
      default:
        break;
    }

    return name;
  }

  return (
    <ContentWrapper isShow={visible} handleCancel={handleCancel} wrapClassName='diy-content'>
      <Tabs className="top-tabs" activeKey={tab} onChange={handleTopTabsChange} >
        {
          (['entry', 'extend'].filter(Boolean) as IDiyModuleTab[]).map(tab => {
            return (
              <Tabs.TabPane key={tab} tab={getTabName(tab)}>
                <WrapContainer title18='moduleName' tooltip={tooltip()} tooltipIcon='icon-information'>
                  <Input placeholder={name.isWrite ? defaultModuleName : name.value} value={name.isWrite ? name.value : ''} onChange={handleInputChange} />
                </WrapContainer>
                <WrapContainer title18='moduleEntry'>
                  {
                    entriesErr && <div className='entries-tips'>{entriesErr}</div>
                  }
                  <Radio.Group className='radio-box' value={radio} onChange={handleRadioChange}>
                    {
                      getEntriesArr.map(entry => (
                        <Radio.Button
                          className={`radio-box-item${getEntriesArr.length < 3 ? ' radio-box-item-max' : ''}`}
                          key={entry}
                          value={entry}>
                          {
                            tab === 'entry' ? (
                              <>
                                {i18n.tbo(`decorate.${entry}`)}
                                {entry === 'scancode' ? (
                                  <Tooltip title={'调起顾客摄像头，引导顾客扫桌码点单。'} placement='bottomLeft'>
                                    <i className="iconfont icon-information" />
                                  </Tooltip>
                                ) : <></>
                                }
                              </>
                            ) : (
                                i18n.t(`decorate.diy.${entry}`)
                              )
                          }
                        </Radio.Button>
                      ))
                    }
                  </Radio.Group>
                </WrapContainer>
              </Tabs.TabPane>
            )
          })
        }
      </Tabs>
      {
        radio && (
          <div className='btn-box'>
            <div className='btn' onClick={handleCancel}>{i18n.t('common.cancel')}</div>
            <div className={classNames('btn btn-primary', { 'btn-disable': disable })} onClick={handleSureBtnClick}>{i18n.t('common.confirm')}</div>
          </div>
        )
      }
    </ContentWrapper>
  )
}

export default ModuleAddModal
