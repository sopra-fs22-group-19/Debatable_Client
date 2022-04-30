
import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Homepage.scss";
import { useLocation } from "react-router-dom";

// BUG: when going back to homepage and then joing the same debate topic with same side, 
// user should not create a new one but should go to the same one.

const Homepage = () => {
    const history = useHistory();
    const location = useLocation();
    const [debates, setDebates] = useState(null);
    const userId = location.state.userId;

    const logout = () => {
        localStorage.removeItem("token");
        history.push('/login');
    }

    const todebateRoom = async (side, debateId) => {
        try {
            const requestBody = JSON.stringify({userId, debateId, side});
            const response = await api.post("/debates/rooms", requestBody);
            const debateRoom = response.data

            let push_to = '/debateroom/' + String(debateRoom.roomId)

            history.push({
                pathname: push_to,
                state: {
                    userId: userId,
                    roomId: debateRoom.roomId}
            });
        }catch(error) {
            alert(`Something went wrong while creating debate room: \n${handleError(error)}`);
        } 
    }

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await api.get("/debates/" + String(userId));
                setDebates(response.data)
            } catch (error) {
                console.error(`Something went wrong while fetching the debate topics: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the debate topics! See the console for details.");
            }
        }
        fetchData();
    }, [userId]);

    let content;

    if (debates) {
    content = (
        <div>
            <ul>
                {debates.map(debate => (
                    <div className="debate debates">
                        <span>
                            <Button className="debate button-container"  onClick={() => todebateRoom("FOR", debate.debateId)}>FOR</Button>
                                <div key={debate.debateId} className="debate dcontainer">
                                    {debate.topic}
                                </div>
                            <Button className="debate button-container" onClick={() => todebateRoom("AGAINST", debate.debateId)}>AGAINST</Button>
                        </span>
                    </div>
                    ))}
            </ul>
        </div>
    );
   }

    return (
        <BaseContainer className="base-container-hp">
            {userId}
            {content}
            <Button className="debate button-container" onClick={() => logout()}>LOGOUT</Button> 
        </BaseContainer>
    );  
}

export default Homepage;
