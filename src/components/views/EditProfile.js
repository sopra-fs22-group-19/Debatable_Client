import React, {useState} from 'react';
import {api, handleError} from 'helpers/api';
import {useHistory, useParams} from 'react-router-dom';
import {Button} from 'components/ui/Button';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import Header from "./Header";
import 'styles/ui/BaseContainer.scss';
import 'styles/views/Login_Trial.css';

const FormField = props => {
    return (
        <div className="profile field">
            <label className="profile label">{props.label}</label>
            <input className="profile input" placeholder="enter here.." value={props.value} onChange={e => props.onChange(e.target.value)}/>
        </div>
    );
};

FormField.propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func
};

const EditProfile = () => {

    const {userId} = useParams();
    const history = useHistory();


    const [username, setUsername] = useState(null);
    const [name, setName] = useState(null);
    const [password, setPassword] = useState(null);

    const doUpdate = async () => {
        if (username !== null) {
            localStorage.setItem("username", username)
            console.log("saving username to localstorage")
        }



        if (name !== null) {
            localStorage.setItem("name", name)
            console.log("saving name to localstorage")
        }
        try {

            const requestBody = JSON.stringify({username, name, password});

            await api.put(`/users/${userId}`, requestBody);
            history.push(`/profile`);
        } catch (error) {
            alert(`Something went wrong during the process: \n${handleError(error)}`);
        }
    };

    return (
        <BaseContainer>
            <Header/>
            <div id="card2" className="card2 card border-0 px-4 py-5">
                <div className="row mb-4 px-3  d-flex justify-content-center">
                    <div className="row px-3">
                        <FormField label="Username: " value={username} onChange={un => setUsername(un)}/>
                    </div>
                    <div className="row px-3">
                        <FormField label="Name: " value={name} onChange={n => setName(n)}/>
                    </div>
                    <div className="row px-3">
                        <FormField label="Password: " value={password} onChange={e => setPassword(e)}/>
                    </div>
                </div>
                <div className="row mb-3 px-3 d-flex justify-content-center">
                    <Button width="50%" onClick={() => doUpdate()}>Save</Button>
                </div>
            </div>
        </BaseContainer>
    );
}

export default EditProfile;