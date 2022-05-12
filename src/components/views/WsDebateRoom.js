import { Button } from 'components/ui/Button';
import {Chat} from 'components/ui/Chat'
import {useEffect, useState} from 'react';
import {useHistory, useLocation, useParams} from 'react-router-dom';
import "styles/views/wsDebateRoom.scss";
import { isProduction } from 'helpers/isProduction';
import {over} from 'stompjs';
import SockJS from 'sockjs-client';
import {api, handleError} from "../../helpers/api";
import Header from './Header';
import Timer from "../ui/Timer";


var stompClient =null;

const getLink = () => {
    const prodURL = 'https://sopra-fs22-group19-client.herokuapp.com'
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
    let {roomId} = useParams();
    roomId = parseInt(roomId);

    const [userState, setUserState] = useState({
        userName: "",
        name: "",
        userSide: "",
        opponentsName: "",
        opposingSide: "",
        isStartingSide: false,
        isInvitedSide: false,
        isObserver: false,
        canWrite: false
    });

    const [roomInformation, setRoomInformation] = useState({
        topic: '',
        description: '',
        timeToWriteMessageSeconds: 30
    });

    const [roomState, setRoomState] = useState( '');
    const [hasDebateStarted, setHasDebateStarted] = useState( false);

    const [debateFORMsgs, setDebateFORMsgs] = useState([]);
    const [debateAGAINSTMsgs, setDebateAGAINSTMsgs] = useState([]);
    const [messageContent, setMessageContent] = useState('');

    // UI related states (display buttons and so so)
    const [displayStartButton, setDisplayStartButton] = useState(false);
    const [isStartButtonDisabled, setIsStartButtonDisabled] = useState("flex");
    const [displayEndButton, setDisplayEndButton] = useState(false);
    const [displayInviteButton, setDisplayInviteButton] =  useState(true);

    const defineUserStartingState = (debateRoom) => {
        if (debateRoom.user1) {
            if (parseInt(userId) === debateRoom.user1.userId) {
                setUserState(prevUserState => ({...prevUserState,
                    'userName': debateRoom.user1.username,
                    'name': debateRoom.user1.name,
                    'userSide': debateRoom.side1,
                    'opposingSide': (debateRoom.side1 === 'FOR') ? 'AGAINST' : 'FOR',
                    'isStartingSide': true,
                    'canWrite': false
                }));

                return debateRoom.user1.username;
            }
        }

        if (debateRoom.user2){
            if (parseInt(userId) === debateRoom.user2.userId ){
                setUserState(prevUserState => ({...prevUserState,
                    'userName': debateRoom.user2.username,
                    'name': debateRoom.user2.name,
                    'userSide': debateRoom.side2,
                    'opposingSide': (debateRoom.side2 === 'FOR') ? 'AGAINST' : 'FOR',
                    'isInvitedSide': true,
                    'canWrite': false
                }));

                return debateRoom.user2.username;
            }
        }

        // If they are an Observer
        if (debateRoom.user1 && debateRoom.user2){
            if(parseInt(userId) !== debateRoom.user1.userId && parseInt(userId) !== debateRoom.user2.userId){
                setUserState(prevUserState => ({...prevUserState,
                    'userSide': 'FOR',
                    'userName': debateRoom.user1.username,
                    'opponentsName': debateRoom.user2.username,
                    'opposingSide': 'AGAINST',
                    'isObserver': true
                }));
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

    const getOpponentsName = async() => {
        try {
            // update the debate room with user 2 information
            const response = await api.get("/debates/rooms/" + String(roomId));
            if (!location.state.isInvitee && parseInt(userId) === response.data.user1.userId ){
                setUserState(prevUserState => ({...prevUserState,
                    'opponentsName': response.data.user2.username}));
            } else if (location.state.isInvitee &&  parseInt(userId) === response.data.user2.userId ){
                setUserState(prevUserState => ({...prevUserState,
                    'opponentsName': response.data.user1.username}));
            } else{
                setUserState(prevUserState => ({...prevUserState,
                    'userName': response.data.user1.userName,
                    'opponentsName': response.data.user2.userName}));
            }

        } catch (error) {
            console.error(`Something went wrong while updating userId in debateroom: \n${handleError(error)}`);
            console.error("Details:", error);
            alert("Something went wrong while fetching the opponents name! See the console for details.");
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
                    debateRoom = await addSecondParticipant();
                    getOpponentsName();
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
            if (roomState === 'READY_TO_START'){
                if (!location.state.isInvitee){
                    // Only user that created the debate can start it
                    setDisplayStartButton(true);
                    setDisplayInviteButton(false);
                    getOpponentsName();

                    // get name of the opponent
                }
            } else if (roomState === 'ONGOING_FOR' || roomState === 'ONGOING_AGAINST'){
                // Handle transition from 'READY_TO_START' --> {'ONGOING_FOR', 'ONGOING_AGAINST'}
                if(!hasDebateStarted){
                    console.log("Transition to start of debate");
                    setHasDebateStarted(true);
                    setDisplayEndButton(true);
                }

                // Handle change of turns
                if (roomState.split('_')[1] === userState.userSide){
                    setUserState({...userState, 'canWrite': true});
                } else {
                    setUserState({...userState, 'canWrite': false});
                }
            } else if (roomState === "ENDED"){
                await getOutOfDebate();
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

        if (roomState === 'READY_TO_START') {
            // Update state of the debate at the backend to ONGOING
            let newState = "ONGOING_" + String(userState.userSide);
            await updateDebateStateAtBackend(newState);

            // Notify all other members of the channel the debate has started
            notifyStateChange(userState.userName, newState);
            setDisplayStartButton(false);
            setDisplayEndButton(true);
            setUserState({...userState, 'canWrite': true});
        } else {
            console.error("Cannot start debate yet, debateStatus must be at READY_TO_START");
        }
    }

    const notifyEndOfDebate = async () => {
        let newState = "ENDED";
        await updateDebateStateAtBackend("ENDED");
        notifyStateChange(userState.userName, newState);
    }

    const getOutOfDebate = async () => {
        await stompClient.unsubscribe('/debates/rooms/' + String(roomId));

        if (userState.name === "Guest") {
            localStorage.removeItem("token");
            localStorage.removeItem("userId");
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
        console.error("Error connecting to the websocket")
        console.error(err);
    }

    const onConnected = (userName, debateState) => {
        stompClient.subscribe('/debates/rooms/' + String(roomId), onMessageReceived );
        notifyStateChange(userName, debateState);
    }

    const onMessageReceived = (incoming) => {
        let ws_response = JSON.parse(incoming.body);
        if (ws_response.message !== null){
            if(ws_response.message !== ''){
                if (ws_response.userSide === "FOR"){
                    debateFORMsgs.push(ws_response.message);
                    setDebateFORMsgs([...debateFORMsgs]);
                } else {
                    debateAGAINSTMsgs.push(ws_response.message);
                    setDebateAGAINSTMsgs([...debateAGAINSTMsgs]);
                }
            }
        }

        if (ws_response.debateState !== null){
            setRoomState( ws_response.debateState );
        }
    }

    const notifyStateChange=(userName, debateState)=>{
        var chatMessage = {
            userId: userId,
            userName: userName,
            debateState: debateState
        };
        stompClient.send('/ws/debates/rooms/' + String(roomId) + '/msg', {}, JSON.stringify(chatMessage));
    }

    const handleMessage = (event) => {
        const {value}=event.target;
        setMessageContent(value);
    }

    const sendValue=()=>{
        if (stompClient) {
            var chatMessage = {
                userId: userId,
                roomId: roomState.roomId,
                userSide: userState.userSide,
                message: messageContent,
            };
            console.log(chatMessage);
            stompClient.send('/ws/debates/rooms/' + String(roomId) + '/msg', {}, JSON.stringify(chatMessage));

            // Change turns after sending the message
            if (userState.userSide === 'FOR'){
                notifyStateChange(userState.userName, 'ONGOING_AGAINST');
            } else{
                notifyStateChange(userState.userName, 'ONGOING_FOR')
            }
        }
    }

    return (
        <div>
            <Header height={"100"}/>
            <div className="container">
                <div class="row d-flex justify-content-center">
                <div className="debateRoom topic-container">
                    {roomInformation.topic}
                </div>
                </div>
                <div className="row d-flex justify-content-center">
                    <div className="col-sm"></div>
                    <div className="col-sm d-flex justify-content-center">
                        {hasDebateStarted && userState.canWrite ?
                            <Timer
                                initialMinute={Math.floor(roomInformation.timeToWriteMessageSeconds / 60)}
                                initialSeconds={roomInformation.timeToWriteMessageSeconds % 60}
                                triggerMsgSend={() => sendValue()}
                            /> : null}
                    </div>
                    <div className="col-sm"></div>
                </div>
                <div className="row ">
                    <div className="col-5 d-flex">
                        <Chat
                            chatBoxPosition={'left'}
                            side={userState.userSide}
                            username={userState.userName}
                            msgs={userState.userSide === "FOR" ?  debateFORMsgs: debateAGAINSTMsgs}
                            displayMessageBox = {true}
                            withInviteButton = {false}
                            displayWaitingMessage = {false}
                            withWriteBox = {true}
                            canWrite={userState.canWrite}
                            postMessage={() => sendValue()}
                            handleMessage={handleMessage}
                        />
                    </div>
                    <div className="col-2 d-flex justify-content-center align-items-center">
                            <StartButton
                                isStartDisabled = {isStartButtonDisabled}
                                setIsStartDisabled = {setIsStartButtonDisabled}
                                displayStartButton = {displayStartButton}
                                startDebate={startDebate}
                            />
                            <EndButton
                                displayEndButton = {displayEndButton}
                                endDebate = {notifyEndOfDebate}
                            />
                    </div>

                    <div className="col-5 d-flex justify-content-center">
                        <Chat
                            chatBoxPosition={'right'}
                            side={userState.opposingSide}
                            username={ userState.opponentsName}
                            msgs={userState.opposingSide === "FOR" ? debateFORMsgs: debateAGAINSTMsgs}
                            displayMessageBox = {hasDebateStarted}
                            withWriteBox = {false}
                            withInviteButton = {displayInviteButton && !location.state.isInvitee}
                            displayWaitingMessage = {location.state.isInvitee && !hasDebateStarted}
                            isDebateStarted ={hasDebateStarted}
                            inviteLink = {getLink() + location.pathname + '/invitee'}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DebateRoom;