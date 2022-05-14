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


const WriteBox = (props) => {

const [count, setCount] = React.useState(0);
return(

    <div className=" row debateRoom writer-child">
        {props.canWrite ?
                <div id={"wrapper"}>
                    <div className="input-group">
                    <input id="debateRoom-input-text" type="text" className="form-control input-sm chat_input"
                           placeholder="Write your argument here..."onChange={e => { setCount(e.target.value.length); props.handleMessage() }}
                           maxlength="2000"
                           onKeyPress={(ev) => {
                               if (ev.key === "Enter") {
                                   ev.preventDefault();
                                   props.postMessage();
                               setCount(0)}
                           }}/>
                    <span style={{"align-self":"center"}} className="input-group-btn">
                            <button className="btn btn-dark btn-sm" id="btn-chat"
                                    onClick={()=>{props.postMessage();}}>
                                <i className="fa fa-paper-plane fa-1x"
                                   aria-hidden="true"></i></button>
                            </span>
                    </div>

            <p style={{"font-size":"12px", "margin-top":"0.4em"}}>
                {count}/2000
            </p>
                </div>
            : null}
                </div>


)
};



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


