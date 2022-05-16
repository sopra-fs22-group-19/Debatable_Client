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
        isStartingSide: false,
        isInvitedSide: false,
        isGuest: location.state.isGuest,
        isObserver: false,
        canWrite: false
    });

    const [advocatingUser, setAdvocatingUser] = useState({
        id: null,
        userName: "",
        side: ""
    })

    const [opponentUser, setOpponentUser] = useState({
        id: null,
        userName: "",
        side: ""
    })

    const [roomInformation, setRoomInformation] = useState({
        topic: '',
        description: '',
        timeToWriteMessageSeconds: 30
    });

    const [roomState, setRoomState] = useState( '');
    const [hasDebateStarted, setHasDebateStarted] = useState( false);

    const [debateFORMsgs, setDebateFORMsgs] = useState([]);
    const [debateAGAINSTMsgs, setDebateAGAINSTMsgs] = useState([]);

    const [messageToSend, setMessageToSend] = useState('');

    // UI related states (display buttons and so so)
    const [displayStartButton, setDisplayStartButton] = useState(false);
    const [isStartButtonDisabled, setIsStartButtonDisabled] = useState("flex");
    const [displayEndButton, setDisplayEndButton] = useState(false);
    const [displayInviteButton, setDisplayInviteButton] =  useState(false);

    const setAllUserStates = (isStartingSide, advocatingUserId, advocatingUserName, advocatingUserSide,
                              opponnentUserName, OpponennentUserId) => {
        setUserState(prevUserState => ({...prevUserState,
            'isStartingSide': isStartingSide,
            'isInvitedSide': !isStartingSide,
        }));

        setAdvocatingUser(prevAdvocatingUser => ({...prevAdvocatingUser,
            'id': advocatingUserId,
            'userName': advocatingUserName,
            'side': advocatingUserSide
        }));

        setOpponentUser(prevOpponentUser => ({...prevOpponentUser,
            'side': (advocatingUserSide === 'FOR') ? 'AGAINST' : 'FOR',
        }));

        if (opponnentUserName){
            setOpponentUser(prevOpponentUser => ({...prevOpponentUser, 'userName': opponnentUserName}));
        }

        if (OpponennentUserId){
            setOpponentUser(prevOpponentUser => ({...prevOpponentUser, 'id': OpponennentUserId}));
        }

    }

    const defineUserStartingState = async (debateRoom) => {
        // If they are the creators of the debate
        if (debateRoom.user1) {
            if (parseInt(userId) === debateRoom.user1.userId) {
                if (debateRoom.user2 === null){
                    setAllUserStates(
                        true, debateRoom.user1.userId, debateRoom.user1.username, debateRoom.side1,
                        null, null);
                    return {userName: debateRoom.user1.username, isInvitee: false,
                        advocatingUser: {id: debateRoom.user1.userId, side: debateRoom.side1},
                        opponentUser: null};
                } else {
                    setAllUserStates(
                        true, debateRoom.user1.userId, debateRoom.user1.username, debateRoom.side1,
                        debateRoom.user2.username, debateRoom.user2.userId);
                    return {userName: debateRoom.user1.username, isInvitee: false,
                        advocatingUser: {id: debateRoom.user1.userId, side: debateRoom.side1},
                        opponentUser: {id: debateRoom.user2.userId, side: debateRoom.side2}};
                }
            }
        } else {
            let errorMsg = "Something went wrong while creating the debateroom!"
            console.error(errorMsg + " There is no creating user");
            alert(errorMsg + " See the console for details.");
        }

        // If they are or should be the second user
        if (debateRoom.user2) {
            // If second participant has already been added and the current client is the second participant,
            //  then add retrieve their information in the debate
            if (parseInt(userId) === debateRoom.user2.userId) {
                setAllUserStates(
                    false, debateRoom.user2.userId, debateRoom.user2.username, debateRoom.side2,
                    debateRoom.user1.username, debateRoom.user1.userId);

                return {userName: debateRoom.user2.username, isInvitee: true,
                    advocatingUser: {id: debateRoom.user2.userId, side: debateRoom.side2},
                    opponentUser: {id: debateRoom.user1.userId, side: debateRoom.side1}};
            }
        }

        // If they are an Observer
        if (debateRoom.user1 && debateRoom.user2) {
            if (parseInt(userId) !== debateRoom.user1.userId && parseInt(userId) !== debateRoom.user2.userId) {
                setAllUserStates(false, debateRoom.user2.userId, debateRoom.user2.username, debateRoom.side2,
                    debateRoom.user1.username, debateRoom.user1.userId);

                setUserState(prevUserState => ({
                    ...prevUserState,
                    'isObserver': true
                }));

            }
            return {userName: `Observer: ${String(userId)}`, isInvitee: true,
                advocatingUser: {id: debateRoom.user1.userId, side: debateRoom.side1},
                opponentUser: {id: debateRoom.user2.userId, side: debateRoom.side2}};

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

    const getOpponentsInfo = async() => {
        try {
            // update the debate room with user 2 information
            const response = await api.get("/debates/rooms/" + String(roomId));
            if (userState.isStartingSide && parseInt(userId) === response.data.user1.userId ){
                setOpponentUser(prevOpponentUser => ({...prevOpponentUser,
                    'id': response.data.user2.userId,
                    'userName': response.data.user2.username
                }))
            } else if (userState.isInvitedSide && parseInt(userId) === response.data.user2.userId ){
                setOpponentUser(prevOpponentUser => ({...prevOpponentUser,
                    'id': response.data.user1.userId,
                    'userName': response.data.user1.username
                }))
            } else{
                setAdvocatingUser(prevUserState => ({...prevUserState,
                    'userName': response.data.user1.username,
                }));
                setOpponentUser(prevOpponentUser => ({...prevOpponentUser,
                    'id': response.data.user2.userId,
                    'userName': response.data.user2.username
                }))
            }

        } catch (error) {
            console.error(`Something went wrong while updating userId in debateroom: \n${handleError(error)}`);
            console.error("Details:", error);
            alert("Something went wrong while fetching the opponents name! See the console for details.");
        }
    }

    const addMessageFor = (msg) => {
        debateFORMsgs.push(msg);
        setDebateFORMsgs([...debateFORMsgs]);
        //setDebateFORMsgs(prevDebateFORMsgs => ([...prevDebateFORMsgs, debateFORMsgs]));
    }

    const addMessageAgainst = (msg) => {
        debateAGAINSTMsgs.push(msg);
        setDebateAGAINSTMsgs([...debateAGAINSTMsgs]);
        //setDebateAGAINSTMsgs(prevDebateAGAINSTMsgs => ([...prevDebateAGAINSTMsgs, debateAGAINSTMsgs]));
    }

    const pushListOfMessages = (msgList, side) => {
        if (side === "FOR"){
            msgList.map(msg => (addMessageFor(msg)))
        } else {
            msgList.map(msg => (addMessageAgainst(msg)))
        }
    }

    const getMessagingHistory = async(advocatingUser, opponentUser) => {
        // Get messages of the user
        try {
            const response = await api.get(`/debates/rooms/${String(roomId)}/users/${String(advocatingUser.id)}/msgs`);
            if (response.data.length > 0){
                console.log("My messages: ");
                console.log(response.data);
                pushListOfMessages(response.data, advocatingUser.side);
            }
        } catch (error) {
            console.error(`Something went wrong fetching the messages of user ${String(advocatingUser.id)} in debateroom ${String(roomId)}: \n
            ${handleError(error)}`);
            console.error("Details:", error);
            alert("Something went wrong while fetching the opponents name! See the console for details.");
        }

        // Get messages of the opponent
        if (opponentUser != null) {
            try {
                const response = await api.get(`/debates/rooms/${String(roomId)}/users/${String(opponentUser.id)}/msgs`);
                if (response.data.length > 0){
                    console.log("Oponent user message: ");
                    console.log(response.data);
                    pushListOfMessages(response.data, opponentUser.side);
                }
            } catch (error) {
                console.error(`Something went wrong fetching the messages of user ${String(opponentUser.id)} in debateroom ${String(roomId)}: \n
            ${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the opponents name! See the console for details.");
            }
        }
    }

    // Populate information relevant to the debate room and user on mount
    useEffect(() => {
        async function setUserAndRoomStateOnMount() {
            try {
                const response = await api.get("/debates/rooms/" + String(roomId));
                let debateRoom = response.data

                setRoomInformation(prevRoomInformation => ({...prevRoomInformation,
                    'topic': debateRoom.debate.topic,
                    'description': debateRoom.debate.description,
                    })
                )

                if (location.state.isInvitee && debateRoom.side2 === null){
                    debateRoom = await addSecondParticipant();
                }

                let userInfo = await defineUserStartingState(debateRoom);

                connectToRoomWS(userInfo.userName, debateRoom.debateStatus);
                setRoomState(() => debateRoom.debateStatus);
                await getMessagingHistory(userInfo.advocatingUser, userInfo.opponentUser);

            } catch (error) {
                console.error(`Something went wrong while fetching the debate room data: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the debate room data! See the console for details.");
            }
        } setUserAndRoomStateOnMount();
    }, []);

    // Handle changes of state in the debate room
    useEffect(() => {
        async function debateStateChange() {
            if (roomState === 'ONE_USER_FOR' || roomState === 'ONE_USER_AGAINST'){
                if (!userState.isInvitedSide){
                    setDisplayInviteButton(true);
                }
            }
            if (roomState === 'READY_TO_START'){
                if (userState.isStartingSide){
                    // Only user that created the debate can start it
                    setDisplayStartButton(true);
                    setDisplayInviteButton(false);
                    getOpponentsInfo();

                    // get name of the opponent
                }
            } else if (roomState === 'ONGOING_FOR' || roomState === 'ONGOING_AGAINST'){
                if (!userState.isObserver) {
                    // Handle transition from 'READY_TO_START' --> {'ONGOING_FOR', 'ONGOING_AGAINST'}
                    if (!hasDebateStarted) {
                        setHasDebateStarted(true);
                        setDisplayEndButton(true);
                    }

                    // Handle change of turns
                    if (roomState.split('_')[1] === advocatingUser.side) {
                        setUserState({...userState, 'canWrite': true});
                    } else {
                        setUserState({...userState, 'canWrite': false});
                    }
                } else {
                    if (!hasDebateStarted) {
                        setHasDebateStarted(true);
                    }
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
            let newState = "ONGOING_" + String(advocatingUser.side);
            await updateDebateStateAtBackend(newState);

            // Notify all other members of the channel the debate has started
            notifyStateChange(advocatingUser.userName, newState);
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
        notifyStateChange(advocatingUser.userName, newState);
    }

    const getOutOfDebate = async () => {
        await stompClient.unsubscribe('/debates/rooms/' + String(roomId));

        if (userState.isGuest) {
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
        if (ws_response.messageContent !== null){
            if(ws_response.messageContent !== ''){
                if (ws_response.userSide === "FOR"){
                    addMessageFor(ws_response.messageContent);
                } else {
                    addMessageAgainst(ws_response.messageContent);
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
        setMessageToSend(value);
    }

    const sendValue=()=>{
        if (stompClient) {
            var chatMessage = {
                userId: userId,
                roomId: roomState.roomId,
                userSide: advocatingUser.side,
                messageContent: messageToSend,
            };
            stompClient.send('/ws/debates/rooms/' + String(roomId) + '/msg', {}, JSON.stringify(chatMessage));

            // Change turns after sending the message
            if (advocatingUser.side === 'FOR'){
                notifyStateChange(advocatingUser.userName, 'ONGOING_AGAINST');
            } else{
                notifyStateChange(advocatingUser.userName, 'ONGOING_FOR')
            }
            setMessageToSend("");
        }
    }

    console.log("for messages");
    console.log(debateFORMsgs);

    console.log("against messages");
    console.log(debateAGAINSTMsgs);

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
                    <div className="col-sm d-flex justify-content-center" style={{"margin-top": "30px"}}>
                        {hasDebateStarted && userState.canWrite && !userState.isObserver ?
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
                            side={advocatingUser.side}
                            username={advocatingUser.userName}
                            msgs={advocatingUser.side === "FOR" ?  debateFORMsgs: debateAGAINSTMsgs}
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
                                displayStartButton = {displayStartButton && !userState.isObserver}
                                startDebate={startDebate}
                            />
                            <EndButton
                                displayEndButton = {displayEndButton && !userState.isObserver}
                                endDebate = {notifyEndOfDebate}
                            />
                    </div>

                    <div className="col-5 d-flex justify-content-center">
                        <Chat
                            chatBoxPosition={'right'}
                            side={opponentUser.side}
                            username={ opponentUser.userName}
                            msgs={opponentUser.side === "FOR" ? debateFORMsgs: debateAGAINSTMsgs}
                            displayMessageBox = {hasDebateStarted}
                            withWriteBox = {false}
                            withInviteButton = {displayInviteButton && userState.isStartingSide}
                            displayWaitingMessage = {userState.isInvitedSide && !hasDebateStarted}
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