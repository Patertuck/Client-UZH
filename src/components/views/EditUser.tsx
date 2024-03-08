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

/* const userInformation = ( entry ) => (
  <div className="userToDisplay container">
    <div className="userToDisplay username">username: {entry.currentUsername}</div>
    <div className="userToDisplay id">id: {entry.id}</div>
    <div className="userToDisplay status">status: {entry.status}</div>
    <div className="userToDisplay birthDate">birthDate: {entry.birthDate}</div>
    <div className="userToDisplay creationDate">creationDate: {entry.creationDate}</div>
  </div>
); */

Player.propTypes = {
  user: PropTypes.object,
};

const FormField = (props) => {
  return (
    <div className="login field">
      <label className="login label">{props.label}</label>
      <input
        className="login input"
        placeholder="enter here.."
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </div>
  );
};

FormField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
};

const EditUser = () => {
  // use react-router-dom's hook to access navigation, more info: https://reactrouter.com/en/main/hooks/use-navigate 
  const navigate = useNavigate();
  // define a state variable (using the state hook).
  // if this variable changes, the component will re-render, but the variable will
  // keep its value throughout render cycles.
  // a component can have as many state variables as you like.
  // more information can be found under https://react.dev/learn/state-a-components-memory and https://react.dev/reference/react/useState 
  const [id, setId] = useState<User[]>(null);
  const [users, setUsers] = useState<User[]>(null);
  const [currentUsername, setCurrentUsername] = useState<User[]>(null);
  const [currentUserInformation, setCurrentUserInformation] = useState<UserToDisplay>(null);
  const [currentUserInformationUsername, setCurrentUserInformationUsername] = useState<UserToDisplay>(null);
  const [inputUsername, setInputUsername] = useState<string>(undefined);
  const [inputBirthDate, setInputBirthDate] = useState<string>(undefined);

  // the effect hook can be used to react to change in your component.
  // in this case, the effect hook is only run once, the first time the component is mounted
  // this can be achieved by leaving the second argument an empty array.
  // for more information on the effect hook, please see https://react.dev/reference/react/useEffect 
  useEffect(() => {
    // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
    async function fetchData() {
      try {
        console.log("Id:", id);
        setCurrentUsername(await fetchByToken("username"));
        setId(await fetchByToken("id"));

        // See here to get more data.
        console.log("found User");
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

  const doSave = async () => {
    console.log("Try Saving")
    try {
      if (inputBirthDate){
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(inputBirthDate)) {
        console.log("Wrong format of date");
        alert("Wrong format of date");
        return;}
      }

      const requestBody = JSON.stringify({ inputUsername, inputBirthDate, currentUsername});
      console.log("Posting to Save to Server", requestBody)
      await api.put(`/users/${id}`, requestBody);
      console.log("Succesfully received from Server")

      // Login successfully worked --> navigate to the route /game in the AppRouter
      navigate(`/game/userInformation/${id}`)
    } catch (error) {
      console.log("Wrong format of input")
      alert(
        `Wrong format of input`
      );
    }
  };

  let content = <Spinner />;

  //maybe need to change this ul line to UserToDisplay for own style
    

    content = (
      <div className="game">
        <ul className="game user-list">
          {/* {userInformation(currentUserInformation)} */}
        </ul>
        <FormField
            label="Enter new username"
            value={inputUsername}
            onChange={(un: string) => setInputUsername(un)}
          />
          <FormField
            label="enter new birth date (format: yyyy-mm-dd)"
            value={inputBirthDate}
            onChange={(n) => setInputBirthDate(n)}
          />
        <Button
              disabled={!inputUsername && !inputBirthDate}
              width="100%"
              onClick={() => doSave()}
            >
              Save
            </Button>
        <Button width="100%" onClick={() => navigate(`/game/userInformation/${id}`)}>
          Back
        </Button>
      </div>
    );
  

  return (
    <div style={{display: "flex", flexDirection: "column"}}>
      <BaseContainer className="game container">
      <h2>Edit User: {currentUsername}</h2>
        {content}
      </BaseContainer>
    </div>
  );
};

const fetchByToken = async (entry) => {
  console.log("Posting token to Server:", entry)
  const response = await api.post("/fetchByToken", localStorage.getItem("token"));
  const user = new User(response.data);
  console.log("Succesfully received from Server", response)
  console.log("Succesfully received from Server", user)
  console.log("Returning: ", user[entry])
  return user[entry]
}

export default EditUser;
