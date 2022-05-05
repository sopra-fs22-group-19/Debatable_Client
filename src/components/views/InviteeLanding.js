import Login from "components/views/Login";
import {useParams} from "react-router-dom/cjs/react-router-dom.min";

const InviteeLanding = () => {
    const {roomId} = useParams()
    const {participant} = useParams()

    let content = (<Login
        roomId= {roomId}
        participant= {participant}
        />)

    return (
        <div>
            {content}
        </div>
    );
}

export default InviteeLanding;