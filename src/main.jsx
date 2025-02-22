import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import './index.css'
import Main from './Layout/Main.jsx';
import TaskHome from './Pages/TaskHome.jsx';
import AuthProvider from './Provider/AuthProvider.jsx';
import Login from './Pages/LogSign/Login.jsx'
import Signup from './Pages/LogSign/Signup.jsx'
import ForgetPassword from './Pages/LogSign/ForgetPassword.jsx'
import PrivateRoute from "./Routes/PrivateRoute.jsx";
import WelcomePage from "./Pages/WelcomePage.jsx"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main></Main>,
    children: [
      {
        path: "/",
        element:
          <WelcomePage />
         ,
      },
      {
        path:"login",
        element:<Login></Login>,
    },
    {
        path:"signup",
        element:<Signup></Signup>,
    },
    {
        path:"forgetPassword",
        element:<ForgetPassword></ForgetPassword>,
    },
    {
      path:"taskHome",
      element:<PrivateRoute>
        <TaskHome></TaskHome>
      </PrivateRoute>,
  },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
  </StrictMode>,
)
