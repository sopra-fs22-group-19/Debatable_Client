
import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Homepage.scss";

// BUG: when going back to homepage and then joing the same debate topic with same side, 
// user should not create a new one but should go to the same one.

const Homepage = () => {
    const history = useHistory();
    const [debates, setDebates] = useState(null);
    const userId = localStorage.getItem('userId')

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        history.push('/login');
    }

    const todebateRoom = async (side, debateId) => {
        try {
            const requestBody = JSON.stringify({userId, debateId, side});
            const response = await api.post("/debates/rooms", requestBody);
            const debateRoom = response.data

            let push_to = '/debateroom/' + String(debateRoom.roomId)
            history.push(push_to);
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

    // TODO: when backend from debate room implemented, remove debate.topic from here in buttons
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
        <BaseContainer className="base-container">
            {content}
            <Button className="debate button-container" onClick={() => logout()}>LOGOUT</Button> 
        </BaseContainer>
    );  
}

export default Homepage;
