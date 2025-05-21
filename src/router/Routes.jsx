import { createBrowserRouter } from "react-router-dom";
import Root from "../Root";
import WelcomePage from '../components/WelcomePage';

const router = createBrowserRouter([
  {
    path: "/", element: <Root />, children: [
      { path: "/", element: <><h1>ACA VA UNA VISTA!</h1></> },
      { path: "/ejemplo", element: <><h1>PUERTO RIO PLATA CALAMAR!</h1></> },
      { path: "/ejemploDos", element: <><h1>ACCEDISTE A LA RUTA EJEMPLO DOS!</h1></> },
      { path: "/welcome-page", element: <WelcomePage /> },

    ]
  },
])

export default router