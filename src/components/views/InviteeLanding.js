import Login from "components/views/Login";
import {useParams, useHistory} from "react-router-dom/cjs/react-router-dom.min";

const InviteeLanding = () => {
    const {roomId} = useParams();
    const history = useHistory();

    if (localStorage.getItem("token")) {
        history.push(
            {
                pathname: `/debateroom/${roomId}`,
                state: {
                    isInvitee: true,
                }
            }
        );
    }

    let content = (<Login
        isInvitee= {true}
        roomId= {roomId}
        />)

    return (
        <div>
            {content}
        </div>
    );
}

export default InviteeLanding;