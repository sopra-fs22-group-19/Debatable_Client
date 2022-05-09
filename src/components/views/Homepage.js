import { Button } from 'components/ui/Button';
import {api, handleError} from 'helpers/api';
import React, {useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import {useParams} from 'react-router-dom/cjs/react-router-dom.min';
import "styles/views/Homepage.css";
import { isProduction } from 'helpers/isProduction';
import { useLocation } from "react-router-dom";
import Header from "./Header";


// BUG: when going back to homepage and then joing the same debate topic with same side, 
// user should not create a new one but should go to the same one.

const Homepage = () => {
    const history = useHistory();
    const username = localStorage.getItem("username");


    return (
        <div>
        <Header height={"100"}/>
        <div className="container-fluid px-1 px-md-5 px-lg-1 px-xl-5 py-5 mx-auto">
            <div className="card card0 border-0 " style={{"background-color": "transparent"}} >
                <div className="row d-flex"style={{ "text-align":"center"}}>
                    <div className="animated welcome" style={{"color":"white"}}>
                        <p style={{"font-style":"bold"}}>Welcome {username}</p>
                        <p> to </p>
                        <p style={{"font-style":"italic"}}> It's Debatable </p>
                        <h3 style={{"font-style":"bold"}}> The platform where you can discuss either
                            about interesting existing topics or create your own topic and defend your side!
                        </h3>
                        <button
                            onClick={() => {history.push('/topics')}}> Get Started</button>
                    </div>
                </div>

                </div>
            </div>
        </div>


    );
}

export default Homepage;
