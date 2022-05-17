import React, {useState} from 'react';
import {api, handleError} from 'helpers/api';
import User from 'models/User';
import {useHistory} from 'react-router-dom';
import {Button} from 'components/ui/Button';
import 'styles/ui/BaseContainer.scss';
import 'styles/logo.css';
import PropTypes from "prop-types";
import 'styles/views/Login_Trial.css';

const FormField = props => {
  return (
    <div className="field">
      <label class="mb-1">
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

const Login = props => {
  const history = useHistory();
  const [password, setPassword] = useState(null);
  const [username, setUsername] = useState(null);

  let to_push;

  // check if Login page routed for second participant. If so, guest=true to give option to login as a guest user as well.
  if (props.isInvitee) {
    to_push = "/debateroom/" + String(props.roomId)
  }
  else {
    to_push = "/home"
  }
  /*
   <div className="row mb-4 px-3">
                          <h6>
                            Don't have an account? 
                            
                          </h6>
                      </div>
   */

  const joinAsGuest = async () => {
    try {
      // Create guest user
      const response = await api.post("/users/guests");
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", response.data.userId);
  }
  catch (error){
      console.error(`Something went wrong while creating guest user: \n${handleError(error)}`);
      console.error("Details:", error);
      alert("Something went wrong while creating guest user");
  }
      history.push(
          {
              pathname: to_push,
              state: {
                  isInvitee: props.isInvitee,
                  isGuest: true
              }
          }
      );
  }

  const Guest = () => (
  <a className="create-account" onClick={() => joinAsGuest()} >Join as a guest User</a>
  )
  const doLogin = async () => {
    try {
      let to_get = "/login?username=" + String(username) + "&password=" + String(password);
      const response = await api.get(to_get);
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Get the returned user and update a new object.
      const user = new User(response.data);

      // saving token in local storage
      localStorage.setItem("token", user.token);
      localStorage.setItem("userId", user.userId);
      localStorage.setItem("username", user.username);

      // Login successfully worked --> navigate to the route
      history.push(
          {
            pathname: to_push,
            state: { isInvitee: props.isInvitee}
          });
    } catch (error) {
      alert(`Something went wrong during the login: \n${handleError(error)}`);
    }
  };

  function toRegister () {
    history.push({
        pathname: "/register",
        state: {
            roomId: props.roomId,
            isInvitee: props.isInvitee
        } });
  }

  return (
      <div className="container-fluid px-1 px-md-5 px-lg-1 px-xl-5 py-5 mx-auto"style={{"background-color":"white", "height":"100vh"}}>
        <div id="card" className="card card0 border-0" >
            <div className="row d-flex">
              <div className="col-lg-6  d-flex" >
                  <img src={require('../../images/logo2.png')}
                  className="logo"
                  border="0"/>
              </div>
              <div className="col-lg-6">
                  <div id="card2" className="card2 card border-0 px-4 py-5">
                      <div className="row mb-4 px-3  d-flex justify-content-center" >
                          <h4>Log In to It's Debatable</h4>
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
                              type={password}
                              value={password}
                              onChange={n => setPassword(n)}
                              />
                      </div>

                      <div className="row mb-3 px-3 mt-3 d-flex justify-content-center">
                          <Button
                              disabled={!username || !password}
                              width="50%"
                              onClick={() => doLogin()}
                          >
                              LOG IN
                          </Button>
                      </div>
                      <div className="row mb-1 px-3">
                        <h6> Don't have an account?
                          <a className="text-danger" onClick={() => toRegister()} >Register</a>
                        </h6>
                      </div>

                      <div className="row mb-1 px-3">
                          {props.isInvitee ? <Guest /> : null }
                      </div>
                  </div>
              </div>
            </div>
        </div>
      </div>
  );
};

export default Login;