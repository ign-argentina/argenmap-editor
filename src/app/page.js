'use client';

import { Provider } from 'react-redux';
import { store } from './store/store';
import { useState } from 'react';
import Editor from './components/Editor';
import Preview from './components/Preview';

export default function Page() {
  const [preferencesNew, setPreferencesNew] = useState({});
  const [dataNew, setDataNew] = useState({});

  const downloadPreferencesFile = () => {
    const json = JSON.stringify(preferencesNew, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'preferencesNew.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadDataFile = () => {
    const json = JSON.stringify(dataNew, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'dataNew.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Provider store={store}>
      <div className="editor-container">
        <div className="form-container">
          <Editor 
            setPreferencesNew={setPreferencesNew} 
            setDataNew={setDataNew} 
          />
          <button onClick={downloadPreferencesFile}>Download Preferences JSON</button>
          <button onClick={downloadDataFile}>Download Data JSON</button>
        </div>
        <div className="preview-container">
          <Preview />
        </div>
      </div>
    </Provider>
  );
}
