
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
    const [userId, setId] = useState(localStorage.getItem("userId"));

    const logout = () => {
        localStorage.removeItem('token');
        history.push('/login');
    }
    const debateRoom = (side, topic) => {
        let push_to = '/debateroom/' + String(topic) + '/' + String(side)
        history.push(push_to);
    }

    useEffect(() => {
        // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
        async function fetchData() {
            try {
                //const response = await api.get('/debates/'+userId);
                // delays continuous execution of an async operation for 1 second.
               // await new Promise(resolve => setTimeout(resolve, 1000));
                /*let text = '{"debates":[' +
                    '{"debateId":"1","topic":"Cats and Dogs","description":"Family","tags":"animals","userId":"1" },' +
                    '{"debateId":"2","topic":"Family","description":"Family","tags":"Social","userId":"2" },' +
                    '{"debateId":"3","topic":"Environment","description":"Family","tags":"World","userId":"3" }]}';
                const response = JSON.parse(text)
                setDebates(response.data);*/

              //  console.log('request to:', response.request.responseURL);
              //  console.log('status code:', response.status);
               // console.log('status text:', response.statusText);
               // console.log('requested data:', response.data);

                //console.log(response);
            } catch (error) {
                console.error(`Something went wrong while fetching the debate topics: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the debate topics! See the console for details.");
            }
        }
        fetchData();
    }, []);

    let content;
    const Topic_1 = "Do Aliens Exist?"
    const Topic_2 = "Humans should not eat animals"

    content = (
        <div>
            <div>
                <Button id="btn1" onClick={() => debateRoom("for", {Topic_1})}>FOR</Button>
                {Topic_1}
                <Button id="btn2" onClick={() => debateRoom("against", {Topic_1})}>AGAINST</Button>
            </div>
            <div>
                <Button id="btn1" onClick={() => debateRoom("for", {Topic_2})}>FOR</Button>
                {Topic_2}
                <Button id="btn2" onClick={() => debateRoom("against", {Topic_2})}>AGAINST</Button>
            </div>
        </div>
        
        /*<div className="Debates">
            <ul className="debates debate-topic-list">
                {//debates.map(debate => (
                    <div key={"1"}>
                        <span>
                            <Button id="btn1" onClick={() => debateRoom()}>FOR</Button>
                            Do Aliens Exist?
                            <Button id="btn2" onClick={() => debateRoom()}>AGAINST</Button>
                        </span>
                    </div>
                //))
                    }
            </ul>
        </div>*/
    );
   // }

    return (
        <BaseContainer className="game container">
            <h2>Let's Debate!</h2>
            <p className="game paragraph">
                Choose debate topic:
            </p>
            {content}
            <Button id="logout" onClick={() => logout()}>LOGOUT</Button>
        </BaseContainer>
    );
}

export default Homepage;
