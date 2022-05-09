import React, {useState} from 'react';
import {api, handleError} from 'helpers/api';
import User from 'models/User';
import {useHistory} from 'react-router-dom';
import {Button} from 'components/ui/Button';
import 'styles/views/Login_Trial.css';
import 'styles/ui/BaseContainer.scss';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";

const FormField = props => {
  return (
    <div className="field">
      <label className="mb-1">
        <h6 className="mb-0 text-sm">
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
      const response = await api.post('/users', requestBody);

      // Get the returned user and update a new object.
      const user = new User(response.data);

      localStorage.setItem("userId", user.userId);
      localStorage.setItem("token", user.token);
      localStorage.setItem("username", user.username);

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
        history.push(
            {
              pathname: "/home",
              state: {
                userId: user.userId,
                token: user.token,
                participant: location.state.participant,
                roomId: location.state.roomId}
            });
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



  <div className="container-fluid px-1 px-md-5 px-lg-1 px-xl-5 py-5 mx-auto">
    <div className="card card0 border-0">
      <div className="row d-flex">
        <div className="col-lg-6">

          <img src={require('../../images/logo2.png')}
               className="logo"
               border="0"/>


        </div>
        <div className="col-lg-6">
          <div className="card2 card border-0 px-4 py-5">
            <div className="row mb-4 px-3">

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

            <div className="row mb-3 px-3">
              <Button
                  disabled={!username || !password || !name}
                  width="100%"
                  onClick={() => doRegister()}
              >
                Sign Up
              </Button>
            </div>
            <div className="row mb-4 px-3">
              <small className="font-weight-bold">Do you already have an account? <a
                  className="text-danger " onClick={() => toLogin()} >Login</a></small>
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

