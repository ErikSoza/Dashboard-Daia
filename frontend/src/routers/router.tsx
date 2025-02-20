import { createBrowserRouter } from "react-router-dom";
import React from "react";

import Login from "../pages/public/login.tsx";
import Home from "../pages/private/home.tsx";
import Device from "../pages/private/device.tsx";
import Analytics from "../pages/private/Graphic/analytics.tsx";

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
        path: "/device",
        element: <Device />
    },
    {
        path: "/analytics/:chartTypeState/:devUI",
        element: <Analytics />
    }
])

export { router };
