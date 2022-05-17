
import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {useHistory} from 'react-router-dom';
import "styles/views/MyDebate.scss";
import Header from "./Header";


const DebateRoomList = (props) => {

    return (
        <div>
            {props.debateRoomList.length > 0 ?
                <div>
                    <div className="scrollable-div-title">
                        <h4>
                            {props.debateRoomState}
                        </h4>
                    </div>
                        <div className="scrollable-div">
                        <div>
                            {props.debateRoomList.map(debateRoom =>
                                <ul key={debateRoom.roomId} className="list-group  list-group-horizontal-md">
                                    <li className="list-group-item flex-fill"
                                        onClick={() => props.toDebateRoom(debateRoom.roomId)}>
                                        {debateRoom.debate.topic}
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

    let atLeastOneDebate =  waitingOtherUserDebates.length + readyToStartDebates.length +
        ongoingDebates.length + endedDebates.length > 0;

    const userId = localStorage.getItem("userId");

    const toDebateRoom = async (roomId) => {
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
            const one_user_for_debates = await getDebateRooms('ONE_USER_FOR');
            const one_user_against_debates = await getDebateRooms('ONE_USER_AGAINST');
            setWaitingOtherUserDebates([...one_user_for_debates, ...one_user_against_debates]);

            // Get the `readyToStartDebates` debateRooms
            const ready_to_start_debates = await getDebateRooms('READY_TO_START');
            setReadyToStartDebates(ready_to_start_debates);

            // Get the `ongoingDebates` debateRooms
            const ongoing_for_debates = await getDebateRooms('ONGOING_FOR');
            const ongoing_against_debates = await getDebateRooms('ONGOING_AGAINST');
            setOngoingDebates([...ongoing_for_debates, ...ongoing_against_debates]);

            // Get the `endedDebates` debateRooms
            const ended_debates = await getDebateRooms('ENDED');
            setEndedDebates(ended_debates);
        }

        getUserDebates();
    }, []);

    let listOfDebatesContent = (
        <div>
            <div>
                <DebateRoomList
                    debateRoomList={ongoingDebates}
                    debateRoomState={'Ongoing Debates'}
                    toDebateRoom={toDebateRoom}
                />
            </div>
            <div>
                <DebateRoomList
                    debateRoomList={readyToStartDebates}
                    debateRoomState={'Debates that are ready to start'}
                    toDebateRoom={toDebateRoom}
                />
            </div>
            <div>
                <DebateRoomList
                    debateRoomList={waitingOtherUserDebates}
                    debateRoomState={'Waiting for your opponent to join'}
                    toDebateRoom={toDebateRoom}
                />
            </div>
            <div>
                <DebateRoomList
                    debateRoomList={endedDebates}
                    debateRoomState={'Old Debates'}
                    toDebateRoom={toDebateRoom}
                />
            </div>
        </div>
    );

    let contentNoDebatesAvailable = (
        <div className="container-fluid px-1 px-md-5 px-lg-1 px-xl-5 py-5 mx-auto" style={{"align-items": "center"}}>
            <div id={"card-home"} className="card card0 border-0">
                <div className="row d-flex" style={{"align-items": "center"}}>
                    <div className="row px-3" style={{"margin-top": "10px", "margin-bottom": "10px"}}>
                        <div className="col"/>
                        <div className="col-6">
                            <h3 id={"description"} style={{"font-style": "bold"}}> You have not chosen a topic to debate yet!
                                Start a debate from an existing topic or create your own topic and defend your side!
                            </h3>
                        </div>
                        <div className="col"/>

                    </div>
                    <div className="row px-3" style={{"margin-top": "10px", "margin-bottom": "10px"}}>
                        <div className="col"/>
                        <div className="col  d-flex justify-content-center">
                            <button
                                onClick={() => {
                                    history.push('/topics')
                                }}> Get Started
                            </button>
                        </div>
                        <div className="col"/>

                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div>
            <Header height={"100"}/>
            {atLeastOneDebate ?
                <div> {listOfDebatesContent} </div>
                : <div> {contentNoDebatesAvailable} </div>
            }
        </div>
    );
}

export default MyDebates;
