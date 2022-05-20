import React, {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Button} from 'components/ui/Button';
import 'styles/ui/BaseContainer.scss';
import 'styles/views/Profile.scss';
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

    return (
            <div>
                <Header height={"100"}/>
                <div className='container-fluid px-1 px-md-5 px-lg-1 px-xl-5 py-5 mx-auto'></div>
                <div id="card2" className="border-0 px-4 py-5  d-flex justify-content-center" style={{"background-color":"white", "width":"40%"}}>
                    <div className="row mb-4 px-3 d-flex justify-content-center">
                        <div className="row px-3 mb-2" style={{"color":"green", "font-size": "x-large" }}>
                            Username: {username}
                        </div>

                        <div className="row px-3 mb-2" style={{"color":"green", "font-size": "x-large" }}>
                            Name: {name}
                        </div>

                        <div className="row px-3 mb-5" style={{"color":"green", "font-size": "x-large" }}>
                            Password: *****
                        </div>

                        <div className="row px-3  d-flex justify-content-center">
                            <Link to ={`/edit/${userId}`}>
                                <Button width="40%">Edit Profile</Button>
                            </Link>
                        </div>

                    </div>  
                </div>
            </div>
       
    );
}

export default Profile;