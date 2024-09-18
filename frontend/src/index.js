import React from "react";
import ReactDOM from "react-dom/client";
import "./index2.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "bootstrap/dist/css/bootstrap.min.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Chat from "./Chatbot/Chat";
import Homepage from "./home/Homepage";
import Comparator from "./comparator/Comparator";
import Aboutus from "./AboutUs/Aboutus";

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
    {
        path: "/chat",
        element: <Chat />,
        errorElement: "404 Error \n Page not Found.",
    },
    {
        path: "/about",
        element: <Aboutus />,
        errorElement: "404 Error \n Page not Found.",
    },
]);
root.render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
