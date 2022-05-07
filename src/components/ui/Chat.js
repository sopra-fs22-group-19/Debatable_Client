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

    const [isStartDisabled, setIsStartDisabled] = useState("flex");

    return (
        <div>
            <div className="debateRoom topic-container">
                {props.topic}
            </div>
            {props.displayStartButton ?
                <Button
                    className="debateRoom button-start"
                    value="Start Debate"
                    style={{display:isStartDisabled}}
                    onClick={() => {
                        setIsStartDisabled("none")
                        props.startDebate();
                    }
                    }
                /> : null}
            {props.showEndDebate ?
                <Button
                    className="debateRoom button-end"
                    value="End Debate"
                    onClick={() => { props.endDebate() } }
                /> : null}
            <div>
                <div className="debateRoom chat-box-left">
                    <div>{props.side}</div>
                    <MessageList msgs = {props.msgs} />
                    <WriteBox
                        canWrite = {props.canWrite}
                        postMessage = {props.postMessage}
                        handleMessage = {props.handleMessage}
                    />
                </div>
            </div>
        </div>
    );
}


