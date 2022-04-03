import React from "react";
import {NavLink} from "react-router-dom";

const SignOutLinks = () =>
{
    return(
        <ul className="left">
            <li>
                <NavLink to={"/createDebate"}>
                    Create Debate
                </NavLink>
            </li>
            <li>
                <NavLink to={"/"}>
                    Log Out
                </NavLink>

            </li>
            <li>
                <NavLink to={"/"} className={'btn btn-floating blue lighten-1'}>
                    OO
                </NavLink>

            </li>
        </ul>
    )
}