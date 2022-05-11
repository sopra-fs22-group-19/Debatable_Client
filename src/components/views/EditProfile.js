import React, {useState} from 'react';
import {api, handleError} from 'helpers/api';
import User from 'models/User';
import {useHistory, useParams} from 'react-router-dom';
import {Button} from 'components/ui/Button';
import 'styles/views/Profile.scss';
import 'styles/views/Login.scss';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import Header from "./Header";

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

const EditProfile = props => {

    const {userId} = useParams();
    const history = useHistory();

    const [username, setUsername] = useState(null);
    const [name, setName] = useState(null);
    const [password, setPassword] = useState(null);


    console.log(userId)

    const doUpdate = async () => {
        try {
            const requestBody = JSON.stringify({username, name, password});
            const response = await api.put(`/users/${userId}`, requestBody);

            const user = new User(response.data);

            history.push(`/profile`);

        } catch (error) {
            alert(`Something went wrong during the process: \n${handleError(error)}`);
        }
    };

    return (
        <BaseContainer>
            <Header/>
            <div className="profile container">
                <div className="profile form">
                    <FormField label="Username: " value={username} onChange={un => setUsername(un)}/>
                    <FormField label="Name: " value={name} onChange={n => setName(n)}/>
                    <FormField label="Password: " value={password} onChange={e => setPassword(e)}/>
                    <div className="profile button-container">
                        <Button width="100%" onClick={() => doUpdate()}>Save</Button>
                    </div>
                </div>
            </div>
        </BaseContainer>
    );
}

export default EditProfile;