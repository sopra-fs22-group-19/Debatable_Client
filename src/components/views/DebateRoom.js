import { Button } from 'components/ui/Button';
import {api, handleError} from 'helpers/api';
import {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom/cjs/react-router-dom.min';
import "styles/views/DebateRoom.scss";
import { isProduction } from 'helpers/isProduction';
import { useLocation } from "react-router-dom";

const getLink = () => {
    const prodURL = 'https://sopra-fs22-group19-client.herokuapp.com/debateroom/'
    const devURL = 'http://localhost:3000/debateroom/'
    return isProduction() ? prodURL : devURL;
}
// current url convention: baseURL/roomId/participant-n

const Link = props => (
    <div className='debateRoom parent-link'>
        Share this link for other participant to Join!
        <div className='debateRoom child-link'>
            {getLink()}{props.roomId}/2
        </div>
    </div>
)

const DebateRoom = () => {
    const {roomId} = useParams();
    const [side, setSide] = useState(null);
    const [opponentSide, setOpponentSide] = useState(null);
    const [topic, setTopic] = useState(null);
    const [link, setlink] = useState(false);
    const [inviteDisable, setinviteDisable] = useState(false);
    const [opponent, showOpponent] = useState(false);
    const [start, setstart] = useState(false);
    const [startDisable, setstartDisable] = useState(false);
    const location = useLocation();
    const userId = location.state.userId;

    let participant1;
    let participant2;

    const waiting = async (roomId) => {
        // waiting for second participant to join the debate room
        while(true) {
            const response = await api.get("/debates/rooms/" + String(roomId));
            const debateRoom = response.data
            const user2 = debateRoom.user2;
            if (user2 === null) {
                await new Promise(resolve => setTimeout(resolve, 10000));
            }
            else break;
        }
        setlink(false);
        setstart(true);
    }

    const startDebate = async () => {
        if (side === "FOR") {
            setOpponentSide("AGAINST")
        }
        else {
            setOpponentSide("FOR")
        }
        // TODO: add here put to update the debateroom status to ONGOING
        // bug: start debate button not disapperaing even after hidden is there @Orestis can u please check why is that happening.
    }

    const Opponent = () => (
            <div>
                <div>{opponentSide}</div>
                <div className="debateRoom opponent-child"></div>
            </div>
    )

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await api.get("/debates/rooms/" + String(roomId));
                const debateRoom = response.data
                setTopic(debateRoom.debate.topic)
                if (userId === debateRoom.user1.userId) {
                    setSide(debateRoom.side1)
                }

                if(location.state.participant==="2") {
                    try {
                        if (debateRoom.side1==="FOR")
                        {setSide("AGAINST")}
                        else {setSide("FOR")}
                        const requestBody = JSON.stringify({userId});
                        const response = await api.put("/debates/rooms/" + String(roomId), requestBody);
                    }
                    catch (error){
                        console.error(`userId not found: \n${handleError(error)}`);
                        console.error("Details:", error);
                        alert("uesrId not found! See the console for details.");
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

    participant1 = (
        <div>
            <div className="debateRoom topic-container">
                {topic}
            </div>
            {start ? <Button 
                className="debateRoom button-start" 
                value="Start Debate"
                hidden={startDisable}
                onClick={() => {
                    setstartDisable(true)
                    showOpponent(true)
                    startDebate()
                }}
                /> :null}
            <div>
                <div className="debateRoom chat-box-left">
                    <div>{side}</div>
                    <div className="debateRoom chat-child"></div>
                    <div className="debateRoom writer-child"></div>
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

    participant2 = (
        <div>
            <div className="debateRoom topic-container">
                {topic}
            </div>
            <div>
                <div className="debateRoom chat-box-left">
                    <div>{side}</div>
                    <div className="debateRoom chat-child"></div>
                    <div className="debateRoom writer-child"></div>
                </div>
                <div className="debateRoom chat-box-right">
                    <div className='debateRoom text'>
                        Waiting for 1st participant to start the debate!
                    </div>
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