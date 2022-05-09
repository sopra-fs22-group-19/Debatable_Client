import Login from "components/views/Login";
import {useParams} from "react-router-dom/cjs/react-router-dom.min";

const InviteeLanding = () => {
    const {roomId} = useParams()

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