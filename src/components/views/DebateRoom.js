import { Button } from 'components/ui/Button';
import {api, handleError} from 'helpers/api';
import {useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import {useParams} from 'react-router-dom/cjs/react-router-dom.min';
import "styles/views/DebateRoom.scss";
import { isProduction } from 'helpers/isProduction';
import { useLocation } from "react-router-dom";

var waitStart = false;
var waitJoin = false;
var checkEnd = false;

const getLink = () => {
    //const prodURL = 'https://sopra-fs22-group19-client.herokuapp.com/debateroom/'
    const prodURL = "https://sopra-debatable-client-app.herokuapp.com/debateroom/"
    const devURL = 'http://localhost:3000/debateroom/'
    return isProduction() ? prodURL : devURL;
}

const Link = props => (
    <div className='debateRoom parent-link'>
        Share this link for other participant to Join!
        <div className='debateRoom child-link'>
            {getLink()}{props.roomId}/2
        </div>
    </div>
)

const DebateRoom = () => {
    const history = useHistory();
    const [inviteDisable, setinviteDisable] = useState(false);
    const [topic, setTopic] = useState(null);
    const [startDisable, setstartDisable] = useState("flex");
    const [writer, setWriterBox] = useState(false);
    const [side, setSide] = useState(null);
    const [link, setLink] = useState(false);
    const [start, setStart] = useState(false)
    const [opponent, setOpponent] = useState(false);
    const [opponentId, setOpponentId] = useState(null);
    const [showEndDebate, setShowEndDebate] = useState(false);
    const [opponentSide, setOpponentSide] = useState(null);
    const [msgs, setMsgs] = useState(null);
    const [showMsg, setShowMsg] = useState(false);
    const [receiveMsg, setRecieveMsg] = useState(false);
    const [opponentMsgs, setOpponentMsgs] = useState(null);
    const [showOpponentMsgs, setShowOpponentMsgs] = useState(null);

    const location = useLocation();

    // userId is null for guest user
    const userId = location.state.userId;

    let {roomId} = useParams();
    roomId = parseInt(roomId);

    let debateState = "null";
    let content;

    async function wait_to_join (roomId)  {
        while(waitJoin) {
            // we wait for second participant to join the debate room
            const response = await api.get("/debates/rooms/" + String(roomId));
            const user2 =  response.data.user2;
    
            if (user2 === null) {
                // if user2 is null, that means that second participant has not joined,
                // therefore we wait for a while and then send a request again.
                
                await new Promise(resolve => setTimeout(resolve, 5000));
            }
            // if user !== null which means that participant joined the debate,
            // in that case we will break the loop.
            else {
                setOpponentId(user2.userId);
                break;
            }
        }
    
        // once second participant joined, we remove the link we were showing for first participant.
        // and we will show the start button.
        setLink(false);
        setStart(true);
    }

    async function  wait_to_start (roomId) {
        while(waitStart) {
            const response = await api.get("/debates/rooms/" + String(roomId));
            const status = response.data.debateStatus;
    
            if (status === "ONGOING_FOR" || status === "ONGOING_AGAINST") {
                // debate started
                setOpponent(true);
                setShowEndDebate(true);
                setStart(true);
                setRecieveMsg(true);
    
                // setting the opponent side
                if (side === "FOR") {
                    setOpponentSide("AGAINST");
                }
                else {
                    setOpponentSide("FOR");
                }
                checkEnd = true;
                // since debate is started we don't have to send requests anymore.
                // therefore break the while loop.
                break;
            }
            else {
                // if the debate has not started, we wait and send the request again after a small timeout.
                await new Promise(resolve => setTimeout(resolve, 3000));
            }
        }
    }

    // Opponent chat should come here ...
    const Opponent = () => (
        <div>
            <div>{opponentSide}</div>
            <div 
            className="debateRoom opponent-child"
            onLoad={receiving_msgs()}
            >
            <div>
                {showOpponentMsgs ? <ul>
                    {opponentMsgs.map(msg => (
                        <div>
                            <div
                                key = {opponentMsgs.indexOf(msg)}
                                className="debateRoom msg-box">
                                {msg}
                            </div>
                        </div>
                        ))}
                </ul>: null}
            </div>
            </div>
        </div>
    )

    // start debate on clicking start debate button for first participant.
    const startDebate = async () => {
        if (side === "FOR") {
            setOpponentSide("AGAINST")
            debateState = "ONGOING_FOR";
        }
        else {
            setOpponentSide("FOR")
            debateState = "ONGOING_AGAINST";

        }
        setWriterBox(true);
        try {
            const requestBody = JSON.stringify({debateState});
            await api.put("/debates/rooms/" + String(roomId) + "/status", requestBody);
        }
        catch (error) {
            console.error(`Something went wrong while updating debate Status in debateroom: \n${handleError(error)}`);
            console.error("Details:", error);
            alert("Something went wrong while updating debate Status in debateroom! See the console for details.");
        }
    }

    // end the debate on clicking end debate button, push the users to homepage and guest to login page
    const endDebate = async () => {
        try {
            debateState = "ENDED";
            const requestBody = JSON.stringify({debateState});
            await api.put("/debates/rooms/" + String(roomId) + "/status", requestBody);
        }
        catch (error) {
            console.error(`Something went wrong while ending the debate in debateroom: \n${handleError(error)}`);
            console.error("Details:", error);
            alert("Something went wrong while uending the debate in debateroom! See the console for details.");
        }

        waitStart = false;
        waitJoin = false;
        checkEnd = false;

        if (userId === null) {
            if (process.env.NODE_ENV === "production") {
                localStorage.removeItem("token");
            }
            history.push("/login");
        }
        else {
            history.push(
                {
                  pathname: "/home",
                  state: {userId: userId}
                }
            );
        }
    }

    // We keep on checking if a debate is ended by either of the user. 
    // If that's the case, then we will push the other user to login page and home page depending 
    // on if they are guest user or logged in user.
    const isDebateEnded = async () => {
        while(checkEnd) {
            const response = await api.get("/debates/rooms/" + String(roomId));
            const data =  response.data
            const status = data.debateStatus;

            if (status === "ENDED") {
                waitStart = false;
                waitJoin = false;
                checkEnd = false;

                if (userId === null) {
                    if (process.env.NODE_ENV === "production") {
                        localStorage.removeItem("token");
                    }
                    history.push("/login");
                }
                else {
                    history.push(
                        {
                          pathname: "/home",
                          state: {userId: userId}
                        }
                    );
                }    
                break;
            }
            else {
                await new Promise(resolve => setTimeout(resolve, 5000));
            }
        }
    }

    // post the message entered by participant
    async function left_chat_box (messageContent)  {
        try {
            // BUG: potential bug here regarding userId
            const requestBody = JSON.stringify({roomId, userId, messageContent});
            await api.post("/debates/rooms/" + String(roomId) + "/msg", requestBody);
            setWriterBox(false);
        } catch (error) {
            alert(`Something went wrong during the messagin: \n${handleError(error)}`);
        }
        try {
            const get_response = await api.get("debates/rooms/"+String(roomId)+"/users/"+String(userId)+"/msgs?top_i=1&to_top_j=5");
            setMsgs(get_response.data);
            setShowMsg(true);
        } catch (error) {
            console.error(`Something went wrong while getting the messages debate room data: \n${handleError(error)}`);
            console.error("Details:", error);
            alert("Something went wrong while getting the messages debate room data! See the console for details.");
        }
    }

    async function receiving_msgs () {
        console.log("receving messages")
        if (opponentId !== null) {
            while(receiveMsg) {
                console.log("inside while loop of receiving messages");
                try {
                    const get_msgs = await api.get("debates/rooms/"+String(roomId)+"/users/"+String(opponentId)+"/msgs?top_i=1&to_top_j=3");
                    if (get_msgs.data.length > 0) {
                        setOpponentMsgs(get_msgs.data);
                        setShowOpponentMsgs(true);
                        //setRecieveMsg(false);
                        break;
                    }
                }
                catch (error){
                    console.error(`Something went wrong while getting the messages debate room data: \n${handleError(error)}`);
                    console.error("Details:", error);
                    alert("Something went wrong while getting the messages debate room data! See the console for details.");
                }
                await new Promise(resolve => setTimeout(resolve, 10000));
            }
        }
    }

    // fetch the data on entering debate room
    useEffect(() => {
        async function fetchData() {
            try {
                const response = await api.get("/debates/rooms/" + String(roomId));
                const debateRoom = response.data

                // setting the debate topic
                setTopic(debateRoom.debate.topic)

                if(location.state.participant==="2") {
                    // setting opponent id for second participant
                    setOpponentId(debateRoom.user1.userId);
                    waitStart = true;
                    try {
                        if (debateRoom.side1==="FOR") {
                            setSide("AGAINST");
                        }
                        else {
                            setSide("FOR");
                        }
    
                        if (userId !== null) {
                            // update the debate room with user 2 information when user is not guest user
                            const requestBody = JSON.stringify({userId});
                            await api.put("/debates/rooms/" + String(roomId), requestBody);
                        }
                    }
                    catch (error){
                        console.error(`Something went wrong while updating userId in debateroom: \n${handleError(error)}`);
                        console.error("Details:", error);
                        alert("Something went wrong while updating userId in debateroom! See the console for details.");
                    }
                }
                // setting the side of user
                if (userId === debateRoom.user1.userId) {
                    setSide(debateRoom.side1);
                }
            } catch (error) {
                console.error(`Something went wrong while fetching the debate room data: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the debate room data! See the console for details.");
            }
        }
        fetchData();
    }, [userId, roomId, location.state.participant, side]);

    // defining content of participant 2 to return
    if (location.state.participant==="2") {
        content = (
            <div>
                <div className="debateRoom topic-container">
                    {topic}
                </div>
                {showEndDebate ? 
                    <Button
                        className="debateRoom button-end"
                        value="End Debate"
                        onClick={() => {
                            endDebate()
                        }}
                    /> : null}
                <div>
                    <div className="debateRoom chat-box-left">
                        <div>{side}</div>
                        <div className="debateRoom chat-child"></div>
                        <div className="debateRoom writer-child">
                            {writer ?
                                    <input
                                        className="debateRoom input-text"
                                        placeholder="Enter here your argument and press ENTER"
                                            onKeyPress={(ev) => {
                                                if (ev.key === "Enter") {
                                                    ev.preventDefault();
                                                    left_chat_box(ev.target.value);}
                                            }}
                                />
                                    : null}
                        </div>
                    </div>
                    <div className="debateRoom chat-box-right">
                        {start ? null: 
                            <div 
                                className='debateRoom text'
                                onLoad={wait_to_start(roomId)}
                                >
                                Waiting for 1st participant to start the debate!
                            </div>}
                        {opponent ? 
                        <Opponent 
                            opponentSide={opponentSide}
                            onLoad={isDebateEnded()}
                        />: null}
                    </div>
                </div>
            </div>
        );
    }
    else {
        // defining content of participant 1 to return
        content = (
            <div>
                <div className="debateRoom topic-container">
                    {topic}
                </div>

                {start ?
                    <Button
                        className="debateRoom button-start"
                        value="Start Debate"
                        style={{display:startDisable}}
                        onClick={() => {
                            setstartDisable("none")
                            setOpponent(true)
                            setShowEndDebate(true);
                            startDebate()
                            checkEnd=true
                        }
                    }
                    /> : null}

                {showEndDebate ? 
                    <Button
                        className="debateRoom button-end"
                        value="End Debate"
                        onLoad={isDebateEnded()}
                        onClick={() => {
                            endDebate()
                        }}
                    /> : null}

                <div>
                    <div className="debateRoom chat-box-left">
                        <div>{side}</div>
                        <div className="debateRoom chat-child">
                            <div>
                                {showMsg ? <ul>
                                    {msgs.map(msg => (
                                        <div>
                                            <div
                                                key = {msgs.indexOf(msg)}
                                                className="debateRoom msg-box">
                                                {msg}
                                            </div>
                                        </div>
                                        ))}
                                </ul>: null}
                            </div>
                        </div>
                        <div className="debateRoom writer-child">
                            {writer ?
                                <input
                                    className="debateRoom input-text"
                                    placeholder="Enter here your argument and press ENTER"
                                        onKeyPress={(ev) => {
                                            if (ev.key === "Enter") {
                                                ev.preventDefault();
                                                left_chat_box(ev.target.value);}
                                        }}
                            />
                                : null}
                        </div>
                    </div>
                    <div className="debateRoom chat-box-right">
                        {start ? null: <div className='debateRoom text'>Invite user to join!</div>}
                        <Button
                            className="debateRoom button-container"
                            value="INVITE"
                            hidden={inviteDisable}
                            onClick={() => {
                                setLink(true);
                                setinviteDisable(true);
                                waitJoin = true;
                                wait_to_join(roomId)
                            }
                            }
                        />
                        {link ? <Link roomId={roomId}/> : null}
                        {opponent ? <Opponent opponentSide={opponentSide}/>: null}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            {content}
        </div>
    );
}

export default DebateRoom;