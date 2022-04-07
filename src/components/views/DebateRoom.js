
import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Spinner} from 'components/ui/Spinner';
import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Homepage.scss";



const DebateRoom = () => {
    // use react-router-dom's hook to access the history
    const history = useHistory();

    // define a state variable (using the state hook).
    // if this variable changes, the component will re-render, but the variable will
    // keep its value throughout render cycles.
    // a component can have as many state variables as you like.
    // more information can be found under https://reactjs.org/docs/hooks-state.html

   // const [debates, setDebates] = useState(null);
   // const [userId, setId] = useState(localStorage.getItem("userId"));


    const back = () => {
        history.push('/home');
    }


    // the effect hook can be used to react to change in your component.
    // in this case, the effect hook is only run once, the first time the component is mounted
    // this can be achieved by leaving the second argument an empty array.
    // for more information on the effect hook, please see https://reactjs.org/docs/hooks-effect.html
    useEffect(() => {
        // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
        async function fetchData() {
            try {

            } catch (error) {
                }
        }

        fetchData();
    }, []);



    return (
        <BaseContainer className="game container">
            <Button id="back" onClick={() => back()}>BACK</Button>
        </BaseContainer>
    );
}

export default DebateRoom;
