import React from "react";
import ReactDOM from "react-dom/client";
import "./index2.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "bootstrap/dist/css/bootstrap.min.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Homepage from "./home/Homepage";
import Comparator from "./comparator/Comparator";

const root = ReactDOM.createRoot(document.getElementById("root"));

const router = createBrowserRouter([
    {
        path: "/",
        element: <Homepage />,
        errorElement: "404 Error \n Page not Found.",
    },
    {
        path: "/comparator",
        element: <Comparator />,
        errorElement: "404 Error \n Page not Found.",
    },
]);

root.render(
    <React.StrictMode>
        <RouterProvider router={router}>
            <App />
        </RouterProvider>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
