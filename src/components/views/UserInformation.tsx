import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
import {useNavigate} from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Game.scss";
//import { User } from "types";
import User from "models/User";
import UserToDisplay from "models/UserToDisplay";

const Player = ({ user }: { user: User }) => (
  <div className="player container">
    <div className="player username">{user.username}</div>
    <div className="player password">{user.password}</div>
    <div className="player id">id: {user.id}</div>
  </div>
);

const userInformation = ( entry ) => (
  <div className="userToDisplay container">
    <div className="userToDisplay username">username: {entry.username}</div>
    <div className="userToDisplay id">id: {entry.id}</div>
    <div className="userToDisplay status">status: {entry.status}</div>
    <div className="userToDisplay birthDate">birthDate: {entry.birthDate}</div>
    <div className="userToDisplay creationDate">creationDate: {entry.creationDate}</div>
  </div>
);

Player.propTypes = {
  user: PropTypes.object,
};

const UserInformation = () => {
  // use react-router-dom's hook to access navigation, more info: https://reactrouter.com/en/main/hooks/use-navigate 
  const navigate = useNavigate();
  // define a state variable (using the state hook).
  // if this variable changes, the component will re-render, but the variable will
  // keep its value throughout render cycles.
  // a component can have as many state variables as you like.
  // more information can be found under https://react.dev/learn/state-a-components-memory and https://react.dev/reference/react/useState 
  const id = parseInt(location.pathname.split("/").at(-1));
  const [users, setUsers] = useState<User[]>(null);
  const [currentUsername, setCurrentUsername] = useState<User[]>(null);
  const [currentUserInformation, setCurrentUserInformation] = useState<UserToDisplay>(null);

  const logout = (): void => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // the effect hook can be used to react to change in your component.
  // in this case, the effect hook is only run once, the first time the component is mounted
  // this can be achieved by leaving the second argument an empty array.
  // for more information on the effect hook, please see https://react.dev/reference/react/useEffect 
  useEffect(() => {
    // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
    async function fetchData() {
      try {
        setCurrentUsername(await fetchUserByToken(localStorage.getItem("token")));
        const response = await api.get(`/users/${id}`);

        // delays continuous execution of an async operation for 1 second.
        // This is just a fake async call, so that the spinner can be displayed
        // feel free to remove it :)
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Get the returned users and update the state.
        setCurrentUserInformation(response.data);

        // This is just some data for you to see what is available.
        // Feel free to remove it.
        console.log("request to:", response.request.responseURL);
        console.log("status code:", response.status);
        console.log("status text:", response.statusText);
        console.log("requested data:", response.data);

        // See here to get more data.
        console.log(response);
      } catch (error) {
        console.error(
          `Something went wrong while fetching the users: \n${handleError(
            error
          )}`
        );
        console.error("Details:", error);
        alert(
          "Something went wrong while fetching the users! See the console for details."
        );
      }
    }

    fetchData();
  }, []);

  let content = <Spinner />;

  //maybe need to change this ul line to UserToDisplay for own style
  if (currentUserInformation) {
    content = (
      <div className="game">
        <ul className="game user-list">
          {userInformation(currentUserInformation)}
        </ul>
        <Button width="100%" onClick={() => navigate("/game")}>
          Return to overview
        </Button>
      </div>
    );
  }
  

  return (
    <div style={{display: "flex", flexDirection: "column"}}>
      <BaseContainer className="game container">
      <h2>User Information: {currentUsername}</h2>
        {content}
      </BaseContainer>
    </div>
  );
};

const fetchUserByToken = async (token) => {
  console.log("Posting token to Server:", token)
  const response = await api.post("/fetchByToken", token);
  const user = new User(response.data);
  console.log("Succesfully received from Server", response)
  console.log("Succesfully received from Server", user.username)
  console.log("Got it")
  return user.username
}

export default UserInformation;
