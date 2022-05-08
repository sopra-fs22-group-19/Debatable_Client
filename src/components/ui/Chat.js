import React, {useState} from 'react';
import {Button} from "./Button";

const MessageList = (props) => (
    <div className="debateRoom chat-child">
        <div>
            <ul>
                {props.msgs.map(msg => (
                        <div
                            key = {props.msgs.indexOf(msg)}
                            className="debateRoom msg-box">
                            {msg}
                        </div>
                ))
                }
            </ul>
        </div>
    </div>
);

const WriteBox = (props) => (
    <div className="debateRoom writer-child">
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
        <div>
            {props.isDebateStarted ? null : <div className='debateRoom text'>Invite user to join!</div>}
            <Button
                className="debateRoom button-container"
                value="INVITE"
                hidden={showInviteLink}
                onClick={ () => { setShowInviteLink(true); } }
            />
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

    return (
        <div>
            <div className={"debateRoom chat-box-" + props.chatBoxPosition}>
                <div>{props.side}</div>
                {props.withInviteButton ?
                    <InviteLink
                        isDebateStarted = {props.isDebateStarted}
                        inviteLink = {props.inviteLink}
                    />:
                    <MessageList msgs={props.msgs}/>
                }
                {props.withWriteBox ?
                    <WriteBox
                        canWrite={props.canWrite}
                        postMessage={props.postMessage}
                        handleMessage={props.handleMessage}
                    /> :
                    null}
            </div>
        </div>
    );
}


