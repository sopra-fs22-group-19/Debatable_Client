
import {useEffect, useState} from 'react';
import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import {useParams} from 'react-router-dom/cjs/react-router-dom.min';
import "styles/views/Homepage.scss";

const DebateRoom = () => {
    const history = useHistory();
    const side = useParams();
    const topic = useParams();
    const [userId, setId] = useState(localStorage.getItem("userId"));

    useEffect(() => {
        async function fetchData() {
            try {

            } catch (error) {
                }
        }

        fetchData();
    }, []);
    return (
        <BaseContainer className="base-container">
            
        </BaseContainer>
    );
}

export default DebateRoom;
