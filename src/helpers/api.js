import axios from 'axios';
import { getDomain } from 'helpers/getDomain';


const token = localStorage.getItem("token");


// , 'Authorization':'Basic '+ token
export const api = axios.create({
  baseURL: getDomain(),
  headers: { 'Content-Type': 'application/json' }
});

export const auth_api = axios.create({
  baseURL: getDomain(),
  headers: { authorization: 'Basic ' + token }
});

export function authHeader() {
  // return authorization header with basic auth credentials
  let userId = JSON.parse(localStorage.getItem('userId'));

  if (userId && token) {
    return { Authorization: `Bearer ${token}` };
  } else {
    return {};
  }
}


export const handleError = error => {
  const response = error.response;

  // catch 4xx and 5xx status codes
  if (response && !!`${response.status}`.match(/^[4|5]\d{2}$/)) {
    let info = `\nrequest to: ${response.request.responseURL}`;

    if (response.data.status) {
      info += `\nstatus code: ${response.data.status}`;
      info += `\nerror: ${response.data.error}`;
      info += `\nerror message: ${response.data.message}`;
    } else {
      info += `\nstatus code: ${response.status}`;
      info += `\nerror message:\n${response.data}`;
    }

    console.log('The request was made and answered but was unsuccessful.', error.response);
    return info;
  } else {
    if (error.message.match(/Network Error/)) {
      alert('The server cannot be reached.\nDid you start it?');
    }

    console.log('Something else happened.', error);
    return error.message;
  }
};
