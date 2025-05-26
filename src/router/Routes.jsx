import { createBrowserRouter } from "react-router-dom";
import Root from "../Root";
import WelcomePage from '../components/WelcomePage';
import Form from '../Form';
import Management from "../pages/Management";

const router = createBrowserRouter([
  {
    path: "/", element: <Root />, children: [
      { path: "/", element: <WelcomePage/> },
      { path: "/editor", element: <Form/> },
      { path: "/management", element: <Management/> },
    ]
  },
])

export default router