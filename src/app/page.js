'use client';
import { store } from '../app/store/store';
import { Provider } from 'react-redux';

import Editor from './components/Editor';

export default function Page() {
  
  return (
    <Provider store={store}>
      <Editor />
    </Provider>
  )
}
