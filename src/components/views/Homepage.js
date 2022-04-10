
import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Homepage.scss";

/*
const Debate = ({debate}) => (
    <div className="debate container">
        <div className="debate topic">{debate.topic}</div>
    </div>
);

Debate.propTypes = {
    debate: PropTypes.object
};
*/
const Homepage = () => {
    const history = useHistory();
    const [debates, setDebates] = useState(null);
    const [userId, setId] = useState(null);

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        history.push('/login');
    }
    const debateRoom = (side, topic) => {
        let push_to = '/debateroom/' + topic + '/' + String(side)
        history.push(push_to);
    }

    useEffect(() => {
        // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
        async function fetchData() {
            try {
                setId(localStorage.getItem('userId'))
                const response = await api.get('/debates/'+1);
                // delays continuous execution of an async operation for 1 second.
                await new Promise(resolve => setTimeout(resolve, 1000));

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
    }, []);

    let content;
    //const Topic_1 = "Do Aliens Exist?"
    //const Topic_2 = "Humans should not eat animals"


    if (debates) {
    content = (
        <div class="debate">

            <ul class="debate list" >
                {debates.map(debate => (
                    //<Player debate={debate} key={debate.debateId}/>
                    <div class="debates">
                    <span><Button id="btn1" onClick={() => debateRoom("for", debate.topic)}>FOR</Button>
                        <div class="dcontainer">
                         {debate.topic}
                        </div>
                    <Button id="btn2" onClick={() => debateRoom("against", debate.topic)}>AGAINST</Button></span>
                    </div>
                    ))}
            </ul>

        </div>
    );
   }

    return (
        <BaseContainer className="debate container">
            <h2>Let's Debate!</h2>
            <p className="debate paragraph">
                Choose debate topic:
            </p>
            {content}
            <Button id="logout" onClick={() => logout()}>LOGOUT</Button>
        </BaseContainer>
    );
}

export default Homepage;
