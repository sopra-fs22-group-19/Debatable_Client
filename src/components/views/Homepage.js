
import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Homepage.scss";

const Homepage = () => {
    const history = useHistory();
    const [debates, setDebates] = useState(null);
    const userId = localStorage.getItem('userId')

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        history.push('/login');
    }
    const debateRoom = (side, debateId) => {
        let push_to = '/debateroom/' + String(debateId) + "/" + String(side) 
        history.push(push_to);
    }

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await api.get("/debates/" + userId);
                setDebates(response.data)

                console.log('request to:', response.request.responseURL);
                console.log('status code:', response.status);
                console.log('status text:', response.statusText);
                console.log('requested data:', response.data);

                console.log(response);
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
                            <Button className="debate button-container"  onClick={() => debateRoom("for", debate.debateId)}>FOR</Button>
                                <div className="debate dcontainer">
                                    {debate.topic}
                                </div>
                            <Button className="debate button-container" onClick={() => debateRoom("against", debate.debateId)}>AGAINST</Button>
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
