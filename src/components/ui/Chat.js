import React from 'react';
import {Button} from "./Button";

const WriteBox = (props) => (
    <div className="debateRoom writer-child">
        {props.canWrite ?
            <input
                className="debateRoom input-text"
                placeholder="Enter here your argument and press ENTER"
                onKeyPress={
                (ev) => {
                    if (ev.key === "Enter") {
                        ev.preventDefault();
                        props.postMessage(ev.target.value);}
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
                    <div>
                        <div
                            key = {props.msgs.indexOf(msg)}
                            className="debateRoom msg-box">
                            {msg}
                        </div>
                    </div>
                ))
                }
            </ul>
        </div>
    </div>
);

export const Chat = props => {

    // You can use Hooks here!
    return (
        <div>
            <div className="debateRoom topic-container">
                {props.topic}
            </div>

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
                        postMessage = {() => { props.postMessage() } }
                    />
                </div>
            </div>
        </div>
    );
}


