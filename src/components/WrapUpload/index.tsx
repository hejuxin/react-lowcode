import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle, useMemo, ForwardRefRenderFunction } from 'react'
import { Spin } from 'antd';
import { WrapItemBlock } from '..'
import './index.scss'
import { fetchFileUpload } from '@/services/file';
interface IProps {
  accept?: string[]
  max?: number
  btnText: string
  showImg?: boolean
  onChange?: (info: { type: 'img' | 'video', url: string, width?: number | null, height?: number | null }) => void
  data: IMedia
}

const WrapUpload: ForwardRefRenderFunction<unknown, IProps> = (props, ref) => {
  const { data, max = 30 * 1000 * 1000, btnText, accept = ['image/*', 'video/mp4'], showImg = false, onChange } = props
  const [url, setUrl] = useState<string>(data.url || '')
  const [type, setType] = useState<'img' | 'video'>(data.type || 'img')
  const [loading, setLoading] = useState<boolean>(false)

  const uploadRef = useRef(null)

  const mediaUrl = useMemo(() => {
    return data.url || url
  }, [data, url])

  const handleUploadBtnClick = () => {
    if (uploadRef.current) {
      (uploadRef.current as any).click()
    }
  }
  const beforeUpload = (event: any) => {
    const file = event.target.files?.[0]
    if (!file || ((file?.size || 0) > max)) return

    setLoading(true)
    const fileType = file.type === 'video/mp4' ? 'video' : 'img'
    setType(fileType)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', file.type === 'video/mp4' ? 'video' : 'product')
    formData.append('brandId', localStorage.getItem('ls.lastBrandId') || '')
    fetchFileUpload(formData).then((res: any) => {
      const { error, result } = res
      setLoading(false)
      if (!error) {
        // if (result.content?.length) {
        //   const mediaContent = result.content[0]
        //   const mediaUrl = mediaContent?.url
        //   setUrl(mediaUrl)
        //   onChange && onChange({ type: fileType, url: mediaUrl, width: mediaContent?.width || null, height: mediaContent?.height || null })
        // }
        // todo 视频上传
        console.log(result, 'result')
      }
    })
  }

  const handleDelete = () => {
    setUrl('')
    onChange && onChange({ type: 'img', url: '' })
  }

  useImperativeHandle(ref, () => ({
    handleDelete,
  }));

  return (
    <>
      <WrapItemBlock>
        <Spin spinning={loading}>
          <div className="upload-item">
            <input type="file" className='upload-item-input' ref={uploadRef} onChange={beforeUpload} accept={accept.join(',')} />
            {
              type === 'img' && mediaUrl && (
                <img src={`${mediaUrl}${type === 'img' ? '' : '?x-oss-process=video/snapshot,t_1000,m_fast'}`} alt="" className="upload-img"/>
              )
            }
            {
              type === 'video' && mediaUrl && (
                showImg ? (
                  <img src={`${mediaUrl}?x-oss-process=video/snapshot,t_1000,m_fast`} alt="" className="upload-img" />
                ) : (
                  <video src={mediaUrl} className="upload-video" controls autoPlay muted loop/>
                )
              )
            }
            <div className="upload-btn" onClick={handleUploadBtnClick} dangerouslySetInnerHTML={{ __html: btnText }}></div>
            {
              // url && <div className="delete-btn" onClick={handleDelete}>删除</div>
            }
          </div>
        </Spin>
      </WrapItemBlock>
    </>
  )
}

export default forwardRef(WrapUpload)
