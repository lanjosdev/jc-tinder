// Funcionalidades / Libs:
// import { Routes, Route } from "react-router-dom";
import { Routes, Route } from "react-router";

// Components:
import ControllerRouter from "./ControllerRouter";

// Pages:
import Cta from "../pages/cta";
import Login from "../pages/login";
import Register from "../pages/register";
import Forms from "../pages/forms";
import Home from "../pages/home";
import Settings from "../pages/settings";
import Profile from "../pages/profile";
import Preferences from "../pages/preferences";
import Photos from "../pages/photos";
import Matches from "../pages/matches";
import User from "../pages/user";



export default function AppRoutes() {
    return (
        <Routes>

            <Route path="/" element={ <Cta/> } />
            <Route path="/login" element={ <Login/> } />
            <Route path="/register" element={ <Register/> } />

            <Route path="/forms" element={ <ControllerRouter> <Forms/> </ControllerRouter> } />
            <Route path="/home" element={ <ControllerRouter> <Home/> </ControllerRouter> } />
            <Route path="/settings" element={ <ControllerRouter> <Settings/> </ControllerRouter> } />
            <Route path="/profile" element={ <ControllerRouter> <Profile/> </ControllerRouter> } />
            <Route path="/preferences" element={ <ControllerRouter> <Preferences/> </ControllerRouter> } />
            <Route path="/photos" element={ <ControllerRouter> <Photos/> </ControllerRouter> } />
            <Route path="/matches" element={ <ControllerRouter> <Matches/> </ControllerRouter> } />
            <Route path="/user/:id" element={ <ControllerRouter> <User/> </ControllerRouter> } />

        </Routes>
    )
}