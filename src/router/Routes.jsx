import { createBrowserRouter } from "react-router-dom";
import Root from "../Root";
import WelcomePage from '../components/WelcomePage';
import Editor from '../Editor';

const router = createBrowserRouter([
  {
    path: "/", element: <Root />, children: [
      { path: "/", element: <WelcomePage/> },
      { path: "/editor", element: <Editor/> },
      { path: "/ejemploDos", element: <><h1>ACCEDISTE A LA RUTA EJEMPLO DOS!</h1></> },
    ]
  },
])

export default router