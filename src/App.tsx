import React, { useEffect, useMemo, useRef, useState } from 'react';
import Editor from './features/HomeDiyContent';
import PreviewContent from './features/HomeReviewDiy';
import OperateContent from './features/OperateContent';
import './App.css';
import { Input, Modal } from 'antd';
import { useModalParams } from './utils/hooks';

const defalutData = {
  backgroundImages: [],
  modules: [],
  backgroundColor: '#fff'
}
function App() {
  const [data, setData] = useState<IHomeDiyDetailItem>(defalutData);
  const [diyModuleIndex, setDiyModuleIndex] = useState<number>(-1);
  const textareaRef = useRef(null);

  const modalParams = useModalParams();

  const isExport = modalParams.params.type === 'export';

  const handleDataChange = (value: IHomeDiyDetailItem) => {
    setData(value)
  }

  const modalProps = useMemo(() => {
    let obj: Record<string, any> = {};
    if (isExport) {
      obj.footer = null
    }

    return obj;
  }, [modalParams.params]);

  
  const handleOk = () => {
    const textarea = (textareaRef.current as any)!.resizableTextArea.textArea;
    const value = JSON.parse(textarea.value);

    setData(value)
    modalParams.hideModal();
  }


  return (
    <div className="App">
      <div className='config'>
        <Editor
          value={data}
          tabMode='brandCode'
          onSetData={handleDataChange}
          moduleIndex={diyModuleIndex}
          onModuleIndexChange={setDiyModuleIndex}
        />
      </div>
      <div className='preview-wrap'>
        <OperateContent onClick={(params) => modalParams.showModal(params)} />
        <div className='preview'>
          <PreviewContent
            value={data}
            onSetData={handleDataChange}
            isBrand
            type='brandCode'
            wxAmpLinkList={[]}
            moduleIndex={diyModuleIndex}
            onModuleIndexChange={(index: number) => setDiyModuleIndex(index)}
          />
        </div>
      </div>
      <Modal
        {...modalProps}
        open={modalParams.visible}
        onOk={handleOk}
        onCancel={() => modalParams.hideModal()}
        width={1000}
        destroyOnClose
        title={`${isExport  ? '导出' : '导入'}数据`}
        okText="确定"
        cancelText='取消'
      >
        <Input.TextArea
          readOnly={isExport}
          ref={textareaRef}
          defaultValue={isExport ? JSON.stringify(data) : ''}
          className='textarea'
        />
      </Modal>
    </div>
  );
}

export default App;
