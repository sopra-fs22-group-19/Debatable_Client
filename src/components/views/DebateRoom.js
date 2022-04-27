import { Button } from 'components/ui/Button';
import {api, handleError} from 'helpers/api';
import {useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import {useParams} from 'react-router-dom/cjs/react-router-dom.min';
import "styles/views/DebateRoom.scss";
import { isProduction } from 'helpers/isProduction';
import { useLocation } from "react-router-dom";

const getLink = () => {
    const prodURL = 'https://sopra-fs22-group19-client.herokuapp.com/debateroom/'
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
    const [side, setSide] = useState(null);
    const [opponentSide, setOpponentSide] = useState(null);
    const [topic, setTopic] = useState(null);
    const [link, setlink] = useState(false);
    const [inviteDisable, setinviteDisable] = useState(false);
    const [opponent, showOpponent] = useState(false);
    const [start, setstart] = useState(false);
    const [startDisable, setstartDisable] = useState("flex");
    const [showEndDebate, setShowEndDebate] = useState(false);
    const [form_1, setForm_1] = useState(false);
    const [form_2, setForm_2] = useState(false);

    let {roomId} = useParams();
    roomId = parseInt(roomId);

    let debateState = "null";

    const location = useLocation();
    const userId = location.state.userId;

    let participant1;
    let participant2;

    const waiting = async (roomId) => {
        if(location.state.participant==="2") {
            // Once second participant come to debate room they will wait for first participant
            // to start the debate.
            while(true) {
                const response = await api.get("/debates/rooms/" + String(roomId));
                const status = response.data.debateStatus;

                if (status === "ONGOING_FOR" || status === "ONGOING_AGAINST") {
                    // debate started
                    showOpponent(true);
                    setShowEndDebate(true);
                    setstart(true);

                    // setting the opponent side
                    if (side === "FOR") {
                        setOpponentSide("AGAINST");
                    }
                    else {
                        setOpponentSide("FOR");
                    }
                    // since debate is started we don't have to send requests anymore.
                    // therefore break the while loop.
                    break;
                }
                else {
                    // if the debate has not started, we wait and send the request again after a small timeout.
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }
        }
        else {
            // if the participant is not second participant
            while(true) {
                // we wait for second participant to join the debate room
                const response = await api.get("/debates/rooms/" + String(roomId));
                const user2 =  response.data.user2;

                if (user2 === null) {
                    // if user2 is null, that means that second participant has not joined,
                    // therefore we wait for a while and then send a request again.
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
                // if user !== null which means that participant joined the debate,
                // in that case we will break the loop.
                else break;
            }

            // once second participant joined, we remove the link we were showing for first participant.
            // and we will show the start button.
            setlink(false);
            setstart(true);
        }
    }

    // Opponent chat should come here ...
    const Opponent = () => (
        <div>
            <div>{opponentSide}</div>
            <div className="debateRoom opponent-child"></div>
        </div>
    )

    // start debate on clicking start debate button for first participant.
    const startDebate = async () => {
        if (side === "FOR") {
            setOpponentSide("AGAINST");
            debateState = "ONGOING_FOR";

        }
        else {
            setOpponentSide("FOR");
            debateState = "ONGOING_AGAINST";

        }
        setForm_1(true);
        try {
            const requestBody = JSON.stringify({debateState});
            const response = await api.put("/debates/rooms/" + String(roomId) + "/status", requestBody);
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
            const response = await api.put("/debates/rooms/" + String(roomId) + "/status", requestBody);
        }
        catch (error) {
            console.error(`Something went wrong while ending the debate in debateroom: \n${handleError(error)}`);
            console.error("Details:", error);
            alert("Something went wrong while uending the debate in debateroom! See the console for details.");
        }

        if (userId === null) {
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
        while(true) {
            const response = await api.get("/debates/rooms/" + String(roomId));
            const data =  response.data
            const status = data.debateStatus;

            if (status === "ENDED") {
                if (userId === null) {
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

                // setting the side of user
                if (userId === debateRoom.user1.userId) {
                    setSide(debateRoom.side1)
                }

                if(location.state.participant==="2") {
                    try {
                        if (debateRoom.side1==="FOR")
                        {setSide("AGAINST")}
                        else {setSide("FOR")}

                        // update the debate room with user 2 information
                        const requestBody = JSON.stringify({userId});
                        const response = await api.put("/debates/rooms/" + String(roomId), requestBody);
                    }
                    catch (error){
                        console.error(`Something went wrong while updating userId in debateroom: \n${handleError(error)}`);
                        console.error("Details:", error);
                        alert("Something went wrong while updating userId in debateroom! See the console for details.");
                    }
                }
            } catch (error) {
                console.error(`Something went wrong while fetching the debate room data: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the debate room data! See the console for details.");
            }
        }
        fetchData();
    }, [userId, roomId, location.state.participant]);

    // post the message entered by participant
    async function enter_participant_1 (messageContent)  {
        try {
            const requestBody = JSON.stringify({roomId, userId, messageContent});
            const response = await api.post("/debates/rooms/" + String(roomId) + "/msg", requestBody);
            setForm_1(false)
            setForm_2(true)
        } catch (error) {
            alert(`Something went wrong during the messagin: \n${handleError(error)}`);
        }
    }
    function enter_participant_2()
    {
        setForm_2(false)
        setForm_1(true)
    }

    // defining content of participant 1 to return
    participant1 = (
        <div onLoad={
            isDebateEnded()
        }>
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
                        showOpponent(true)
                        setShowEndDebate(true)
                        startDebate()
                    }
                }
                /> : null}

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
                        {form_1 ?
                           <div>
                               <input type="text"
                                   placeholder="enter here your argument and press ENTER.."
                                      onKeyPress={(ev) => {
                                          if (ev.key === "Enter") {
                                              ev.preventDefault();
                                         enter_participant_1(ev.target.value);}
                                      }}
                            />
                           </div>
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
                            setlink(true)
                            setinviteDisable(true)
                            waiting(roomId)
                        }
                        }
                    />
                    {link ? <Link roomId={roomId}/> : null}
                    {opponent ? <Opponent opponentSide={opponentSide}/>: null}
                </div>
            </div>
        </div>

    );

    // defining content of participant 2 to return
    participant2 = (
        <div onLoad={
            waiting(roomId),
            isDebateEnded()
        }>
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
                        {form_2 ?
                            <div>
                                <input type="text"
                                       placeholder="enter here your argument and press ENTER.."
                                       onKeyPress={(ev) => {
                                           if (ev.key === "Enter") {
                                               ev.preventDefault();
                                               alert(ev.target.value);
                                               enter_participant_2();}
                                       }}
                                />
                            </div>
                            : null}
                    </div>
                </div>
                <div className="debateRoom chat-box-right">
                    {start ? null: <div className='debateRoom text'>Waiting for 1st participant to start the debate!</div>}
                    {opponent ? <Opponent opponentSide={opponentSide}/>: null}
                </div>
            </div>
        </div>
    );

    return (
        <div>
            {location.state.participant==="2"?participant2:participant1}
        </div>
    );
}

export default DebateRoom;