
import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Topics.scss";
import { useLocation } from "react-router-dom";
import FilterComponent from "../ui/FilterComponent";
import Header from "./Header";



// BUG: when going back to homepage and then joing the same debate topic with same side, 
// user should not create a new one but should go to the same one.

const Topics = () => {
    const history = useHistory();
    const location = useLocation();
    const [debates, setDebates] = useState(null);
    const userId = localStorage.getItem("userId");
    let categories = [];

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("categories");
        history.push('/login');
    }

    const todebateRoom = async (side, debateId) => {
        try {
            
            const requestBody = JSON.stringify({userId, debateId, side});
            const response = await api.post("/debates/rooms", requestBody);
            const debateRoom = response.data

            let push_to = '/debateroom/' + String(debateRoom.roomId)

            localStorage.removeItem("categories");
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

                categories = localStorage.getItem('categories');

                if(categories){
                    let query = "/debates/?categories=" + categories;
                    const response = await api.get(query);
                    

                    if (response.data.length === 0) {
                        alert("Debate topic for this filter not found. Try another filter!")
                        const response = await api.get("/debates/" + String(userId));
                        setDebates(response.data)
                    }
                    else {
                        setDebates(response.data)
                    }
                }

                else{
                    const response = await api.get("/debates/" + String(userId));
                    setDebates(response.data)
                }


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

        <div >

                {debates.map(debate => (

                        <ul key={debate.debateId} className="list-group  list-group-horizontal-md">
                            <li className=" list-group-button"><Button className="debate button-container"  onClick={() => todebateRoom("FOR", debate.debateId)}>FOR</Button>
                            </li>
                            <li className="list-group-item flex-fill"> {debate.topic}</li>
                            <li className="list-group-button "><Button className="debate button-container" onClick={() => todebateRoom("AGAINST", debate.debateId)}>AGAINST</Button>
                            </li>
                        </ul>
                    ))}
        </div>
    );
   }
    return (
        <div>
            <Header height={"100"}/>
            <div className="wrapper">

                <h className={"availability"}>Available topics</h>
                <FilterComponent/>
            </div>
                    <div className="scrollable-div">
                        {content}
                    </div>
        </div>

    );  
}

export default Topics;