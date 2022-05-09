import React, {useState} from 'react';
import {api, handleError} from 'helpers/api';
import User from 'models/User';
import {useHistory} from 'react-router-dom';
import {Button} from 'components/ui/Button';
import 'styles/ui/BaseContainer.scss';
import 'styles/logo.css';
import PropTypes from "prop-types";
import 'styles/views/Login_Trial.css';



// BUG: since we removed localstorage token and userid because of multiple userids on same browser,
// when we are directly trying to go to home page, it is not appearing even after login.
// Same thing is happening for all the pages. TODO: discuss it with @Orestis.

const FormField = props => {
  return (
    <div className="field">
      <label class="mb-1">
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

  const joinAsGuest = async () => {
    try {
      // update the debate room with user 2 information
      let userId = null;
      const requestBody = JSON.stringify({userId});
      const response = await api.put("/debates/rooms/" + String(props.roomId), requestBody);
      localStorage.setItem("token", response.data.user2.token);
      localStorage.setItem("userId", response.data.user2.userId);
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
          token: null,
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
      localStorage.setItem("userId", user.userId);
      localStorage.setItem("username", user.username);

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

  //col-6

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

                          <div className="row mb-3 px-3">
                              <Button
                                  disabled={!username || !password}
                                  width="100%"
                                  onClick={() => doLogin()}
                              >
                                  LOG IN
                              </Button>
                          </div>
                          <div className="row mb-4 px-3">
                              <small className="font-weight-bold">Don't have an account? <a
                                  className="text-danger " onClick={() => toRegister()} >Register</a></small>
                          </div>
                          <div className="row mb-4 px-3">
                          {guest ? <Guest /> : null }
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>



  );
};

export default Login;

//