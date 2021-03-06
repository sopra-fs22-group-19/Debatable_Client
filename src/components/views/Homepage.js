import React from 'react';
import {useHistory} from 'react-router-dom';
import "styles/views/Homepage.css";
import Header from "./Header";

const Homepage = () => {
    const history = useHistory();
    const name = localStorage.getItem("name");

    let content;

    content = (
        <div className="container-fluid px-1 px-md-5 px-lg-1 px-xl-5 py-5 mx-auto" style={{"align-items": "center"}}>
            <div id={"card-home"} className="card card0 border-0">
                <div className="row d-flex" style={{"align-items": "center"}}>
                    <div className="row px-3" style={{"margin-top": "10px", "margin-bottom": "10px"}}>
                        <div className="animated welcome" style={{"color":"white"}}>
                            <p style={{"font-style":"bold"}}>Welcome {name}</p>
                            <p> to </p>
                            <p style={{"font-style":"italic"}}> It's Debatable </p>
                        </div>

                        </div>
                    <div className="row px-3" style={{"margin-top": "10px", "margin-bottom": "10px"}}>
                        <div className="col"/>
                        <div className="col-6"  >
                            <div className="line" />
                        </div>
                        <div className="col"/>

                    </div>
                    <div className="row px-3" style={{"margin-top": "10px", "margin-bottom": "10px", "align-items": "center"}}>
                        <div className="col"/>
                        <div className="col-6">
                            <h3 id={"description"} style={{"font-style":"bold", "text-align": "center"}} className="col-20"> 
                                Debate with your friends and family on exciting range of debate topics or create your own debate topics.
                            </h3>
                        </div>
                        <div className="col"/>

                    </div>
                    <div className="row px-3" style={{"margin-top": "10px", "margin-bottom": "10px"}}>
                        <div className="col"/>
                        <div className="col  d-flex justify-content-center"  >
                            <button
                                onClick={() => {history.push('/topics')}}> Get Started</button>
                        </div>
                        <div className="col"/>

                    </div>
                    </div>
            </div>
        </div>


    )
    return (

    <div>
        <Header/>
        {content}
    </div>

    );
}

export default Homepage;
