import React, { useState } from 'react';
import Editor from './features/HomeDiyContent';
import PreviewContent from './features/HomeReviewDiy';
import OperateContent from './features/OperateContent';
import './App.css';

const defalutData = {
  backgroundImages: [],
  modules: [],
  backgroundColor: '#fff'
}
function App() {
  const [data, setData] = useState<IHomeDiyDetailItem>(defalutData);
  const [diyModuleIndex, setDiyModuleIndex] = useState<number>(-1);

  const handleDataChange = (value: IHomeDiyDetailItem) => {
    setData(value)
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
        <OperateContent />
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
    </div>
  );
}

export default App;
