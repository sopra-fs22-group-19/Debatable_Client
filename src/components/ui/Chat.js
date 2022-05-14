import React, {useState} from 'react';
import {Button} from "./Button";
import {api, handleError} from 'helpers/api';
import "styles/ui/Chat.css";

const WriteBox = (props) => (
    <div className=" row debateRoom writer-child">
        {props.canWrite ?
            <input
                className="debateRoom input-text"
                placeholder="Enter here your argument..."
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
    const side = props.side;

    async function Translate(language, msg) {
        const request_to = "/translate?msg=" + msg + "&target_lang=" + language;
        try {
            const response = await api.get(request_to);
            document.getElementById(side + props.msgs.indexOf(msg)).innerHTML = response.data;
        }
        catch (error) {
            console.error(`Something went wrong while translatingmsg: \n${handleError(error)}`)
        }
      }

    const MessageList = (props) => (
        <div className="row debateRoom chat-child">
                <ul style={{"display":"inline"}}>
                    {props.msgs.map(msg => (
                        <div
                            key = {props.msgs.indexOf(msg)}
                            className="debateRoom msg-box">
                            <p>{msg}</p>
                            <div 
                                id = {side + props.msgs.indexOf(msg)}
                                className="dropdown show">
                                <a href="#" role="button"
                                    id="translate" data-toggle="dropdown" aria-haspopup="true"
                                    aria-expanded="false">
                                    Translate
                                </a>
                                <div className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                                    <a className="dropdown-item" href='javascript:;' onClick={()=>{Translate('ZH', msg)}}>Chinese</a>
                                    <a className="dropdown-item" href='javascript:;' onClick={()=>{Translate('EN', msg)}}>English</a>
                                    <a className="dropdown-item" href='javascript:;' onClick={()=>{Translate('DE', msg)}}>German</a>
                                    <a className="dropdown-item" href='javascript:;' onClick={()=>{Translate('EL', msg)}}>Greek</a>
                                    <a className="dropdown-item" href='javascript:;' onClick={()=>{Translate('ES', msg)}}>Spanish</a>
                                </div>
                            </div>
                        </div>
                    ))
                    }
                </ul>
        </div>
    );

    return (
             <div  className={"container-fluid debateRoom chat-box-" + props.chatBoxPosition}>
                <div  className="row chat-header">
                    <div className="user_info">
                        <span><h2>{side}</h2></span>
                        <p style={{"color":"#00000069"}}>{localStorage.username}</p>
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
