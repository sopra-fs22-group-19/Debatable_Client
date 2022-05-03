import { Button } from 'components/ui/Button';
import {useEffect, useState} from 'react';
import {useHistory, useLocation} from 'react-router-dom';
import {useParams} from 'react-router-dom/cjs/react-router-dom.min';
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



const DebateRoom = () => {
    const location = useLocation();
    let {roomId} = useParams();
    roomId = parseInt(roomId);


    const [roomData, setRoomData] = useState({
        topic: '',
        description: '',
        roomId: '',
    });

    const [debateMsg, setDebateMsg] = useState([]);
    const [userData, setUserData] = useState({
        userId: '',
        connected: false,
        message: ''
    });


    useEffect(() => {
        async function fetchData() {
            try {const response = await api.get("/debates/rooms/" + String(roomId));
                const debateRoom = response.data
                setRoomData({...roomData, 'topic': debateRoom.debate.topic,
                'roomId': roomId})
            } catch (error) {
                console.error(`Something went wrong while fetching the debate room data: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the debate room data! See the console for details.");
            }
        }fetchData();
        console.log(userData);
        console.log(roomData);
    }, [userData]);

    const connect =()=>{
        let Sock = new SockJS('http://localhost:8080/ws-endpoint');
        stompClient = over(Sock);
        stompClient.connect({},onConnected, onError);
    }

    const onConnected = () => {
        setUserData({...userData,"connected": true,
            "userId": location.state.userId});
        stompClient.subscribe('/debateRoom/roomId', onMessageReceived );
        userJoin();
    }

    const onError = (err) => {
        console.log(err);
    }

    const userJoin=()=>{
        var chatMessage = {
            senderName: userData.username,
            status:"JOIN"
        };
        stompClient.send("/rooms/toRoomId/msg", {}, JSON.stringify(chatMessage));
    }

    const connectUser=()=>{
        connect();
    }

    const handleMessage =(event)=>{
        const {value}=event.target;
        setUserData({...userData,"message": value});
    }



    const sendValue=()=>{
        if (stompClient) {
            var chatMessage = {
                userId:userData.userId,
                roomId:roomData.roomId,
                message: userData.message,
                status:"MESSAGE"
            };
            console.log(chatMessage);
            stompClient.send("/debates/rooms/{roomId}/msg", {}, JSON.stringify(chatMessage));
            setUserData({...userData,"message": ""});
        }
    }

    const onMessageReceived = (incoming)=>{
        var incomingData = JSON.parse(incoming.body);
        debateMsg.push(incomingData);
        setDebateMsg([...debateMsg]);
        }







    return (
        <div className="container">
            {userData.connected?
                <div className="debate-box">

                    <ul className="debate-messages">
                        {debateMsg.map((msg,index)=>(
                            <li className={`message ${msg.senderName === userData.username && "self"}`} key={index}>
                                <div className="message-data">{msg.message}</div>
                            </li>
                        ))}
                    </ul>

                    <div className="send-message">
                        <input
                            className="debateRoom input-text"
                            placeholder="Enter here your argument and press ENTER"
                            value={userData.message}
                            onChange={handleMessage}
                        />
                        <button type="button" className="send-button" onClick={sendValue}>send</button>
                    </div>

                </div>
                :
                <div className="connect">
                    <button type="button" onClick={connectUser}>
                        connect
                    </button>
                </div>}
        </div>
    )
}

export default DebateRoom;