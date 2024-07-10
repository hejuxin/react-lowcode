import React, { useState, useEffect } from 'react';
import ReactCrop from 'react-image-crop';
import { Modal, Radio } from 'antd';
import enUS from '@/assets/locales/en-US';
import zhCN from '@/assets/locales/zh-CN';
import deDE from '@/assets/locales/de-DE';
import 'react-image-crop/dist/ReactCrop.css';

export interface Crop {
  aspect?: number;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  unit?: 'px' | '%';
}

export interface IImageClipModalProps {
  title?: string;
  clipData?: Crop;
  url: any;
  visible: boolean;
  onCancel: () => void;
  onConfirm: (value: any) => void;
  locked?: boolean
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
  imgInfo?: string
}

const prefixCls = 'dt-ui-image-uploader';

const defaultCrop = {
  unit: '%',
  width: 300,
} as Crop;

const localFormat: string = localStorage.getItem('i18nextLng') || 'zh-CN'

const ImageClipModal: React.FC<IImageClipModalProps> = (props) => {
  const { visible, url, onCancel, onConfirm, clipData, title, locked = false, clipOptions, cropResultAppendHtml, cropViweRender, imgInfo = 'image/png' } = props;
  const [crop, setCrop] = useState<Crop>(clipData || defaultCrop);
  const [imageRef, setImageRef] = useState('');
  const [croppedImageUrl, setCroppedImageUrl] = useState('');
  const [cropType, setCorpType] = useState<string>(clipOptions ? clipOptions[0].key : '')
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  const getCroppedImg = async (image: any, crop: any) => {
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const cropOnOriginalSize = {
      x: (crop.x | 0) * scaleX,
      y: (crop.y | 0) * scaleY,
      width: crop.width * scaleX,
      height: crop.height * scaleY,
    };

    canvas.width = cropOnOriginalSize.width;
    canvas.height = cropOnOriginalSize.height;
    if (context) {
      context.drawImage(
        image,
        cropOnOriginalSize.x,
        cropOnOriginalSize.y,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        cropOnOriginalSize.width,
        cropOnOriginalSize.height
      );
    }
    return canvas.toDataURL(imgInfo || 'image/png');
  };

  const handleImageLoaded = async (image: any) => {
    setImageRef(image);
    const initialCrop = { ...crop };
    if (initialCrop.aspect && initialCrop.width && initialCrop.unit === 'px') {
      initialCrop.height = initialCrop.width / initialCrop.aspect
    } else if (initialCrop.aspect && image.width / image.height < initialCrop.aspect) {
      initialCrop.width = image.width;
      initialCrop.height = (initialCrop.width || 0) / initialCrop.aspect;
    } else if (
      initialCrop.aspect &&
      image.width / image.height >= initialCrop.aspect
    ) {
      initialCrop.height = image.height;
      initialCrop.width = (initialCrop.height || 0) * initialCrop.aspect;
    } else if (!initialCrop.width && !initialCrop.height) {
      initialCrop.width = image.width;
      initialCrop.height = image.height;
    }
    const croppedImageUrl = await getCroppedImg(image, initialCrop);
    setCroppedImageUrl(croppedImageUrl);
  };

  const handleCropComplete = async (crop: any) => {
    if (imageRef && crop.width && crop.height) {
      const croppedImageUrl = await getCroppedImg(imageRef, crop);
      setCroppedImageUrl(croppedImageUrl);
    }
  };

  const handleConfirm = () => {
    setCroppedImageUrl('');
    onConfirm(croppedImageUrl);
  };

  const handleCancel = () => {
    setCroppedImageUrl('');
    onCancel();
  };

  const handleChangeCrop = (clip: { key: string, value: Crop }) => {
    if (clip.key === 'auto') {
      setCrop({ ...crop, aspect: undefined })
    } else {
      setCrop(clip.value)
    }
  }

  useEffect(() => {
    setCrop(clipData || defaultCrop);
  }, [visible]);

  return (
    <Modal
      title={title}
      visible={visible}
      onCancel={handleCancel}
      onOk={handleConfirm}
    >
      <div className={`${prefixCls}-clip`}>
        <div className="crop-handle">
          <ReactCrop
            crop={crop as any}
            locked={ locked }
            onComplete={handleCropComplete}
            onChange={(c: any) => setCrop(c)}
          >
            <img src={url} onLoad={handleImageLoaded} />
          </ReactCrop>
          {clipOptions && (
            <div className="change-clip-radio-group">
              <span>{ localFormat === 'zh-CN' ? zhCN.clip_rate : enUS.clip_rate }</span>
              <div className="radio-list">
                {(clipOptions || []).map((clip, index) => {
                  return (<div key={index} onClick={() => handleChangeCrop(clip)}>
                    <Radio checked={cropType === clip.key} onChange={() => setCorpType(clip.key)}>{ clip.label }</Radio>
                  </div>)
                }) }
              </div>
            </div>
          ) }
        </div>
        {cropResultAppendHtml && (<div className="crop-view">
          <h3>{ cropResultAppendHtml.title }</h3>
          {cropResultAppendHtml.component}
          {croppedImageUrl && (
            <div style={{
              height: `${cropResultAppendHtml.height}px`,
              width: `${cropResultAppendHtml.width}px`,
              position: 'absolute',
              top: cropResultAppendHtml.top,
              left: cropResultAppendHtml.left
            }}>
              <img
                alt="Crop"
                style={{ maxWidth: '100%', height: '100%', objectFit: 'contain' }}
                src={croppedImageUrl}
              />
            </div>
          )}
        </div>)}
        {cropViweRender && (
          cropViweRender(croppedImageUrl)
        ) }
        {(!cropResultAppendHtml && !cropViweRender) && (
          <div className="crop-view">
            {croppedImageUrl && (
              <img
                alt="Crop"
                style={{ maxWidth: '100%' }}
                src={croppedImageUrl}
              />
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ImageClipModal;