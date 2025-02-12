// Funcionalidades / Libs:
// import { Routes, Route } from "react-router-dom";
import { Routes, Route } from "react-router";

// Components:
import ControllerRouter from "./ControllerRouter";

// Pages:
import Login from "../pages/login";
import Register from "../pages/register";
import Forms from "../pages/forms";
import Home from "../pages/home";
import Settings from "../pages/settings";
import Profile from "../pages/profile";
import Photos from "../pages/photos";



export default function AppRoutes() {
    return (
        <Routes>

            <Route path="/login" element={ <Login/> } />
            <Route path="/register" element={ <Register/> } />

            <Route path="/forms" element={ <ControllerRouter> <Forms/> </ControllerRouter> } />
            <Route path="/home" element={ <ControllerRouter> <Home/> </ControllerRouter> } />
            <Route path="/settings" element={ <ControllerRouter> <Settings/> </ControllerRouter> } />
            <Route path="/profile" element={ <ControllerRouter> <Profile/> </ControllerRouter> } />
            <Route path="/photos" element={ <ControllerRouter> <Photos/> </ControllerRouter> } />

        </Routes>
    )
}