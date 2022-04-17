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


// in the Register you need to give props.roomId and props.participant to know if someone is first participant or second
// if a user is  first participant things will be as it is.
// if a user is second participant, once succesfully registrating, they will be redirected to debate room page.
const Register = props => {
  const history = useHistory();
  const [password, setPassword] = useState(null);
  const [username, setUsername] = useState(null);
  const [name, setName] = useState(null);

  const doRegister = async () => {
    try {
      const requestBody = JSON.stringify({username, name, password});
      const response = await api.post('/users', requestBody);

      // Get the returned user and update a new object.
      const user = new User(response.data);

      // Store the token into the local storage.
      localStorage.setItem('token', user.token);
      localStorage.setItem('userId', user.userId);
      // Login successfully worked --> navigate to the route /home in the GameRouter
      history.push("/home");
    } catch (error) {
      alert(`Something went wrong during the login: \n${handleError(error)}`);
    }
  };

  function toLogin () {
    history.push("/login");
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
