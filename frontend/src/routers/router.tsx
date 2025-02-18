import { createBrowserRouter } from "react-router-dom";
import React from "react";

import Login from "../pages/public/login.tsx";
import Home from "../pages/private/home.tsx";
import Dispositivos from "../pages/private/dispositivos.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Login />
    },
    {
        path: "/home",
        element: <Home />
    },
    {
        path: "/dispositivos",
        element: <Dispositivos />
    }
])

export { router };
