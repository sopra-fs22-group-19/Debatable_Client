import React, {useState} from 'react';
import {Button} from "./Button";

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

export const Chat = props => {

    return (
        <div>
            <div className={"debateRoom chat-box-" + props.chatBoxPosition}>
                <div>{props.side}</div>
                <MessageList msgs={props.msgs}/>
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


