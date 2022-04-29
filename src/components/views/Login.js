import React, {useState} from 'react';
import {api, handleError} from 'helpers/api';
import User from 'models/User';
import {useHistory} from 'react-router-dom';
import {Button} from 'components/ui/Button';
import 'styles/views/Login.scss';
import 'styles/ui/BaseContainer.scss';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";

// BUG: since we removed localstorage token and userid because of multiple userids on same browser,
// when we are directly trying to go to home page, it is not appearing even after login.
// Same thing is happening for all the pages. TODO: discuss it with @Orestis.

const FormField = props => {
  return (
    <div className="login field">
      <label className="login label">
        {props.label}
      </label>
      <input
        className="login input"
        placeholder="enter here.."
        value={props.value}
        onChange={e => props.onChange(e.target.value)}
      />
    </div>
  );
};


FormField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func
};

const Login = props => {
  const history = useHistory();
  const [password, setPassword] = useState(null);
  const [username, setUsername] = useState(null);

  let to_push;
  let guest = false;

  // check if Login page routed for second participant. If so, guest=true to give option to login as a guest user as well.
  if (props.participant === "2") {
    guest=true;
    to_push = "/debateroom/" + String(props.roomId)
  }
  else {
    to_push = "/home"
  }

  const joinAsGuest = () => {
    try {
      // update the debate room with user 2 information
      const requestBody = JSON.stringify(null);
      const response = await api.put("/debates/rooms/" + String(props.roomId), requestBody);
      const token = response.data.user2.token;
      localStorage.setItem("token", token);
  }
  catch (error){
      console.error(`Something went wrong while updating userId in debateroom: \n${handleError(error)}`);
      console.error("Details:", error);
      alert("Something went wrong while updating userId in debateroom! See the console for details.");
  }
    history.push(
      {
        pathname: to_push,
        state: {
          userId: null,
          token: token,
          participant: props.participant,
          roomId: props.roomId}
      }
      );
  }

  const Guest = () => (
    <div 
    className='login create-account'
    onClick={() => joinAsGuest()}>
      Join as a guest User
    </div>
  )

  const doLogin = async () => {
    try {
      let to_get = "/login?username=" + String(username) + "&password=" + String(password);
      const response = await api.get(to_get);
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Get the returned user and update a new object.
      const user = new User(response.data);

      // saving tokem in local storage
      localStorage.setItem("token", user.token);

      // Login successfully worked --> navigate to the route
      history.push(
      {
        pathname: to_push,
            state: {
              userId: user.userId,
              token: user.token,
              participant: props.participant,
              roomId: props.roomId}
      });
    } catch (error) {
      alert(`Something went wrong during the login: \n${handleError(error)}`);
    }
  };

  function toRegister () {
    history.push({
        pathname: "/register",
        state: {participant: props.participant,
          roomId: props.roomId} });
  }

  return (
    <BaseContainer className="base-container">
      <div className="login container">
        <div className="login form">
          <FormField
            label="Username"
            value={username}
            onChange={un => setUsername(un)}
          />
          <FormField
            label="Password"
            value={password}
            onChange={n => setPassword(n)}
          />
          <div className="login button-container">
            <Button
              disabled={!username || !password}
              width="100%"
              onClick={() => doLogin()}
            >
              Log In
            </Button>
          </div>
        </div>
      </div>
      <div 
      className='login create-account'
      onClick={() => toRegister() }>
        create account
      </div>
      {guest ? <Guest /> : null }
    </BaseContainer>
  );
};

export default Login;