import React from "react";
import PropTypes from "prop-types";
import {Container, Navbar, Nav } from "react-bootstrap";
import "styles/views/Header.scss";


/**
 * This is an example of a Functional and stateless component (View) in React. Functional components are not classes and thus don't handle internal state changes.
 * Conceptually, components are like JavaScript functions. They accept arbitrary inputs (called “props”) and return React elements describing what should appear on the screen.
 * They are reusable pieces, and think about each piece in isolation.
 * Functional components have to return always something. However, they don't need a "render()" method.
 * https://reactjs.org/docs/components-and-props.html
 * @FunctionalComponent
 */
const Header = props => {
return(

    <div className="navbar">
        <a href="profile">User</a>
        <a href="create_debate">Create Debate</a>
        <a href="home">Homepage</a>
        <div className="dropdown">
            <button className="dropbtn">More
                <i className="fa fa-caret-down"></i>
            </button>
            <div className="dropdown-content">
                <a href="#">Link 1</a>
                <a href="#">Link 2</a>
                <a href="#">Link 3</a>
            </div>
        </div>
    </div>


);
}

Header.propTypes = {
  height: PropTypes.string
};

/**
 * Don't forget to export your component!
 */
export default Header;
