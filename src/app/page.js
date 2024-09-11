'use client';
import { store } from '../app/store/store'; // Asegúrate de que la ruta sea correcta
import { Provider } from 'react-redux';

import Editor from './components/Editor'; // Asegúrate de que la ruta sea correcta

export default function Page() {
  
  return (
    <Provider store={store}>
      <Editor />
    </Provider>
  )
}
