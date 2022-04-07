
import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Spinner} from 'components/ui/Spinner';
import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
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
    // use react-router-dom's hook to access the history
    const history = useHistory();

    // define a state variable (using the state hook).
    // if this variable changes, the component will re-render, but the variable will
    // keep its value throughout render cycles.
    // a component can have as many state variables as you like.
    // more information can be found under https://reactjs.org/docs/hooks-state.html

    const [debates, setDebates] = useState(null);
    const [userId, setId] = useState(localStorage.getItem("userId"));


    const logout = () => {
        localStorage.removeItem('token');
        history.push('/login');
    }
    const debateRoom = () => {
        history.push('/debateroom');
    }

    // the effect hook can be used to react to change in your component.
    // in this case, the effect hook is only run once, the first time the component is mounted
    // this can be achieved by leaving the second argument an empty array.
    // for more information on the effect hook, please see https://reactjs.org/docs/hooks-effect.html
    useEffect(() => {
        // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
        async function fetchData() {
            try {
                //const response = await api.get('/debates/'+userId);
                // delays continuous execution of an async operation for 1 second.
                // This is just a fake async call, so that the spinner can be displayed
                // feel free to remove it :)
               // await new Promise(resolve => setTimeout(resolve, 1000));
                let text = '{"debates":[' +
                    '{"debateId":"1","topic":"Cats and Dogs","description":"Family","tags":"animals","userId":"1" },' +
                    '{"debateId":"2","topic":"Family","description":"Family","tags":"Social","userId":"2" },' +
                    '{"debateId":"3","topic":"Environment","description":"Family","tags":"World","userId":"3" }]}';
                const response = JSON.parse(text)
                // Get the returned users and update the state.
                setDebates(response.data);

                // This is just some data for you to see what is available.
                // Feel free to remove it.
              //  console.log('request to:', response.request.responseURL);
              //  console.log('status code:', response.status);
               // console.log('status text:', response.statusText);
               // console.log('requested data:', response.data);

                // See here to get more data.
                console.log(response);
            } catch (error) {
                console.error(`Something went wrong while fetching the debate topics: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the debate topics! See the console for details.");
            }
        }

        fetchData();
    }, []);

    let content = <Spinner/>;



    //if (debates) {
        content = (
            <div className="Debates">
                <ul className="debates debate-topic-list">
                    {//debates.map(debate => (
                        <div key={"1"}>
                            <span>
                                <Button id="btn1" onClick={() => debateRoom()}>FOR</Button>
                                 Family
                                <Button id="btn2" onClick={() => debateRoom()}>AGAINST</Button>
                            </span>
                        </div>
                    //))
                        }
                </ul>
            </div>
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
