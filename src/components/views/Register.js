import React, {useState} from 'react';
import {api, handleError} from 'helpers/api';
import User from 'models/User';
import {useHistory} from 'react-router-dom';
import {Button} from 'components/ui/Button';
import 'styles/views/Login.scss';
import 'styles/ui/BaseContainer.scss';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";

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

const Register = props => {
  const history = useHistory();
  const location = useLocation();
  const [password, setPassword] = useState(null);
  const [username, setUsername] = useState(null);
  const [name, setName] = useState(null);
  let to_push;

  const doRegister = async () => {
    try {
      const requestBody = JSON.stringify({username, name, password});
      const response = await api.post('/users', requestBody);

      // Get the returned user and update a new object.
      const user = new User(response.data);

      if (location.state.participant === "2")
      {
        to_push = "/debateroom/" + String(location.state.roomId)
        history.push(
        {
          pathname: to_push,
              state: {
            userId: user.userId,
            token: user.token,
            participant: location.state.participant,
            roomId: location.state.roomId}
        });
      }
      else
      {
        history.push("/home");
        /*history.push(
            {
              pathname: "/home",
              state: {
                userId: user.userId,
                token: user.token,
                participant: location.state.participant,
                roomId: location.state.roomId}
            });*/
      }

    } catch (error) {
      alert(`Something went wrong during the login: \n${handleError(error)}`);
    }
  };

  function toLogin () {
    if (location.state.participant === "2") {
      let push_to = "/debateroom/" + location.state.roomId + "/" + location.state.participant;
      history.push(push_to);
    }
    else {
      history.push("/login");
    }
  }

  return (
    <BaseContainer className="base-container">
      <div className="login register-container">
        <div className="login register-form">
          <FormField
            label="Name"
            value={name}
            onChange={un => setName(un)}
          />
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
              disabled={!username || !password || !name}
              width="100%"
              onClick={() => doRegister()}
            >
              Sign Up
            </Button>
          </div>
        </div>
      </div>
      <div 
      className='login create-account'
      onClick={() => toLogin() }>
        Log In
      </div>
    </BaseContainer>
  );
};
export default Register;
