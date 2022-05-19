import React from "react";
import PropTypes from "prop-types";
import "styles/views/Header.scss";
import { isProduction } from 'helpers/isProduction';
import {useHistory} from "react-router-dom";

/**
 * This is an example of a Functional and stateless component (View) in React. Functional components are not classes and thus don't handle internal state changes.
 * Conceptually, components are like JavaScript functions. They accept arbitrary inputs (called “props”) and return React elements describing what should appear on the screen.
 * They are reusable pieces, and think about each piece in isolation.
 * Functional components have to return always something. However, they don't need a "render()" method.
 * https://reactjs.org/docs/components-and-props.html
 * @FunctionalComponent
 */

 const getBaseLink = () => {
    const prodURL = 'https://sopra-fs22-group19-client.herokuapp.com/'
    const devURL = 'http://localhost:3000/'
    return isProduction() ? prodURL : devURL;
}

const Header = () => {
    const history = useHistory();
    const baselink = getBaseLink();
    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("username");
        localStorage.removeItem("name");
        localStorage.removeItem("categories");
        history.push('/login');
    }
return(
    <nav className="navbar navbar-expand-lg navbar-light bg-light py-lg-0">
        <a className="navbar-brand mr-auto " href={baselink}>
            <img src={require('../../images/logo2.png')}

                                                  border="0" width="300" height="100" alt=""/>
        </a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav"
                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav" >
            <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                    <a className="nav-link" href={baselink+"home"}><i className="fa fa-fw fa-home"></i> Home <span className="sr-only">(current)</span></a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href={baselink+"profile"}><i className="fa fa-fw fa-user"></i>{localStorage.name}</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link"href={baselink+"topics"}><i className="fa fa-fw fa-list"></i>Topics</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href={baselink+"create_debate"}><i className="fa fa-fw fa-plus-square"></i> Create Debate</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href={baselink+"my_debates"}><i className="fa fa-fw fa-handshake-o"></i> My Debates</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" onClick={() => logout()}><i className="fa fa-fw fa-sign-out"></i> Logout</a>
                </li>
            </ul>
        </div>
    </nav>


);
}

Header.propTypes = {
  height: PropTypes.string
};

export default Header;
