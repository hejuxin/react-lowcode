import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import HomeDiyItem from './components/HomeDiyContent';
import { removeVideo } from './utils';
import HomeReviewDiy from './components/HomeReviewDiy';

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
        <HomeDiyItem
          value={data}
          tabMode='brandCode'
          onSetData={handleDataChange}
          moduleIndex={diyModuleIndex}
          onModuleIndexChange={setDiyModuleIndex}
          removeVideo={removeVideo}
        />
      </div>
      <div className='preview'>
        {/* todo preview content */}
        <HomeReviewDiy
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
  );
}

export default App;
