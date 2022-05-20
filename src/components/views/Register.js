import React, {useState} from 'react';
import {api, handleError} from 'helpers/api';
import User from 'models/User';
import {useHistory} from 'react-router-dom';
import {Button} from 'components/ui/Button';
import 'styles/views/Login_Trial.css';
import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";

const FormField = props => {
  return (
    <div className="field">
      <label className="mb-1">
        <h6 >
        {props.label}
        </h6>
      </label>
      <input
          type={props.label==="Password"? "password":"text"}
        className="input"
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
      const response = await api.post('/register', requestBody);

      // Get the returned user and update a new object.
      const user = new User(response.data);

      localStorage.setItem("userId", user.userId);
      localStorage.setItem("token", user.token);
      localStorage.setItem("username", user.username);
      localStorage.setItem("password", String(password));

      if (location.state.isInvitee)
      {
        to_push = "/debateroom/" + String(location.state.roomId)
        history.push(
            {
              pathname: to_push,
              state: {isInvitee: location.state.isInvitee}
            });
      }
      else
      {
        history.push("/home");
      }

    } catch (error) {
      alert(`Something went wrong during the login: \n${handleError(error)}`);
    }
  };

  function toLogin () {
    if (location.state.isInvitee) {
      let push_to = "/debateroom/" + location.state.roomId + "/invitee";
      history.push(push_to);
    }
    else {
      history.push("/login");
    }
  }

  return (
  <div className="container-fluid" style={{"background-color":"white", "height":"100vh",
    "padding-left":"0px", "padding-right":"0px"}}>
    <div id="card" className="card card0 border-0">
      <div className="row d-flex">
        <div className="col-lg-6  d-flex" >

          <img src={require('../../images/logo2.png')}
               className="logo"
               border="0"/>
        </div>
        <div className="col-lg-6">
          <div id="card2" className="card2 card border-0 px-4 py-5">
            <div className="row mb-4 px-3 d-flex justify-content-center">
                <h5>
                  Sign up to It's Debatable
                </h5>
            </div>
            <div className="row px-3">
              <FormField
                  label="Name"
                  value={name}
                  onChange={un => setName(un)}
              />
            </div>
            <div className="row px-3">
              <FormField
                  label="Username"
                  value={username}
                  onChange={un => setUsername(un)}
              />
            </div>
            <div className="row px-3">
              <FormField
                  label="Password"
                  value={password}
                  onChange={n => setPassword(n)}
              />
            </div>

            <div className="row mb-3 mt-3 px-3 d-flex justify-content-center">
              <Button
                  disabled={!username || !password || !name}
                  width="50%"
                  onClick={() => doRegister()}
              >
                Sign Up
              </Button>
            </div>
            <div className="row mb-4 px-3">
              <h6> Do you already have an account? <a
                  className="text-danger " onClick={() => toLogin()} >Login</a></h6>
            </div>
            <div className="row mb-4 px-3">

            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
};
export default Register;

