// context/FormEngineContext.js
import { createContext, useContext } from 'react';

const FormEngineContext = createContext();

export const useFormEngineContext = () => useContext(FormEngineContext);

export default FormEngineContext;
