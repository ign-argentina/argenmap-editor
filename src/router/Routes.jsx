import { createBrowserRouter } from "react-router-dom";
import Root from "../Root";
import WelcomePage from '../components/WelcomePage/WelcomePage';
import ViewerManager from '../components/ViewerManager/ViewerManager';
import Form from '../components/Form/Form';
import HomeRedirect from '../components/HomeRedirect';
import Management from "../pages/Management";
import Dashboard from "../pages/Dashboard";
import ArgenmapForm from "../components/ArgenmapForm/ArgenmapForm";

const router = createBrowserRouter([
  {
    path: "/", element: <Root />, children: [
      { path: "/", element: <HomeRedirect /> },
      { path: "/info", element: <WelcomePage /> },
      { path: "/visores", element: <ViewerManager /> },
      { path: "/form", element: <Form /> },
      { path: "/management", element: <Management /> },
      { path: "/admin/dashboard", element: <Dashboard /> },
      { path: "/aform", element: <ArgenmapForm /> },
    ]
  },
])

export default router