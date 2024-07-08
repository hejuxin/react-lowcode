import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import HomeDiyItem from './components/HomeDiyContent';
import { removeVideo } from './utils';

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
      <HomeDiyItem
        value={data}
        tabMode='brandCode'
        onSetData={handleDataChange}
        moduleIndex={diyModuleIndex}
        onModuleIndexChange={setDiyModuleIndex}
        removeVideo={removeVideo}
      />
    </div>
  );
}

export default App;
