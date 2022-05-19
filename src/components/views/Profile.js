import React, {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Button} from 'components/ui/Button';
import 'styles/ui/BaseContainer.scss';
import 'styles/views/Login_Trial.css';
import { Link } from 'react-router-dom';
import Header from "./Header";


const Profile = () => {

    const userId = localStorage.getItem("userId");

    const [username, setUsername] = useState(null);
    const [name, setName] = useState(null);

    useEffect(() => {

        async function fetchData() {
            try {
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
       <div>
            <Header height={"100"}/>
            <div id="card2" className="card2 card border-0 px-4 py-5">
                <div className="row mb-4 px-3  d-flex justify-content-center">
                    <div className="row px-3">
                        <FormField label="Username:"/>
                    </div>
                    <Button disabled={true}>{username}</Button>
                    <div className="row px-3">
                        <FormField label="Name:"/>
                    </div>
                    <Button disabled={true}>{name}</Button>
                </div>
                <div className="row mb-3 px-3 d-flex justify-content-center">
                    <Link to ={`/edit/${userId}`}>
                        <Button width="50%">Edit Profile</Button>
                    </Link>
                </div>
            </div>
       </div>
    );
}

export default Profile;