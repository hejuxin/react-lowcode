import React from 'react'
import { Modal } from 'antd'
import './index.scss'

interface IProps {
  visible: boolean;
  handleCancel: () => void;
}

const AddModal: React.FC<IProps> = props => {
  const { visible, handleCancel } = props

  return (
    <>
      <Modal
        visible={visible}
        onCancel={handleCancel}
        footer={null}
        width={600}
        className='brand-story-intro-modal'
      >
        <p className='custom-sub1'>{i18n.t('decorate.contentItemSub.customModalSub1')}</p>
        <img src={require('@/assets/img/home-copyLink-desc0.png')} style={{ width: '414px', height: '180px' }}/>
        <p className='custom-sub2'>{i18n.t('decorate.contentItemSub.customModalSub2')}</p>
        <img src={require('@/assets/img/home-copyLink-desc1.png')} style={{ width: '414px', height: '600px' }}/>
      </Modal>
    </>
  )
}

export default AddModal
