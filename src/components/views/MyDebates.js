
import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import "styles/views/MyDebate.scss";
import Header from "./Header";
import React from "react";


const DebateRoomList = (props) => {
    console.log(props);
    console.log(props.debateRoomList);

    return (
        <div>
            {props.debateRoomList.length > 0 ?
                <div>
                    <h4>
                        {props.debateRoomState}
                    </h4>
                    <div className="scrollable-div">
                        <div>
                            {props.debateRoomList.map(debateRoom =>
                                <ul key={debateRoom.roomId} className="list-group  list-group-horizontal-md">
                                    <li className="list-group-item flex-fill">
                                        <Button className="list-group-button"
                                                onClick={() => props.toDebateRoom(debateRoom.roomId)}>
                                            {debateRoom.debate.topic}
                                            {console.log("The room ID is:" + debateRoom.roomId)}
                                        </Button>

                                    </li>
                                </ul>
                            )
                            }
                        </div>
                    </div>
                </div> : null
            }

        </div>
    )
}


const MyDebates = () => {
    const history = useHistory();
    const [waitingOtherUserDebates, setWaitingOtherUserDebates] = useState([]);
    const [readyToStartDebates, setReadyToStartDebates] = useState([]);
    const [ongoingDebates, setOngoingDebates] = useState([]);
    const [endedDebates, setEndedDebates] = useState([]);

    const userId = localStorage.getItem("userId");

    console.log("hallo");
    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        history.push('/login');
    }

    const toDebateRoom = async (roomId) => {
        history.push();
        history.push({
            pathname: '/debateroom/' + String(roomId),
            state: {
                isGuest: false,
                isInvitee: false}
        });
    }

    const getDebateRooms = async (debateState) => {
        try {
            // Get
            const response = await api.get(`/debates/${userId}/rooms?state=${debateState}`);
            console.log("Asking for debates of type: " + debateState);
            console.log(response);
            console.log(response.data);
            console.log(typeof response.data);
            return response.data;
        } catch (error) {
            console.error(`Something went wrong while fetching the debate rooms for user ${userId} with state ${debateState}: \n
            ${handleError(error)}`);
            console.error("Details:", error);
            alert("Something went wrong while fetching the debate topics! See the console for details.");
        }
    }

    useEffect(() => {
        async function getUserDebates() {
            // Get the `waitingOtherUser` debateRooms
            console.log("11111111111111111");
            const one_user_for_debates = await getDebateRooms('ONE_USER_FOR');
            const one_user_against_debates = await getDebateRooms('ONE_USER_AGAINST');
            setWaitingOtherUserDebates([...one_user_for_debates, ...one_user_against_debates]);

            // Get the `readyToStartDebates` debateRooms
            console.log("2222222222222222");
            const ready_to_start_debates = await getDebateRooms('READY_TO_START');
            setReadyToStartDebates(ready_to_start_debates);

            // Get the `ongoingDebates` debateRooms
            console.log("3333333333333333");
            const ongoing_for_debates = await getDebateRooms('ONGOING_FOR');
            const ongoing_against_debates = await getDebateRooms('ONGOING_AGAINST');
            setOngoingDebates([...ongoing_for_debates, ...ongoing_against_debates]);

            // Get the `endedDebates` debateRooms
            console.log("44444444444444444");
            const ended_debates = await getDebateRooms('ENDED');
            setEndedDebates(ended_debates);
        }

        getUserDebates();
    }, []);

    console.log("What did I store")
    console.log(endedDebates);

    return (
        <div>
            <Header height={"100"}/>
            <div className="wrapper">
                <h className={"availability"}>My Debates</h>
            </div>
            <div>
                <DebateRoomList
                    debateRoomList={ongoingDebates}
                    debateRoomState={'Ongoing Debates'}
                    toDebateRoom = {toDebateRoom}
                />
            </div>
            <div>
                <DebateRoomList
                    debateRoomList={readyToStartDebates}
                    debateRoomState={'Debates that are ready to start'}
                    toDebateRoom = {toDebateRoom}
                />
            </div>
            <div>
                <DebateRoomList
                    debateRoomList={waitingOtherUserDebates}
                    debateRoomState={'Waiting for your opponent to join'}
                    toDebateRoom = {toDebateRoom}
                />
            </div>
            <div>
                <DebateRoomList
                    debateRoomList={endedDebates}
                    debateRoomState={'Old Debates'}
                    toDebateRoom = {toDebateRoom}
                />
            </div>
        </div>
    );
}

export default MyDebates;
