import { Button } from 'components/ui/Button';
import {Chat} from 'components/ui/Chat'
import {useEffect, useState} from 'react';
import {useHistory, useLocation, useParams} from 'react-router-dom';
import "styles/views/wsDebateRoom.scss";
import { isProduction } from 'helpers/isProduction';
import {over} from 'stompjs';
import SockJS from 'sockjs-client';
import {api, handleError} from "../../helpers/api";
import user from "../../models/User";


var stompClient =null;


const getLink = () => {
    const prodURL = 'https://sopra-fs22-group19-client.herokuapp.com'
    //const prodURL = "https://sopra-debatable-client-app.herokuapp.com/debateroom/"
    const devURL = 'http://localhost:3000'
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
    const location = useLocation();
    const history = useHistory();
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    let {roomId} = useParams();
    roomId = parseInt(roomId);

    const [userState, setUserState] = useState({
        userName: "",
        userSide: "",
        opposingSide: "",
        isStartingSide: false,
        isInvitedSide: false,
        isObserver: false,
        canWrite: false
    });

    const [roomStatus, setRoomStatus] = useState({
        topic: '',
        description: '',
        debateStatus: ' ',
        debateStarted: false
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
                    'userName': debateRoom.user1.userName,
                    'userSide': debateRoom.side1,
                    'opposingSide': (debateRoom.side1 === 'FOR') ? 'AGAINST' : 'FOR',
                    'isStartingSide': true,
                    'canWrite': false
                });

                return debateRoom.user1.username;
            }
        } else if (debateRoom.user2){
            if (parseInt(userId) === debateRoom.user2.userId ){
                setUserState({...userState,
                    'userName': debateRoom.user2.userName,
                    'userSide': debateRoom.side2,
                    'opposingSide': (debateRoom.side2 === 'FOR') ? 'AGAINST' : 'FOR',
                    'isInvitedSide': true,
                    'canWrite': false
                });

                return debateRoom.user2.username;
            }
        } else{
            setUserState({...userState,
                'userSide': 'FOR',
                'opposingSide': 'AGAINST',
                'isObserver': true
            });

            return String(userId);
        }

    }

    const addSecondParticipant = async () => {
        try {
            // update the debate room with user 2 information
            const requestBody = JSON.stringify({"userId": userId});
            const response = await api.put("/debates/rooms/" + String(roomId), requestBody);
            console.log(response.data.debateStatus);
            // TODO: Send websocket message to update state to ready
        } catch (error) {
            console.error(`Something went wrong while updating userId in debateroom: \n${handleError(error)}`);
            console.error("Details:", error);
            alert("Something went wrong while updating userId in debateroom! See the console for details.");
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

                let userName = defineUserStartingState(debateRoom);

                if (location.state.isInvitee && debateRoom.side2 === null){ addSecondParticipant(debateRoom); }

                console.log(userName, debateRoom.debateStatus);
                connectToRoomWS(userName, debateRoom.debateStatus);

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
            connectToRoomWS(); // connect to websocket
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
    const connectToRoomWS =(userName, debateState) => {
        let Sock = new SockJS('http://localhost:8080/ws-endpoint');
        stompClient = over(Sock);
        stompClient.connect({}, () => onConnected(userName, debateState),  onError);
    }

    const onConnected = (userName, debateState) => {
        console.log(userName, debateState);
        setUserData({...userData, "connected": true});
        stompClient.subscribe('/debates/rooms/' + String(roomId), onMessageReceived );
        userJoin(userName, debateState);
    }

    const onError = (err) => {
        console.log("Error connecting to the websocket")
        console.log(err);
    }

    const userJoin=(userName, debateState)=>{
        var chatMessage = {
            senderName: userName,
            status:"JOIN",
            debateStatus: debateState
        };
        console.log(chatMessage);
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
                    withInviteButton = {false}
                    withWriteBox = {true}
                    canWrite={userState.canWrite}
                    postMessage={sendValue}
                    handleMessage={handleMessage}
                />
            </div>
            <div>
                <Chat
                    chatBoxPosition={'right'}
                    side={userState.opposingSide}
                    msgs={debateMsg}
                    withWriteBox = {false}
                    withInviteButton = {displayInviteButton}
                    isDebateStarted ={roomStatus.debateStarted}
                    inviteLink = {getLink() + location.pathname + '/invitee'}
                />
            </div>
        </div>
    )
}

export default DebateRoom;