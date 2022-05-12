import React, {useState} from 'react';
import {Button} from "./Button";
import "styles/ui/Chat.css";

const MessageList = (props) => (
    <div className="row debateRoom chat-child">

            <ul  style={{"display":"inline"}}>
                {props.msgs.map(msg => (
                        <div
                            key = {props.msgs.indexOf(msg)}
                            className="debateRoom msg-box">
                            <p>{msg}</p>
                            <div className="dropdown show">
                                <a href="#" role="button"
                                   id="translate" data-toggle="dropdown" aria-haspopup="true"
                                   aria-expanded="false">
                                    Translate
                                </a>

                                <div className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                                    <a className="dropdown-item" href="#">English</a>
                                    <a className="dropdown-item" href="#">German</a>
                                </div>

                        </div>

                        </div>






                ))
                }

            </ul>

    </div>
);

const WriteBox = (props) => (
    <div className=" row debateRoom writer-child">
        {props.canWrite ?
            <input
                className="debateRoom input-text"
                placeholder="Enter here your argument and press ENTER"
                onChange={props.handleMessage}
                onKeyPress={
                    (ev) => {
                        if (ev.key === "Enter") {
                            ev.preventDefault();
                            props.postMessage();}
                    }}
            />
            : null}
    </div>
);



export const InviteLink = props => {
    const [showInviteLink, setShowInviteLink] = useState(false);

    return (
        <div className="row debateRoom chat-child-invite">
            {props.isDebateStarted ? null : <div className='row debateRoom text'>Invite user to join!</div>}
            <div className={"row justify-content-center"}>
            <Button
                className="debateRoom button-container"
                value="INVITE"
                hidden={showInviteLink}
                onClick={ () => { setShowInviteLink(true); } }
            />
            </div>
            {showInviteLink ? <div className='debateRoom parent-link'>
                Share this link for other participant to Join!
                <div className='debateRoom child-link'>
                    {props.inviteLink}
                </div>
            </div> : null
            }
        </div>
    )
}


export const Chat = props => {
    console.log("User name in me: "+ props.username);
    return (
             <div  className={"container-fluid debateRoom chat-box-" + props.chatBoxPosition}>
                <div  className="row chat-header">
                    <div className="user_info">
                        <span><h2>{props.side}</h2></span>
                        <p style={{"color":"#00000069"}}>{props.username}</p>
                    </div>
                </div>

                {props.withInviteButton ?
                    <InviteLink
                        isDebateStarted = {props.isDebateStarted}
                        inviteLink = {props.inviteLink}
                    /> : null
                }
                {props.displayWaitingMessage ?
                    <div  id={"waitMsg"} className='row debateRoom-text' > Waiting for 1st participant to start the debate! </div>: null
                }
                {props.displayMessageBox ?
                    <MessageList msgs={props.msgs}/> :
                    null
                }
                {props.withWriteBox ?
                    <WriteBox
                        canWrite={props.canWrite}
                        postMessage={props.postMessage}
                        handleMessage={props.handleMessage}
                    /> :
                    null
                }
            </div>

    );
}


