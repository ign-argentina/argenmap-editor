import { createBrowserRouter } from "react-router-dom";
import Root from "../Root";
import WelcomePage from '../components/WelcomePage/WelcomePage';
import Form from '../components/Form/Form';
import Management from "../pages/Management";
import Dashboard from "../pages/Dashboard";

const router = createBrowserRouter([
  {
    path: "/", element: <Root />, children: [
      { path: "/", element: <WelcomePage/> },
      { path: "/form", element: <Form/> },
      { path: "/management", element: <Management/> },
       { path: "/admin/dashboard", element: <Dashboard/> },
    ]
  },
])

export default router