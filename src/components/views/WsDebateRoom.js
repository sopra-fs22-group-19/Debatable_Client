import { Button } from 'components/ui/Button';
import {Chat} from 'components/ui/Chat'
import {useEffect, useState} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import "styles/views/wsDebateRoom.scss";
import { isProduction } from 'helpers/isProduction';
import {over} from 'stompjs';
import SockJS from 'sockjs-client';
import {api, handleError} from "../../helpers/api";


var stompClient =null;


const getLink = () => {
    const prodURL = 'https://sopra-fs22-group19-client.herokuapp.com/debateroom/'
    //const prodURL = "https://sopra-debatable-client-app.herokuapp.com/debateroom/"
    const devURL = 'http://localhost:3000/debateroom/'
    return isProduction() ? prodURL : devURL;
}

const StartButton = (props) => (
    <div>
        {props.displayStartButton ?
            <Button
                className="debateRoom button-start"
                value="Start Debate"
                style={{display: props.isStartDisabled}}
                onClick={() => {
                    props.setIsStartDisabled("none")
                    props.startDebate();
                }
                }
            /> : null
        }
    </div>
);

const EndButton = (props) => (
    <div>
        {props.displayEndButton ?
            <Button
                className="debateRoom button-end"
                value="End Debate"
                onClick={() => {
                    props.endDebate()
                }}
            /> : null}
    </div>
);


const DebateRoom = () => {
    const history = useHistory();
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    let {roomId} = useParams();
    roomId = parseInt(roomId);

    const [userState, setUserState] = useState({
        userName: "",
        userSide: "",
        isStartingSide: false,
        isInvitedSide: false,
        isObserver: false,
        canWrite: false
    });

    const [roomStatus, setRoomStatus] = useState({
        topic: '',
        description: '',
        debateStatus: ' '
    });

    const [debateMsg, setDebateMsg] = useState([]);

    const [userData, setUserData] = useState({
        userId: '',
        connected: false,
        message: ''
    });

    // UI related states (display buttons and so so)
    const [displayStartButton, setDisplayStartButton] = useState(true);
    const [isStartDisabled, setIsStartDisabled] = useState("flex");
    const [displayEndButton, setDisplayEndButton] = useState(false);
    const [displayInviteButton, setDisplayInviteButton] =  useState(true);


    const defineUserStartingState = (debateRoom) => {
        if (debateRoom.user1) {
            if (parseInt(userId) === debateRoom.user1.userId) {
                setUserState({...userState,
                    'userSide': debateRoom.side1,
                    'isStartingSide': true,
                    'canWrite': false
                });
            }
        } else if (debateRoom.user2){
            if (parseInt(userId) === debateRoom.user2.userId ){
                setUserState({...userState,
                    'userSide': debateRoom.side2,
                    'isInvitedSide': true,
                    'canWrite': false
                });
            }
        } else{
            setUserState({...userState,
                'isObserver': true
            });
        }

    }

    // Populate information relevant to the debate room on mount
    useEffect(() => {
        async function fetchData() {
            try {
                const response = await api.get("/debates/rooms/" + String(roomId));
                const debateRoom = response.data
                setRoomStatus({...roomStatus,
                    'topic': debateRoom.debate.topic,
                    'description': debateRoom.debate.description,
                    'debateStatus': debateRoom.debateStatus
                    }
                )
                defineUserStartingState(debateRoom);

            } catch (error) {
                console.error(`Something went wrong while fetching the debate room data: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the debate room data! See the console for details.");
            }
        } fetchData();

    }, []);

    const updateDebateStateAtBackend = async (newState) => {
        try {
            // update debate state to ENDED in the backend
            let debateState = newState;
            const requestBody = JSON.stringify({debateState});
            await api.put("/debates/rooms/" + String(roomId) + "/status", requestBody);
        }
        catch (error) {
            console.error(`Something went wrong while updating state of debateroom in backend: \n${handleError(error)}`);
            console.error("Details:", error);
            alert("Something went wrong while updating the state of the debateroom to " + String(newState) + "!" +
                " See the console for details.");
        }
    }

    // Handle start of debate button
    const startDebate = async () => {

        if (roomStatus.debateStatus === 'READY_TO_START' || roomStatus.debateStatus === 'ONE_USER_FOR') {
            await updateDebateStateAtBackend("ONGOING_" + String(userState.userSide));
            connect(); // connect to websocket
            setDisplayStartButton(true);
            setDisplayEndButton(true);
            setUserState({...userState, 'canWrite': true});
            console.log("Debate started");
        } else {
            console.error("Cannot start debate yet, debateStatus must be at READY_TO_START");
        }
    }

    const endDebate = async () => {
        await updateDebateStateAtBackend("ENDED");

        if (userState.userName === "Guest") {
            if (process.env.NODE_ENV === "production") {
                localStorage.removeItem("token");
                localStorage.removeItem("userId");
            }
            history.push("/login");
        }
        else {
            history.push( "/home");
        }
    }

    // Methods related to Websocket
    const connect =() => {
        let Sock = new SockJS('http://localhost:8080/ws-endpoint');
        stompClient = over(Sock);
        stompClient.connect({},onConnected, onError);
    }

    const onConnected = () => {
        setUserData({...userData, "connected": true});
        stompClient.subscribe('/debates/rooms/' + String(roomId), onMessageReceived );
        userJoin();
    }

    const onError = (err) => {
        console.log("Error connecting to the websocket")
        console.log(err);
    }

    const userJoin=()=>{
        var chatMessage = {
            senderName: userData.username,
            status:"JOIN"
        };
        stompClient.send('/debates/rooms/' + String(roomId) + '/msg', {}, JSON.stringify(chatMessage));
    }


    const handleMessage = (event) => {
        const {value}=event.target;
        setUserData({...userData, "message": value});
    }

    const sendValue=()=>{
        if (stompClient) {
            var chatMessage = {
                userId:userData.userId,
                roomId:roomStatus.roomId,
                message: userData.message,
                status:"MESSAGE"
            };
            console.log(chatMessage);
            console.log(userState.isStartingSide);
            console.log(userState.userSide);
            console.log(userState.isInvitedSide);
            console.log(userState.isObserver);
            stompClient.send('/ws/debates/rooms/' + String(roomId) + '/msg', {}, JSON.stringify(chatMessage));
            setUserData({...userData, "message": ""});
        }
    }

    const onMessageReceived = (incoming)=>{
        debateMsg.push(incoming.body);
        setDebateMsg([...debateMsg]);
    }


    return (
        <div className="container">
            <div className="debateRoom topic-container">
                {roomStatus.topic}
            </div>
            <div>
                <StartButton
                    isStartDisabled = {isStartDisabled}
                    setIsStartDisabled = {setIsStartDisabled}
                    displayStartButton = {displayStartButton}
                    startDebate={startDebate}
                />
            </div>
            <div>
                <EndButton
                    displayEndButton = {displayEndButton}
                    endDebate = {endDebate}
                />
            </div>
            <div>
                <Chat
                    chatBoxPosition={'left'}
                    side={userState.userSide}
                    msgs={debateMsg}
                    withWriteBox = {true}
                    canWrite={userState.canWrite}
                    postMessage={sendValue}
                    handleMessage={handleMessage}
                />
            </div>
            <div>
                <Chat
                    chatBoxPosition={'right'}
                    side={"FOR"}
                    msgs={debateMsg}
                    withWriteBox = {false}
                />
            </div>
        </div>
    )
}

export default DebateRoom;