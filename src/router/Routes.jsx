import { createBrowserRouter } from "react-router-dom";
import Root from "../Root";
import WelcomePage from '../components/WelcomePage/WelcomePage';
import ViewerManager from '../components/ViewerManager/ViewerManager';
import Form from '../components/Form/Form';
import HomeRedirect from '../components/HomeRedirect';
import Management from "../pages/Management";
import ControlPanel from "../pages/ControlPanel";
import ArgenmapForm from "../components/ArgenmapForm/ArgenmapForm";
import PrivatedRoute from "./PrivatedRoute";
import MyGroups from "../pages/MyGroups";

const router = createBrowserRouter([
  {
    path: "/", element: <Root />, children: [
      { path: "/", element: <HomeRedirect /> },
      { path: "/info", element: <WelcomePage /> },
      { path: "/visores", element: <ViewerManager /> },
      { path: "/form", element: <Form /> },
      { path: "/mygroups", element: <MyGroups /> },
      { path: "/admin/dashboard", element: <PrivatedRoute element={<ControlPanel />} />},
      { path: "/aform", element: <ArgenmapForm /> },
      { path: "*", element: <HomeRedirect /> } // Catch all routes
    ]
  },
])

export default router