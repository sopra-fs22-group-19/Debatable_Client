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

// current url convention: baseURL/roomId/participant-no
// This can be changed in future

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
    const [side, setSide] = useState(null)
    const [topic, setTopic] = useState(null)
    const [userId, setId] = useState(localStorage.getItem("userId"));
    const [link, setlink] = useState(false)
    const [inviteDisable, setinviteDisable] = useState(false)

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await api.get("/debates/rooms/" + String(roomId));
                const debateRoom = response.data
                setTopic(debateRoom.debate.topic)
                if (userId === String(debateRoom.user1.userId)) {
                    setSide(debateRoom.side1)
                }
                if(location.state.participant==="2") {
                    if (debateRoom.side1=="FOR")
                    {setSide("AGAINST")}
                    else {setSide("FOR")}
                }
            } catch (error) {
                console.error(`Something went wrong while fetching the debate room data: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the debate room data! See the console for details.");
            }
        }
        fetchData();
    }, [userId, roomId]);

    let content1;
    let content2
    const location = useLocation();




    content1 = (
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

                    <div className='debateRoom text'>Invite user to join!</div>
                    <Button
                        className="debateRoom button-container"
                        value="INVITE"
                        hidden={inviteDisable}
                        onClick={() => {
                            setlink(true)
                            setinviteDisable(true)
                        }
                        }
                    />
                    {link ? <Link roomId={roomId}/> : null}


                </div>
            </div>
        </div>
    );
    content2 = (
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

                    <div className='debateRoom text'>Wait for 1st participant to start the debate!</div>


                </div>
            </div>
        </div>
    );



    return (
        <div>

            {location.state.participant==="2"?content2:content1}
        </div>
    );
}

export default DebateRoom;