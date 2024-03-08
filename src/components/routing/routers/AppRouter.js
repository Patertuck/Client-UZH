import React from "react";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import {GameGuard} from "../routeProtectors/GameGuard";
import {LoginGuard} from "../routeProtectors/LoginGuard";
import {RegistrationGuard} from "../routeProtectors/RegistrationGuard";
import {UserEditingGuard} from "../routeProtectors/UserEditingGuard";
import Login from "../../views/Login";
import Registration from "../../views/Registration";
import UserInformation from "../../views/UserInformation";
import Game from "../../views/Game"; 
import EditUser from "../../views/EditUser";

/**
 * Main router of your application.
 * In the following class, different routes are rendered. In our case, there is a Login Route with matches the path "/login"
 * and another Router that matches the route "/game".
 * The main difference between these two routes is the following:
 * /login renders another component without any sub-route
 * /game renders a Router that contains other sub-routes that render in turn other react components
 * Documentation about routing in React: https://reactrouter.com/en/main/start/tutorial 
 */
const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/game" element={<GameGuard />}>
          <Route path="" element={<Game />} />
          <Route path="userInformation/*" element={<UserInformation />} />
          <Route path="/game/userInformation" element={<UserEditingGuard />}>
            <Route path="editUser/*" element={<EditUser />} />
          </Route>
        </Route>

        <Route path="/registration" element={<RegistrationGuard />}>
          <Route path="" element={<Registration/>} />
        </Route>

        <Route path="/login" element={<LoginGuard />}>
          <Route path="" element={<Login/>} />
        </Route>

        <Route path="/" element={
          <Navigate to="/login" replace />
        }/>

      </Routes>
    </BrowserRouter>
  );
};

/*
* Don't forget to export your component!
 */
export default AppRouter;
