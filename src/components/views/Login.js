import React, {useState} from 'react';
import {api, handleError} from 'helpers/api';
import User from 'models/User';
import {useHistory} from 'react-router-dom';
import {Button} from 'components/ui/Button';
import 'styles/views/Login.scss';
import 'styles/ui/BaseContainer.scss';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";

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

  const Guest = () => (
    <div 
    className='login create-account'
    onClick={() => history.push(to_push)}>
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

      // Store the token into the local storage.
      localStorage.setItem('token', user.token);
      localStorage.setItem('userId', user.userId);

      // Login successfully worked --> navigate to the route
      history.push(to_push);
    } catch (error) {
      alert(`Something went wrong during the login: \n${handleError(error)}`);
    }
  };

  function toRegister () {
    // if else statement here to know if the link is for first participant or second
    history.push("/register");
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

// in toRegister you can have two varibles as input which can be roomid and participants.

export default Login;