// Funcionalidades / Libs:
// import { Routes, Route } from "react-router-dom";
import { Routes, Route } from "react-router";

// Pages:
import Login from "../pages/login";
import Register from "../pages/register";
import Forms from "../pages/forms";
import Home from "../pages/home";


// Components:
// import ControllerRouter from "./ControllerRouter";


export default function AppRoutes() {
    return (
        <Routes>

            <Route path="/login" element={ <Login/> } />
            <Route path="/register" element={ <Register/> } />

            <Route path="/forms" element={ <Forms/> } />
            <Route path="/home" element={ <Home/> } />

        </Routes>
    )
}