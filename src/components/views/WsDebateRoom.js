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

    const [roomInformation, setRoomInformation] = useState({
        topic: '',
        description: '',
    });

    const [roomState, setRoomState] = useState({
        debateState: '',
        debateStarted: false
    });

    const [debateMsg, setDebateMsg] = useState([]);

    const [userData, setUserData] = useState({
        userId: '',
        connected: false,
        message: ''
    });

    // UI related states (display buttons and so so)
    const [displayStartButton, setDisplayStartButton] = useState(false);
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
        }

        if (debateRoom.user2){
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
        }

        // If they are an Observer
        if (debateRoom.user1 && debateRoom.user2){
            if(parseInt(userId) !== debateRoom.user1.userId && parseInt(userId) !== debateRoom.user2.userId){
                setUserState({...userState,
                    'userSide': 'FOR',
                    'opposingSide': 'AGAINST',
                    'isObserver': true
                });
            }

            return String(userId);
        }

    }

    const addSecondParticipant = async () => {
        try {
            // update the debate room with user 2 information
            const requestBody = JSON.stringify({"userId": userId});
            const response = await api.put("/debates/rooms/" + String(roomId), requestBody);
            return response.data;
        } catch (error) {
            console.error(`Something went wrong while updating userId in debateroom: \n${handleError(error)}`);
            console.error("Details:", error);
            alert("Something went wrong while updating userId in debateroom! See the console for details.");
        }
    }

    // Populate information relevant to the debate room on mount
    useEffect(() => {
        async function setUserAndRoomStateOnMount() {
            try {
                const response = await api.get("/debates/rooms/" + String(roomId));
                let debateRoom = response.data

                setRoomInformation({...roomInformation,
                    'topic': debateRoom.debate.topic,
                    'description': debateRoom.debate.description,
                    }
                )

                if (location.state.isInvitee && debateRoom.side2 === null){
                    debateRoom = await addSecondParticipant(debateRoom);
                }

                let userName = await defineUserStartingState(debateRoom);

                connectToRoomWS(userName, debateRoom.debateStatus);

            } catch (error) {
                console.error(`Something went wrong while fetching the debate room data: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the debate room data! See the console for details.");
            }
        } setUserAndRoomStateOnMount();

    }, []);


    useEffect(() => {
        async function debateStateChange() {
            if (roomState.debateState === 'READY_TO_START'){
                if (!location.state.isInvitee){
                    console.log("Now in Ready to start");
                    // Only user that created the debate can start it
                    setDisplayStartButton(true);
                    setDisplayInviteButton(false);
                }
            } else if (roomState.debateState === 'ONGOING_FOR' || roomState.debateState === 'ONGOING_AGAINST'){
                console.log("DISPLAY END DEBATE BUTTON")
                setDisplayEndButton(true);
            } else if (roomState.debateState === "ENDED"){
                console.log("Call end debate function")
            }

        } debateStateChange();

    }, [roomState]);

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

        if (roomState.debateState === 'READY_TO_START') {
            // Update state of the debate at the backend to ONGOING
            let newState = "ONGOING_" + String(userState.userSide);
            await updateDebateStateAtBackend(newState);

            // Notify all other members of the channel the debate has started
            notifyStateChange(userState.userName, newState);
            setDisplayStartButton(false);
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

    const onError = (err) => {
        console.log("Error connecting to the websocket")
        console.log(err);
    }

    const onConnected = (userName, debateState) => {
        setUserData({...userData, "connected": true});
        stompClient.subscribe('/debates/rooms/' + String(roomId), onMessageReceived );
        notifyStateChange(userName, debateState);
    }

    const onMessageReceived = (incoming) => {
        console.log("RECIEVED A MESSAGE");
        let ws_response = JSON.parse(incoming.body);

        if (ws_response.message !== null){
            if(ws_response.message !== ''){
                console.log('message added')
                debateMsg.push(incoming.body.message);
                setDebateMsg([...debateMsg]);
            }
        }

        if (ws_response.debateState !== null){
            console.log("RECEIVED A STATUS CHANGE");
            console.log('roomState.debateStatus (old status): ' + roomState.debateState);
            console.log('ws_response.debateState (new status): ' + ws_response.debateState);
            console.log("set new status")
            setRoomState({...roomState, 'debateStatus': ws_response.debateState });
            console.log("new status: " + roomState.debateState);
            //if (!roomState.debateStarted
            //    && roomState.debateState === 'READY_TO_START'
            //    && (ws_response.debateState === "ONGOING_FOR" || ws_response.debateState === "ONGOING_AGAINST")
            //){
            //    console.log("TRANSITION from ready to start to ongoing")
            //    setRoomState({...roomState, 'debateStatus': ws_response.debateState, 'debateStarted': true });



        }
    }

    const notifyStateChange=(userName, debateState)=>{
        var chatMessage = {
            userId: userId,
            userName: userName,
            debateState: debateState
        };
        console.log(chatMessage);
        stompClient.send('/ws/debates/rooms/' + String(roomId) + '/msg', {}, JSON.stringify(chatMessage));
    }


    const handleMessage = (event) => {
        const {value}=event.target;
        setUserData({...userData, "message": value});
    }

    const sendValue=()=>{
        if (stompClient) {
            var chatMessage = {
                userId:userData.userId,
                roomId:roomState.roomId,
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



    return (
        <div className="container">
            <div className="debateRoom topic-container">
                {roomInformation.topic}
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
                    displayMessageBox = {true}
                    withInviteButton = {false}
                    displayWaitingMessage = {false}
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
                    displayMessageBox = {roomState.debateStarted}
                    withWriteBox = {false}
                    withInviteButton = {displayInviteButton && !location.state.isInvitee}
                    displayWaitingMessage = {location.state.isInvitee && !roomState.debateStarted}
                    isDebateStarted ={roomState.debateStarted}
                    inviteLink = {getLink() + location.pathname + '/invitee'}
                />
            </div>
        </div>
    )
}

export default DebateRoom;