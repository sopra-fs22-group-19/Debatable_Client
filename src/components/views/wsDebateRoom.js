import { Button } from 'components/ui/Button';
import {useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import {useParams} from 'react-router-dom/cjs/react-router-dom.min';
import "styles/views/wsDebateRoom.scss";
import { isProduction } from 'helpers/isProduction';
import {over} from 'stompjs';
import SockJS from 'sockjs-client';


var stompClient =null;


const getLink = () => {
    const prodURL = 'https://sopra-fs22-group19-client.herokuapp.com/debateroom/'
    //const prodURL = "https://sopra-debatable-client-app.herokuapp.com/debateroom/"
    const devURL = 'http://localhost:3000/debateroom/'
    return isProduction() ? prodURL : devURL;
}



const DebateRoom = () => {
    const [debateMsg, setDebateMsg] = useState([]);
    const [userData, setUserData] = useState({
        username: '',
        connected: false,
        message: ''
    });


    useEffect(() => {
        console.log(userData);
    }, [userData]);

    const connect =()=>{
        let Sock = new SockJS('http://localhost:8080/ws-endpoint');
        stompClient = over(Sock);
        stompClient.connect({},onConnected, onError);
    }

    const onConnected = () => {
        setUserData({...userData,"connected": true});
        stompClient.subscribe('/debateRoom/{roomId}', /TODO/ );
    }

    const onError = (err) => {
        console.log(err);
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
                //todo userid
                //todo roomid
                message: userData.message,
                status:"MESSAGE"
            };
            console.log(chatMessage);
            stompClient.send("/debates/rooms/{roomId}/msg", {}, JSON.stringify(chatMessage));
            setUserData({...userData,"message": ""});
        }
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