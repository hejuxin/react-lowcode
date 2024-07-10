import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import classNames from 'classnames'
import './index.scss'
import { deepClone, setCSSProperty } from '@/utils'
// import { MemberCard } from '@/pages/mobile/decoration/components'
// import { toPrice } from '@/utils/format/price'
import { isNumber } from 'lodash'
import Tabbar from './Tabbar'
// import PointsCardLayout from './PointsCardLayout'

// import memberImg from '@/assets/img/decoration/mkt/member.png'
// import { mockTabbarData } from '../../mock'

interface IProps {
  value: IHomeDiyDetailItem
  onSetData: (value: IHomeDiyDetailItem) => void
  type: ITabMode
  wxAmpLinkList: any[]
  isBrand: boolean
  moduleIndex: number
  onModuleIndexChange: (index: number) => void
}

type IDragType = 'module' | 'media'
type IScaleType = 'scaleRatio' | 'scaleX' | 'scaleY'

const defaultTabBarSetting = ['home', 'meals', window.bo === 'cn' && 'mall', 'orders', 'gifts', 'my'].filter(Boolean) as string[]

const HomeReview: React.FC<IProps> = props => {
  const { type, moduleIndex, onModuleIndexChange, value, onSetData } = props
  // const ctxPadding = 10
  const ctxPadding = 0
  const reviewContentWidth = 375
  const isActive = true
  const contextRef = useRef(null)
  const imgRef = useRef(null)

  const { modules, backgroundImages, backgroundColor = '#fff' } = value || {}
  // const ctx: any = document.getElementById('canvas')
  useEffect(() => {
    if (!contextRef.current) {
      const ctx: any = document.getElementById('canvas')
      const context = ctx?.getContext('2d')
      contextRef.current = context
      // ctx.onmousedown = e => {
      //   const x = e.offsetX
      //   const y = e.offsetY
      //   const index = getStatus(x, y)
      //   console.log(index, 'index');

      //   ctx.onmousemove = e => {
      //     const x = e.offsetX
      //     const y = e.offsetY
      //     console.log(x, y, 'mouseMove');
      //   }
      // }

      // ctx.onmouseup = e => {
      //   ctx.onmousedown = null
      //   ctx.onmousemove = null
      // }
    }
    // contextRef.current.strokeStyle = 'blue'
    // contextRef.current.strokeRect(0, 0, 100, 100)
  }, [])

  const getModulesColor = useCallback((module: IDiyModule) => {
    let color = 'rgba(255, 93, 93, 0.8)'
    const theModule = module.module
    const { type, typeExtraContent } = module
    let opacity = 0.8
    if (type === 'uploadVideo' && typeExtraContent?.media?.url || type === 'memberBenefits' || type === 'memberInfo' || type === 'memberPointsCard') {
      opacity = 0
    }
    switch (theModule) {
      case 'entry': color = `rgba(255, 93, 93, ${opacity})`; break;
      case 'member': color = `rgba(247, 178, 37, ${opacity})`; break;
      case 'extend': color = `rgba(72, 88, 205, ${opacity})`; break;
    }
    return color
  }, [])

  const getModulePosition = (module: IDiyModule) => {
    const _context: any = contextRef.current
    const { style } = module
    // const defaultX = (_context.canvas.width - (style?.width || 100)) / 2
    // const moduleX = style?.left || defaultX
    const moduleX = style?.left || ctxPadding
    const moduleY = style?.top || 0

    return {
      moduleX,
      moduleY
    }
  }
  const moduleScaleIconObj = useCallback((index?: number) => {
    if (contextRef.current) {
      const _index = isNumber(index) ? index : moduleIndex
      const iconSize = 10
      const modulesArr = modules || []
      const module = modulesArr[_index!]
      const moduleStyle = module?.style || {}
      // const { moduleX, moduleY } = getModulePosition(module)
      const { width = 0, height = 0, left = ctxPadding, top = 0 } = moduleStyle
      const _context: any = contextRef.current
      // const defaultX = (_context.canvas.width - (width || 100)) / 2
      // const moduleX = left || defaultX
      const moduleX = left
      const moduleY = top
      const sizeObj = {
        width: iconSize,
        height: iconSize
      }
      const iconObj = {
        scaleX: {
          x: moduleX + width - (iconSize / 2),
          y: moduleY + height / 2 - (iconSize / 2),
          x1: moduleX + width - (iconSize / 2) + iconSize,
          y1: moduleY + height / 2 - (iconSize / 2) + iconSize,
          ...sizeObj
        },
        scaleY: {
          x: moduleX + width / 2 - (iconSize / 2),
          y: moduleY + height - (iconSize / 2),
          x1: moduleX + width / 2 - (iconSize / 2) + iconSize,
          y1: moduleY + height - (iconSize / 2) + iconSize,
          ...sizeObj
        },
        scaleRatio: {
          x: moduleX + width - (iconSize / 2),
          y: moduleY + height - (iconSize / 2),
          x1: moduleX + width - (iconSize / 2) + iconSize,
          y1: moduleY + height - (iconSize / 2) + iconSize,
          ...sizeObj
        }
      }
      return iconObj
    } else {
      const obj = {
        x: 0,
        y: 0,
        x1: 0,
        y1: 0,
        width: 0,
        height: 0
      }
      return {
        scaleRatio: obj,
        scaleX: obj,
        scaleY: obj
      }
    }
  }, [moduleIndex, modules, contextRef.current])

  useEffect(() => {
    draw()
    // if (modules && modules[moduleIndex]?.type === 'memberBenefits' && (modules[moduleIndex]?.style.width < 290 || modules[moduleIndex]?.style.height < 140)) {

    // } else {
    //   draw()
    // }
  }, [modules, moduleIndex])

  useEffect(() => {
    const cssMap = {
      '--dr-theme-bg-color': backgroundColor,
    }
    setCSSProperty('.home-page-review', cssMap)
  }, [backgroundColor])

  const draw = () => {
    const _context: any = contextRef.current
    const ctx = _context.canvas
    _context.clearRect(0, 0, reviewContentWidth + 2 * ctxPadding, ctx.height)
    // const isDrawFinish = drawImage()
    // console.log(isDrawFinish, 'isDrawFinish')
    drawModules()

    const modulesArr = modules || []
    ctx.onmousedown = (e: MouseEvent) => {
      const downX = e.offsetX
      const downY = e.offsetY
      let { index, drag, dragType, scale, scaleType } = deepClone(getStatus(downX, downY))
      onModuleIndexChange(index)
      // if (index > -1 && drag) {
      //   const module = modulesArr[index]
      //   const moduleStyle = module.style
      //   const { moduleX, moduleY } = getModulePosition(module)
      //   const diyReviewContent: any = document.querySelector('.page-review-list-diy')
      //   const diyReviewContentClientHeight = diyReviewContent?.clientHeight || 1
      //   const scrollY = moduleY + moduleStyle.height - diyReviewContentClientHeight
      //   const canvasHeight = ctx.height
      //   if (diyReviewContent.scrollTop !== scrollY) {
      //     const _y = (canvasHeight - moduleStyle.height) / 2 - moduleY - diyReviewContentClientHeight
      //     // resetScrollTop(scrollY)
      //   }
      // }
      ctx.onmousemove = (e: MouseEvent) => {
        const moveX = e.offsetX
        const moveY = e.offsetY
        if (index > -1) {
          const newModules = deepClone(modulesArr)
          const module = newModules[index]
          const moduleStyle = module.style
          const { moduleX, moduleY } = getModulePosition(module)
          if (drag || scale) {
            const boundaryInfo = { downX, downY, moveX, moveY, module }
            if (drag) {
              if (dragType === 'module') {
                const { left, top } = getDragBoundary(boundaryInfo)
                module.style = {
                  ...moduleStyle,
                  left,
                  top
                }
              }
              // else if (dragType === 'media') {
              //   const mediaStyle = module.typeExtraContent.style
              //   let mediaX = moveX - downX + (mediaStyle.left || 0)
              //   let mediaY = moveY - downY + (mediaStyle.top || 0)
              //   const mediaWidth = 50
              //   const mediaHeight = 50
              //   if (mediaX < 0) {
              //     mediaX = 0
              //   } else if (mediaX + mediaWidth > moduleStyle.width) {
              //     mediaX = moduleStyle.width - mediaWidth
              //   }

              //   if (mediaY < 0) {
              //     mediaY = 0
              //   } else if (mediaY + mediaHeight > moduleStyle.height) {
              //     mediaY = moduleStyle.height - mediaHeight
              //   }

              //   module.typeExtraContent = {
              //     ...module.typeExtraContent,
              //     style: {
              //       ...mediaStyle,
              //       left: mediaX,
              //       top: mediaY
              //     }
              //   }
              // }
            }
            if (scale) {
              const { width, height } = getScaleBoundary({
                ...boundaryInfo,
                scaleType
              })
              module.style = {
                ...moduleStyle,
                left: moduleX,
                top: moduleY,
                width,
                height
              }
            }

            setDiyContent({
              modules: newModules
            })
          }
        }
      }
      document.onmouseup = e => {
        drag = false
        scale = false
      }
    }
  }

  const setDiyContent = (newVal: { [key: string]: any }) => {
    onSetData({
      ...value,
      ...newVal
    })
  }

  useEffect(() => {
    let _height = 0
    const _context: any = contextRef.current
    backgroundImages?.forEach((bgInfo: IMedia) => {
      const { width = 1, height = 1 } = bgInfo
      _height += (height / (width / reviewContentWidth))
    })
    if (_context) {
      if (backgroundImages?.length) {
        if (Math.ceil(_height) > 800) {
          _context.canvas.height = Math.ceil(_height)
        } else {
          _context.canvas.height = 800
        }
      } else {
        _context.canvas.height = 800
      }
      draw()
    }
  }, [backgroundImages])

  const drawModules = () => {
    const modulesArr = modules || []
    // 图片资源 todo
    // let img: any = ''
    // if (!imgRef.current) {
    //   img = new Image()
    //   imgRef.current = img
    // } else {
    //   img = imgRef.current
    // }
    // const videoList: any = document.querySelector('.diy-video-list')
    // const videoListIdArr: number[] = []
    // videoList.childNodes.forEach((child: any) => {
    //   const id = child.id
    //   const idIndex = id.slice(-1)
    //   videoListIdArr.push(Number(idIndex))
    // })
    modulesArr.forEach((module: IDiyModule, index: number) => {
      const { moduleX, moduleY } = getModulePosition(module)
      const { style } = module
      strokeColorRect({ x: moduleX, y: moduleY, width: style.width, height: style.height, color: getModulesColor(module) })
      // _context.font = '20px Georgia'
      // if (module.module === 'member') {
      //   drawMemberModules(module)
      // } else if (module.module === 'extend') {
      //   drawExtendModules(module, index)
      // } else {
      //   drawModuleName(module)
      //   // removeVideo(videoListIdArr, index)
      // }
      if (module.module === 'extend') {
        drawExtendModules(module, index)
      } else {
        drawModuleName(module)
        // removeVideo(videoListIdArr, index)
      }
      if (index === moduleIndex) {
        drawScaleIcon()
      }
    })
  }

  // 入口模块（模块名字）
  const drawModuleName = (module: IDiyModule, style?: { color: string, fontSize: number }) => {
    const _context: any = contextRef.current
    const { moduleX, moduleY } = getModulePosition(module)
    _context.fillStyle = '#fff'
    _context.font = '20px Georgia'
    _context.fillText(module.name, moduleX, moduleY + 20)
  }

  // // 会员模块
  // const drawMemberModules = (module: IDiyModule, index?: number) => {
  //   if (module.type === 'memberBenefits' || module.type === 'memberInfo' || module.type === 'memberPointsCard') {
  //     setMemberModule(type, module.type, module)
  //   }
  // }

  // 扩展模块
  const drawExtendModules = (module: IDiyModule, index: number) => {
    const { type, typeExtraContent } = module
    // if (type === 'imgUrl') {
    //   const media = typeExtraContent?.media
    //   const mediaStyle = typeExtraContent?.style
    //   if (img.src === media?.url) {
    //     isLoad = true
    //   } else {
    //     img.src = media?.url
    //     isLoad = false
    //   }
    //   const mediaLeft = mediaStyle?.left || 0
    //   const mediaTop = mediaStyle?.top || 0
    //   console.log(img.width, img.height, 'img', moduleX, moduleX + mediaLeft, mediaTop)

    //   if (isLoad) {
    //     _context.drawImage(img, moduleX + mediaLeft, moduleY + mediaTop, 50, 50)
    //   } else {
    //     img.onload = () => {
    //       isLoad = true
    //       _context.drawImage(img, moduleX + mediaLeft, moduleY + mediaTop, 50, 50)
    //     }
    //   }
    // }
    if (type === 'uploadVideo') {
      drawVideo(module, index)
    } else {
      drawModuleName(module)
    }
  }

  const drawVideo = (module: IDiyModule, index: number) => {
    const { style, typeExtraContent } = module
    const media = typeExtraContent?.media
    const { moduleX, moduleY } = getModulePosition(module)
    const _context: any = contextRef.current
    if (media?.url) {
      let theVideo: any = document.getElementById(`video${index}`)
      let video: any = ''
      if (!theVideo) {
        video = document.createElement('video')
        video.id = `video${index}`
        // video.style = {
        //   position: 'absolute',
        //   left: moduleX,
        //   top: moduleY,
        //   width: style.width,
        //   height: style.height
        // }
        const videoList: any = document.querySelector('.diy-video-list')
        video.src = media?.url
        videoList.appendChild(video)
      } else {
        video = theVideo
        if (video.src !== media?.url) {
          video.src = media?.url
        }
      }
      video.width = style.width
      video.height = style.height
      video.preload = true
      video.autoplay = true
      video.loop = true
      video.controls = true
      video.muted = true
      video.style = `position: absolute; left: ${moduleX - ctxPadding}px; top: ${moduleY}px; background-color: rgba(72, 88, 205, 0.8)`
    } else {
      drawModuleName(module)
    }
  }

  const drawScaleIcon = () => {
    const moduleScaleIconArr = Object.values(moduleScaleIconObj())
    moduleScaleIconArr.forEach(iconItem => {
      strokeColorRect({
        ...iconItem,
        color: '#000'
      })
    })
  }

  // 查找当前点击的是哪个元素 及 进行什么操作（拖拽/缩放）
  const getStatus = (x: number, y: number) => {
    const modulesArr = modules || []
    let index: number = -1
    let drag = false
    let dragType: IDragType = 'module'
    let scale = false
    let scaleType: IScaleType = 'scaleRatio'
    if (!modulesArr.length) {
      return {
        index,
        drag,
        dragType,
        scale,
        scaleType
      }
    }
    for (let i = modulesArr.length - 1; i > -1; i--) {
      const module = modulesArr[i]
      const { moduleX, moduleY } = getModulePosition(module)
      const { style: { width, height }, typeExtraContent } = module
      const { scaleRatio, scaleX, scaleY } = moduleScaleIconObj(i)

      if ((scaleRatio.x < x && x < scaleRatio.x1) && (scaleRatio.y < y && y < scaleRatio.y1)) {
        index = i
        drag = false
        scale = true
        scaleType = 'scaleRatio'
        break
      } else if ((scaleY.x < x && x < scaleY.x1) && (scaleY.y < y && y < scaleY.y1)) {
        index = i
        drag = false
        scale = true
        scaleType = 'scaleY'
        break
      } else if ((scaleX.x < x && x < scaleX.x1) && (scaleX.y < y && y < scaleX.y1)) {
        index = i
        drag = false
        scale = true
        scaleType = 'scaleX'
        break
      } else if ((moduleX < x && x < (moduleX + width)) && (moduleY < y && y < (moduleY + height))) {
        index = i
        drag = true
        scale = false
        // if (media && media.url) {
        //   if (((moduleX + mediaX) < x && x < (moduleX + mediaX + 50)) && ((moduleY + mediaY) < y && y < (moduleY + mediaY + 50))) {
        //     dragType = 'media'
        //   } else {
        //     dragType = 'module'
        //   }
        // } else {
        //   dragType = 'module'
        // }
        dragType = 'module'
        break
      }
    }

    return {
      index,
      drag,
      dragType,
      scale,
      scaleType
    }
  }

  const strokeColorRect = (args: { x: number, y: number, width: number, height: number, color?: string }) => {
    const { x, y, width, height, color } = args
    const _context: any = contextRef.current
    _context.strokeRect(x, y, width, height)
    _context.fillStyle = color
    _context.fillRect(x, y, width, height)
  }

  // (downX: number, downY: number, moveX: number, moveY: number, module: IDiyModule)
  // 拖拽边界处理
  const getDragBoundary = (args: any) => {
    const { downX, downY, moveX, moveY, module } = args
    const _context: any = contextRef.current
    const ctx = _context.canvas
    const ctxWidth = ctx.width - ctxPadding * 2
    const ctxHeight = ctx.height
    const { moduleX, moduleY } = getModulePosition(module)
    const moduleStyle = module.style

    const diyReviewContent: any = document.querySelector('.page-review-list-diy')
    const diyReviewContentClientHeight = diyReviewContent?.clientHeight || 1
    let left = moveX - downX + moduleX
    let top = moveY - downY + moduleY
    const scrollY = (top + moduleStyle.height - diyReviewContentClientHeight) || 0
    if (left < ctxPadding) {
      left = ctxPadding
    } else if (left + moduleStyle.width > ctxWidth) {
      left = ctxWidth - moduleStyle.width + ctxPadding
    }

    if (top < 0) {
      top = 0
      resetScrollTop(0)
    } else {
      if (top + moduleStyle.height > diyReviewContentClientHeight + diyReviewContent.scrollTop) {
        resetScrollTop(scrollY)
        if (top + moduleStyle.height > ctxHeight) {
          top = ctxHeight - moduleStyle.height
        } else {
          console.log(top, 'top', moduleStyle.top)
        }
      } else if (top < diyReviewContent.scrollTop) {
        resetScrollTop(top)
      }
    }

    return {
      left,
      top
    }
  }
  // 缩放边界处理
  const getScaleBoundary = (args: any) => {
    const { downX, downY, moveX, moveY, module, scaleType } = args
    const moduleStyle = module.style
    let width = moduleStyle.width
    let height = moduleStyle.height
    const { moduleX, moduleY } = getModulePosition(module)

    const _context: any = contextRef.current
    const ctx = _context.canvas
    const ctxWidth = ctx.width - ctxPadding * 2
    const ctxHeight = ctx.height

    const diyReviewContent: any = document.querySelector('.page-review-list-diy')
    const diyReviewContentClientHeight = diyReviewContent?.clientHeight || 1

    const minWidth = 50
    const minHeight = 50
    const _scrollHeight = 10

    if (scaleType === 'scaleRatio') {
      const ratio = moveX / downX
      width = moduleStyle.width * ratio
      height = moduleStyle.height * ratio
      const scrollY = (moduleY + height - diyReviewContentClientHeight) || 0

      if (width > height) {
        if (height < minHeight) {
          height = minHeight
          width = height / moduleStyle.height * moduleStyle.width
          // diyReviewContent.scrollTop = 0

          if (diyReviewContent.scrollTop !== scrollY) {
            resetScrollTop(scrollY)
          }
        }
      } else {
        if (width < minWidth) {
          width = minWidth
          height = width / moduleStyle.width * moduleStyle.height
        }

        if (moduleY + height + _scrollHeight > diyReviewContentClientHeight + diyReviewContent.scrollTop) {
          resetScrollTop(scrollY + _scrollHeight)
          if (moduleY + height > ctxHeight) {
            height = ctxHeight - moduleY
          } else {
            console.log(height, 'height')
          }
        } else if (moduleY + height - _scrollHeight < diyReviewContent.scrollTop) {
          resetScrollTop(moduleY + height - _scrollHeight)
        }
      }
    } else if (scaleType === 'scaleX') {
      width = moduleStyle.width + moveX - downX
      height = moduleStyle.height
      if (width < minWidth) {
        width = minWidth
      } else if (moduleX + width > ctxWidth) {
        width = ctxWidth - moduleX
      }
    } else if (scaleType === 'scaleY') {
      height = moduleStyle.height + moveY - downY
      width = moduleStyle.width
      const scrollY = (moduleY + height - diyReviewContentClientHeight) || 0
      if (height < minHeight) {
        height = minHeight
        resetScrollTop(0)
      } else {
        if (moduleY + height + _scrollHeight > diyReviewContentClientHeight + diyReviewContent.scrollTop) {
          resetScrollTop(scrollY + _scrollHeight)
          if (moduleY + height > ctxHeight) {
            height = ctxHeight - moduleY
          } else {
            console.log(height, 'height')
          }
        } else if (moduleY + height - _scrollHeight < diyReviewContent.scrollTop) {
          resetScrollTop(moduleY + height - _scrollHeight)
        }
      }
    }

    return {
      width,
      height
    }
  }

  // 容器滚动条
  const resetScrollTop = (top?: number) => {
    const diyReviewContent: any = document.querySelector('.page-review-list-diy')
    const diyReviewContentClientHeight = diyReviewContent?.clientHeight || 1
    const scrollTop = isNumber(top) ? top : 0
    diyReviewContent.scrollTop = scrollTop
  }

  const getMemberMargin = (align: string) => {
    if (align === 'left') {
      return '0 auto 0 0'
    } else if (align === 'center') {
      return '0 auto'
    } else {
      return '0 0 0 auto'
    }
  }
  return (
    <div className="page-review-wrapper home-page-review">
      {/* <p className="page-review-title">{i18n.t('decorate.configTab.home')}</p> */}
      <div className={classNames('page-review-container', { active: isActive })}>
        <div className={classNames('page-review-inner', { active: isActive })}>
          <div className="page-review-list" style={{ backgroundColor, paddingBottom: 0 }}>
            <div className='page-review-list-diy'>
              <div className="page-review-diy-bgs">
                {
                  (backgroundImages || []).map(bg => (
                    <img key={bg?.url} src={bg?.url} alt="" className='bg-item' />
                  ))
                }
                {
                  !backgroundImages?.length && <div className='empty'>
                    <p className='name'>{i18n.t('decorate.diy.bgImgs')}</p>
                    <p className='desc'>{i18n.t('decorate.diy.bgImgsDesc1')}</p>
                  </div>
                }
              </div>
              {/* <canvas id='canvas' width='395' height='800' className={classNames({ 'swiper-no-swiping': moduleIndex !== -1 })}></canvas> */}
              <canvas id='canvas' width={reviewContentWidth + 2 * ctxPadding} height='800' className={classNames({ 'swiper-no-swiping': isActive })}></canvas>
              <div className="diy-video-list"></div>
              {/* {memberBenefits?.type &&
                <div className="diy-member-benefit" style={{ left: `${memberBenefits.style.left}px`, top: `${memberBenefits.style.top}px`, width: `${memberBenefits.style.width}px`, height: `${memberBenefits.style.height}px` }}>
                  {memberBenefits?.typeExtraContent?.memberCard && <MemberCard cardInfo={memberBenefits.typeExtraContent.memberCard}></MemberCard>}
                </div>
              } */}
              {/* {memberInfo?.type &&
                <div className="diy-member-benefit" style={{ left: `${memberInfo.style.left}px`, top: `${memberInfo.style.top}px`, width: `${memberInfo.style.width}px`, height: `${memberInfo.style.height}px` }}>
                  {
                    memberInfo?.typeExtraContent?.memberInfo &&
                      <div className='diy-member-info' style={{ flexDirection: memberInfo.typeExtraContent.memberInfo.direction === 'row' && memberInfo.typeExtraContent.memberInfo.align === 'right' ? 'row-reverse' : memberInfo.typeExtraContent.memberInfo.direction, textAlign: memberInfo.typeExtraContent.memberInfo.align, alignItems: memberInfo.typeExtraContent.memberInfo.direction === 'row' ? 'center' : '' }}>
                        <div className='diy-member-info-img' style={{ backgroundImage: `url(${memberImg})`, width: `${memberInfo.typeExtraContent.memberInfo.avatarFontSize}px`, height: `${memberInfo.typeExtraContent.memberInfo.avatarFontSize}px`, margin: memberInfo.typeExtraContent.memberInfo.direction === 'column' ? getMemberMargin(memberInfo.typeExtraContent.memberInfo.align) : 0 }}></div>
                        {
                          memberInfo?.typeExtraContent?.memberInfo?.content !== 'avatar' &&
                          <>
                            <div className={`diy-member-info-text ${memberInfo.typeExtraContent.memberInfo.direction === 'row' ? 'diy-member-info-text-row' : 'diy-member-info-text-column'}`}>
                              <span className='diy-member-info-title' style={{ color: memberInfo.typeExtraContent.memberInfo.color, fontSize: `${memberInfo.typeExtraContent.memberInfo.nameFontSize}px`, lineHeight: `${memberInfo.typeExtraContent.memberInfo.nameFontSize}px` }}>{i18n.t('decorate.mkt.nickName')}</span>
                            </div>
                          </>
                        }
                      </div>
                  }
                </div>
              } */}
              {/* {
                memberPointsCard?.type && <div className="diy-member-benefit" style={{ left: `${memberPointsCard.style.left}px`, top: `${memberPointsCard.style.top}px`, width: `${memberPointsCard.style.width}px`, height: `${memberPointsCard.style.height}px` }}>
                  {memberPointsCard.typeExtraContent?.memberPointInfo && <PointsCardLayout pointInfo={memberPointsCard.typeExtraContent?.memberPointInfo}></PointsCardLayout>}
                </div>
              } */}
            </div>
          </div>
          <Tabbar data={{
            tabs: defaultTabBarSetting.map((item: string) => {
              const isInclude = ['meals', 'my'].includes(item)
              return {
                type: item,
                name: window?.i18n.tbo?.(`decorate.${item}`),
                icon: `tab-${item}new0`,
                pic: '',
                activePic: '',
                isShow: Number(isInclude),
                mode: 0 // 图标类型（0 系统图标 1 自定义）
              }
            }),
            enableName: 0, // 是否显示名称(0 不显示 1 显示)
            enablePosition: 0, // 是否悬浮(0 悬浮 1固定底部)
            backgroundColor: '#fff', // 背景颜色
            pagesShow: {} as { [type: string]: number }
          }} activeTab="home" />
        </div>
      </div>
    </div>
  )
}

export default HomeReview
