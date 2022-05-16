
import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import "styles/views/Topics.scss";
import Header from "./Header";
import React from "@types/react";


export const DebateRoomList = (props) => {
        return (
            <div>
                {props.debateRoomList.size() > 0 ?
                    <div>
                        <div>
                            {props.debateRoomState}
                        </div>
                        {props.debateRoomList.map(debateRoom => (
                            <ul key={debateRoom.debate.debateId} className="list-group  list-group-horizontal-md">
                                <li className="list-group-item flex-fill">
                                    {debateRoom.debate.topic}
                                </li>
                            </ul>))}
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
    const [ended, setEndedDebates] = useState([]);

    const userId = localStorage.getItem("userId");

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        history.push('/login');
    }

    const toDebateRoom = async (roomId) => {
        history.push('/debateroom/' + String(roomId));
    }

    const getDebateRooms = async (debateState) => {
        try {
            // Get
            const response = await api.get(`/debates/${userId}/rooms?state=${debateState}`);
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
            const one_user_for_debates = getDebateRooms('ONE_USER_FOR');
            const one_user_against_debates = getDebateRooms('ONE_USER_AGAINST');
            setWaitingOtherUserDebates([one_user_for_debates.concat(one_user_against_debates)]);

            // Get the `readyToStartDebates` debateRooms
            const ready_to_start_debates = getDebateRooms('READY_TO_START');
            setReadyToStartDebates([ready_to_start_debates]);

            // Get the `ongoingDebates` debateRooms
            const ongoing_for_debates = getDebateRooms('ONGOING_FOR');
            const ongoing_against_debates = getDebateRooms('ONGOING_AGAINST');
            setOngoingDebates([ongoing_for_debates.concat(ongoing_against_debates)]);

            // Get the `endedDebates` debateRooms
            const ended_debates = getDebateRooms('ENDED');
            setEndedDebates([ended_debates]);
        }

        getUserDebates();
    }, []);

    return (
        <div>
            <Header height={"100"}/>
            <div className="scrollable-div">
                <div>
                    <DebateRoomList
                        debateRoomList={ongoingDebates}
                        debateRoomState={'Ongoing Debates'}
                    />
                </div>
                <div>
                    <DebateRoomList
                        debateRoomList={readyToStartDebates}
                        debateRoomState={'Debates that are ready for you to start them'}
                    />
                </div>
                <div>
                    <DebateRoomList
                        debateRoomList={waitingOtherUserDebates}
                        debateRoomState={'Waiting for your opponent to join'}
                    />
                </div>
                <div>
                    <DebateRoomList
                        debateRoomList={ended}
                        debateRoomState={'Old Debates'}
                    />
                </div>
            </div>
        </div>
    );
}

export default MyDebates;
