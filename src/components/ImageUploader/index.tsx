import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { ConfigProvider, message, Spin } from 'antd';
import axios from 'axios';
import enUS from '../../assets/locales/en-US';
import zhCN from '../../assets/locales/zh-CN';
import deDE from '../../assets/locales/de-DE';
import Icon from './Icons';
import ImageClipModal, { Crop } from './ImageClipModal';

const codeMap = {
  'zh-cn': zhCN,
  en: enUS,
  de: deDE,
};
export interface ImageUploaderProps {
  value?: string;
  notShowImage?: boolean;
  onChange: (info: any) => void;
  maxSize?: number; // 文件大小限制 MB
  videoSize?: number;  // 当要支持视频的时候，最大的MB
  disabled?: boolean;
  clip?: boolean; // 是否需要裁剪
  clipData?: Crop; // 裁剪数据
  extraData?: {
    brandId?: any;
    storeId?: any;
    token?: string;
    type?: string; // logo...
  };
  host: string;
  className?: string;
  style?: React.CSSProperties;
  accept?: string | string[];
  enableDelete?: boolean;
  /** 是否需要不能改变大小 */
  locked?: boolean;
  /** 是否需要动态判断值 */
  clipOptions?: { key: string, value: Crop, label: string }[]
  cropResultAppendHtml?: {
    top: number,
    left: number;
    component: JSX.Element,
    title?: string | React.ReactNode,
    width: number,
    height: number
  }
  cropViweRender?: (imageUrl: string) => React.ReactNode | null
  /** 在hover到图片需要出现的功能点，默认会有一个替换图片功能() */
  imgMarkList?: React.ReactNode
}

