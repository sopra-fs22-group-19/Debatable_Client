import React, {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import User from 'models/User';
import {useHistory} from 'react-router-dom';
import {Button} from 'components/ui/Button';
import 'styles/views/Profile.scss';
import BaseContainer from "components/ui/BaseContainer";
import { Link } from 'react-router-dom';
import Header from "./Header";


const Profile = props => {

    const userId = localStorage.getItem("actualUser");

    const [username, setUsername] = useState(null);
    const [name, setName] = useState(null);

    useEffect(() => {

        async function fetchData() {
            try {
                const response = await api.get(`/users/${userId}`);

                const user = new User(response.data);

                localStorage.setItem("editUser", userId)
                console.log(localStorage.getItem("editUser"))

                setUsername(user.username);
                setName(user.name);

            } catch (error) {
                console.error(`Something went wrong while displaying the user info: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the users! See the console for details.");
            }
        }

        fetchData();
    }, []);

    const FormField = props => {
        return (
            <div className="profile field">
                <label className="profile label">{props.label}</label>
            </div>
        );
    }

    return (
        <BaseContainer>
            <Header/>
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