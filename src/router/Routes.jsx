import { createBrowserRouter } from "react-router-dom";
import Root from "../Root";
import WelcomePage from '../components/WelcomePage/WelcomePage';
import VisorManager from '../components/VisorManager/VisorManager';
import Form from '../components/Form/Form';
import HomeRedirect from '../components/HomeRedirect';
import Management from "../pages/Management";
import Dashboard from "../pages/Dashboard";

const router = createBrowserRouter([
  {
    path: "/", element: <Root />, children: [
      { path: "/", element: <HomeRedirect /> },
      { path: "/info", element: <WelcomePage /> },
      { path: "/visores", element: <VisorManager /> },
      { path: "/form", element: <Form /> },
      { path: "/management", element: <Management /> },
      { path: "/admin/dashboard", element: <Dashboard /> },
    ]
  },
])

export default router