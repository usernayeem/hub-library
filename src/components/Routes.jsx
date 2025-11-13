import { createBrowserRouter } from "react-router";
import Home from "../pages/Home";
import { Root } from "../layouts/Root";
import { About } from "../pages/About";
import { AuthLayout } from "../layouts/AuthLayout";
import { Login } from "../pages/Login";
import { Register } from "../pages/Register";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "about", Component: About },
      {
        path: "auth",
        Component: AuthLayout,
        children: [
          { path: "login", Component: Login },
          { path: "register", Component: Register },
        ],
      },
    ],
  },
]);
