import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import PropTypes from "prop-types";
import { api, handleError } from "helpers/api";
import { Spinner } from "components/ui/Spinner";
/**
 * routeProtectors interfaces can tell the router whether or not it should allow navigation to a requested route.
 * They are functional components. Based on the props passed, a route gets rendered.
 * In this case, if the user is authenticated (i.e., a token is stored in the local storage)
 * <Outlet /> is rendered --> The content inside the <GameGuard> in the App.js file, i.e. the user is able to access the main app.
 * If the user isn't authenticated, the components redirects to the /login screen
 * @Guard
 * @param props
 */

export const UserEditingGuard = () => {
  const [idFromToken, setIdFromToken] = useState(undefined);
  const id = parseInt(location.pathname.split("/").at(-1));

  useEffect(() => {
    async function tryLogin() {
      console.log("User Editing guard:", id);
      setIdFromToken(await fetchUserByToken());
    }
    tryLogin();
  }, []);
  if (idFromToken === undefined) {
    return (
      <div>
        <Spinner />;
      </div>
    );
  }
  console.log(id === idFromToken);
  if (id === idFromToken) {
    console.log("here");
    return <Outlet />;
  }
  return <Navigate to="/game" replace />;
};

const fetchUserByToken = async () => {
  console.log("Posting token to Server!");
  const response = await api.post(
    "/fetchByToken",
    localStorage.getItem("token")
  );
  console.log("Succesfully received from Server", response);
  console.log("Succesfully received from Server", response.data.id);
  return response.data.id;
};

UserEditingGuard.propTypes = {
  children: PropTypes.node,
};
