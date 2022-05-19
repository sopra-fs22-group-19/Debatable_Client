import React, {useEffect, useState} from 'react';
import {api, handleError, profileApi} from 'helpers/api';
import {Button} from 'components/ui/Button';
import 'styles/views/Profile.scss';
import BaseContainer from "components/ui/BaseContainer";
import { Link } from 'react-router-dom';
import Header from "./Header";
import {getDomain} from "../../helpers/getDomain";
import axios from "axios";


const Profile = props => {

    const userId = localStorage.getItem("actualUser");
    const password = localStorage.getItem("password");
    const getUn = localStorage.getItem("username");

    const [username, setUsername] = useState(null);
    const [name, setName] = useState(null);

    useEffect(() => {
        console.log({getUn},{password});

        async function fetchData() {
            try {

                let profileURL = getDomain()+`users/${userId}`;

                const headers = {
                    'Content-Type': 'application/json',
                    auth: {
                        username: {getUn},
                        password: {password}
                    }
                };

                //const response = await axios.get(profileURL, headers);
                //const response = await profileApi.get(`/users/${userId}`);

                const response = await api.get(`/users/${userId}`);

                localStorage.setItem("editUser", userId)
                console.log(localStorage.getItem("editUser"))

                setUsername(response.data["username"]);
                setName(response.data["name"]);

            } catch (error) {
                console.error(`Something went wrong while displaying the user info: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the users! See the console for details.");
            }
        }

        fetchData();
    }, [userId]);

    const FormField = props => {
        return (
            <div className="profile field">
                <label className="profile label">{props.label}</label>
            </div>
        );
    }

    return (
        <BaseContainer>
            <Header height={"100"}/>
            <div className="profile container">
                <div className="profile form">
                    <FormField label="Username"/>
                    <Button disabled={true}>{username}</Button>
                    <FormField label="Name"/>
                    <Button disabled={true}>{name}</Button>
                </div>
                <div className="profile button-container">
                    <Link to ={`/edit/${userId}`}>
                        <Button>Edit Profile</Button>
                    </Link>
                </div>
            </div>
        </BaseContainer>
    );
}

export default Profile;