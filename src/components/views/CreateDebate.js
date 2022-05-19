import {useState} from 'react';
import {api, handleError} from 'helpers/api';
import PropTypes from "prop-types";
import {useHistory} from 'react-router-dom';
import {Button} from 'components/ui/Button';
import "styles/views/CreateDebate.scss";
import Header from "./Header";

const FormField = props => {
    return (
      <div>
          <label className="mb-1">
              <h6 >
                {props.label}
              </h6>
        </label>
        <input
          className="create input"
          placeholder="enter here.."
          value={props.value}
          onChange={e => props.onChange(e.target.value)}
        />
      </div>
    );
  };

FormField.propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func
  };

const CreateDebate = () => {
    const history = useHistory();
    const [description, setDescription] = useState(null);
    const [topic, setTopic] = useState(null);
    const [category, setCategory] = useState(null);
    const [side, setSide] = useState(null);
    const userId = localStorage.getItem("userId");
    const filters = ["Science", "History", "Sports", "Health", "Art", "Entertainment", "Politics", "Culture", "Economics", "Education", "Other"]

    const create_new_debate = async () => {
      try {
        const requestBody = JSON.stringify({userId, topic, description, category});
        const post_topic = await api.post("/debates", requestBody);
        const debateId = post_topic.data.debateId;

        try {
          const body = JSON.stringify({userId, debateId, side});
          const post_room = await api.post("/debates/rooms", body);
          const debateRoom = post_room.data

          let push_to = '/debateroom/' + String(debateRoom.roomId)
          history.push({
            pathname: push_to,
            state: {
                userId: userId,
                roomId: debateRoom.roomId}
        });
        }
        catch (error) {
          alert(`Something went wrong while creating debate room: \n${handleError(error)}`);
        }
      }
      catch (error) {
        alert(`Something went wrong while creating debate topic: \n${handleError(error)}`);
      }
    }

    const changeSelectOptionHandler = (event) => {
        console.log(event.target.value);
        if(event.target.value === "For")
        {
            setSide("FOR")
        }
        else if (event.target.value === "Against")
        {
            setSide("AGAINST")
        }
       if(event.target.value!=="For"&&event.target.value!=="Against")
        {
            setCategory(event.target.value)
            console.log(category)
        }
    };

    let content;

    content = (
        <div className="container-fluid px-1 px-md-5 px-lg-1 px-xl-5 py-5 mx-auto" style={{"align-items": "center"}}>
            <div id={"card-create"} className="card card0 border-0">
                <div className="row d-flex">
                    <div className={"row"}>
                        <div className="create heading">Create Debate</div>
                    </div>
                    <div className={"row"}>
                    <div className="col"/>
                    <div className="col">

                        <div className={"row"}>
                            <div style={{"display":"inline-flex",
                                "align-items": "center"}}>
                                <label className="mb-1">
                                    <h6  style={{"margin-right": "65px","margin-top": "10px", "margin-bottom": "10px"}}>
                                        Your Side
                                    </h6>

                                </label>
                                <select className={"dropList"} onChange={changeSelectOptionHandler}>
                                    <option>Choose Side ...</option>
                                    <option>For</option>
                                    <option>Against</option>
                                </select>
                            </div>
                        </div>
                        <div className={"row"}>
                            <FormField
                                label="Enter Topic"
                                value={topic}
                                onChange={un => setTopic(un)}
                            />
                        </div>
                        <div className={"row"}>
                            <FormField
                                label="Description"
                                value={description}
                                onChange={n => setDescription(n)}
                            />
                        </div>
                        <div className={"row"}>
                            <div style={{"display":"inline-flex",
                                "align-items": "center"}}>
                                <label className="mb-1">
                                    <h6  style={{"margin-right": "10px","margin-top": "10px", "margin-bottom": "10px"}}>
                                        Category of Topic
                                    </h6>

                                </label>
                                <select className={"dropList"} onChange={changeSelectOptionHandler}>
                                    <option>Choose tag ...</option>
                                    {filters.map(filter => (
                                        <option>
                                            {filter}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="col"/></div>
                    <div className="row" style={{"padding-top": "5px"}}>
                        <div className="col"/>
                        <div className="col">
                            <Button
                                className="create button"
                                value="Create Debate"
                                disabled={!topic || !description || !category}
                                onClick={() => {
                                    create_new_debate()
                                }}
                            />
                        </div>
                        <div className="col"/>
                    </div>
                </div>
            </div>
        </div>
    )

    return(
        <div>
            <Header/>
            {content}
        </div>
    );
};

export default CreateDebate;
