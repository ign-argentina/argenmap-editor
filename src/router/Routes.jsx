import { createBrowserRouter } from "react-router-dom";
import Root from "../Root";
import WelcomePage from '../components/WelcomePage';
import Form from '../Form';

const router = createBrowserRouter([
  {
    path: "/", element: <Root />, children: [
      { path: "/", element: <WelcomePage/> },
      { path: "/editor", element: <Form/> },
    ]
  },
])

export default router