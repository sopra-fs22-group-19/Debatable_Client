
import { Button } from 'components/ui/Button';
import {useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import {useParams} from 'react-router-dom/cjs/react-router-dom.min';
import "styles/views/DebateRoom.scss";

const DebateRoom = () => {
    const history = useHistory();
    const {side} = useParams();
    const {debateId} = useParams();
    const [userId, setId] = useState(localStorage.getItem("userId"));

    useEffect(() => {
        async function fetchData() {
            try {

            } catch (error) {
                }
        }

        fetchData();
    }, [userId]);

    let content;
    content = (
        <div>
            <div className="debateRoom topic-container">
                Debate topic will come here.
            </div>
            <div>
                <div className="debateRoom chat-box-left">
                    <div>{side.toUpperCase()}</div>
                    <div className="debateRoom chat-child"></div>
                    <div className="debateRoom writer-child"></div>
                </div>
                <div className="debateRoom chat-box-right">
                    <div className='debateRoom text'>Invite user to join!</div>
                    <Button className="debateRoom button-container">
                        INVITE
                    </Button>
                </div>
            </div>
        </div>
    );
    return (
        <div>
            {content}
        </div>
    );
}

export default DebateRoom;