const prefixCls = 'dt-ui-image-uploader';
const ImageUploader: React.FC<ImageUploaderProps> = (props) => {
  const {
    value = '',
    notShowImage = false,
    onChange,
    className,
    maxSize = 5,
    videoSize = 30,
    disabled,
    clip,
    clipData,
    extraData = {},
    host,
    enableDelete = false,
    accept,
    locked = false,
    clipOptions,
    cropViweRender,
    imgMarkList
  } = props;
  const inputEl = useRef<any>(null);
  const [imageUrl, setImageUrl] = useState<string>(value);
  const [loading, setLoading] = useState(false);
  const [locale, setLocale] = useState(enUS);
  const [imageClipModalVisible, setImageClipModalVisible] = useState(false);
  const [imageClipUrl, setImageClipUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [theAccept] = useState(accept
    ? Array.isArray(accept)
      ? accept.join(', ')
      : accept.split(',').map(type => 'image/' + type).join(', ')
    : 'image/jpeg, image/png, image/gif, image/bmp');
  const [imgInfo, setImageInfo] = useState('image/png');
  /** TODO: 2022-1-10 与张超多次确认之后，删除upload接品，所有图片上传都用ProductUpload接口 */
  const uploadUrl = `${host}/imageUpload/productUpload`;
  // const uploadUrl =
  //   extraData.type === 'product'
  //     ? `${host}/imageUpload/productUpload`
  //     : `${host}/imageUpload/upload`;

  const handleImageChange = () => {
    const i = inputEl.current;
    if (i.files.length) {
      const file = i.files[0];
      const fileType =
        file.name && file.name.substr(file.name.lastIndexOf('.') + 1);
      const fileGenre = file.type && file.type.split('/')[0] || 'image';
      if (file.type) {
        setImageInfo(file.type)
      }
      if (file.size > 1024 * 1024 * (fileGenre === 'video' ? videoSize || maxSize : maxSize) ) {
        message.error(
          locale['img_max_size'].replace('{{size}}', String(fileGenre === 'video' ? videoSize || maxSize : maxSize))
        );
        return;
      }
      if (accept && !Array.isArray(accept) && !accept.split(',').includes(fileType)) {
        message.error(
          locale['accept_file_type'].replace('{{type}}', accept)
        );
        return;
      }
      setFileName(file.name);

      if (clip && fileType !== 'gif' && fileGenre !== 'video') {
        // gif 不可裁剪
        setImageClipModalVisible(true);
        setImageClipUrl(window.URL.createObjectURL(file));
        return;
      }
      handleUploadFile(file, fileGenre);
    }
  };

  const handleUploadFile = (file: any, fileGenre = 'image') => {
    setLoading(true);
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const data = e.target.result;
      if (fileGenre === 'video') {
        performUpload(file, fileGenre);
      } else {
        // 加载图片获取图片真实宽度和高度
        const image = new Image();
        image.onload = () => {
          performUpload(file, fileGenre);
        };
        image.src = data; 
      }
    };
    reader.readAsDataURL(file);
  };

  const performUpload = (file: any, fileGenre = 'image') => {
    const reqData = new FormData();
    reqData.append('file', file);
    reqData.append('type', fileGenre === 'video' ? 'video' : extraData.type ? extraData.type : 'image');
    if (extraData.brandId) {
      reqData.append('brandId', String(extraData.brandId));
    }
    if (extraData.storeId) {
      reqData.append('storeId', String(extraData.storeId));
    }
    axios
      .post(uploadUrl, reqData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          token: extraData.token,
        },
      })
      .then((res: any) => {
        res = res.data || res;
        if (res.result.content.length) {
          const picInfo = res.result.content[res.result.content.length - 1];
          onChange({
            url: picInfo.url,
            type: fileGenre === 'video' ? 'video' : extraData.type ? extraData.type : 'image',
            vurl: picInfo.ETag || picInfo.etag,
            info: {
              height: picInfo.height,
              width: picInfo.width,
              name: file.name,
            },
          });
          setImageUrl(fileGenre === 'video' ? picInfo.ETag || picInfo.etag : picInfo.url);
        }
        setLoading(false);
        setImageClipModalVisible(false);
      })
      .catch(() => {
        setLoading(false);
        message.error(locale['upload_fail']);
      });
  }

  const handleDeleteImage = () => {
    setImageUrl('')
    onChange({
      url: '',
      info: {}
    })
  }

  const dataURLtoFile = (dataurl: any, filename: any) => {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const handleConfirmClip = (url: string) => {
    setImageClipModalVisible(false);
    const file = dataURLtoFile(url, fileName);
    if (file.size > 1024 * 1024 * maxSize) {
      message.error(
        locale['img_max_size'].replace('{{size}}', String(maxSize))
      );
      return;
    }
    handleUploadFile(file);
  };

  useEffect(() => {
    let isUnmount = false;
    if (!isUnmount) {
      setImageUrl(value);
    }
    return () => {
      isUnmount = true;
    };
  }, [value]);

  return (
    <ConfigProvider locale={enUS as any}>
      <div>
            <div
              className={classNames(
                prefixCls,
                className,
                disabled ? 'disabled' : ''
              )}
            >
              <Spin spinning={loading} tip={locale['uploading']}>
                <div className={`${prefixCls}-area`}>
                  {imageUrl && !notShowImage ? (
                    <div className="upload-img">
                      <img src={imageUrl} />
                      {!disabled ? (
                        <div className="img-mask">
                          <span>{locale['image_replace']}</span>
                          { imgMarkList || null }
                        </div>
                      ) : null}
                    </div>
                  ) : (
                    <div className="upload-img">
                      <Icon type="icon-image" style={{ fontSize: '28px' }} />
                    </div>
                  )}
                  <input
                    type="file"
                    ref={inputEl}
                    onClick={(e: any) => {
                      e.target.value = null;
                    }}
                    onChange={handleImageChange}
                    disabled={disabled}
                    accept={theAccept}
                  />
                  {
                    imageUrl && !notShowImage && enableDelete && (
                      <span className="image-delete" onClick={handleDeleteImage}>
                        <Icon type="icon-close"></Icon>
                      </span>
                    )
                  }
                </div>
              </Spin>
            </div>
            {clip && imageClipModalVisible && (
              <ImageClipModal
                title={locale['image_clip']}
                url={imageClipUrl}
                clipData={clipData}
                locked={locked}
                clipOptions={clipOptions}
                cropResultAppendHtml={props.cropResultAppendHtml}
                visible={imageClipModalVisible}
                onCancel={() => setImageClipModalVisible(false)}
                onConfirm={handleConfirmClip}
                imgInfo={ imgInfo }
                cropViweRender={ cropViweRender }
              />
            )}
          </div>
    </ConfigProvider>
  );
};

export default ImageUploader;