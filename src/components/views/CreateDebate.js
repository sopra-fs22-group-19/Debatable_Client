import React from "react";
import {useState} from 'react';
import {api, handleError} from 'helpers/api';
import PropTypes from "prop-types";
import {useHistory} from 'react-router-dom';
import {Button} from 'components/ui/Button';
import "styles/views/CreateDebate.scss";

const FormField = props => {
    return (
      <div>
        <label className="create label">
          {props.label}
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

const CreateDebate = props => {
    const history = useHistory();
    const [description, setDescription] = useState(null);
    const [topic, setTopic] = useState(null);
    const [filter, setfilter] = useState(null);
    const [side, setSide] = useState(null);

    const create_new_debate = async () => {
      // TODO: user id hard coded for now
      let userId = 1;
      try {
        // TODO: send filter along with topic and description
        const requestBody = JSON.stringify({userId, topic, description});
        const post_topic = await api.post("/debates", requestBody);
        console.log(post_topic.data);
        console.log(topic, description, filter);

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
      // create a new debate room
      
    }
    let content;
    content = (
      <div>
        <div className="create container">
            <div className="create input-text">Create Debate</div>
                
                <div className="create field">
                    <FormField
                        label="Enter Topic"
                        value={topic}
                        onChange={un => setTopic(un)}
                    />
                    <FormField
                        label="Description"
                        value={description}
                        onChange={n => setDescription(n)}
                    />
                    <div>
                    Field:
                    <input type="radio" name="nameA" id="nameA" value="Science"  onClick={() => setfilter("Science")}/>
                    <label for="nameA">Science</label>
                    <input type="radio" name="nameA" id="nameB" value="Sports"  onClick={() => setfilter("Sports")}/>
                    <label for="nameA">Sports</label>
                    <input type="radio" name="nameA" id="nameA" value="Art"  onClick={() => setfilter("Art")}/>
                    <label for="nameA">Art</label>
                    <input type="radio" name="nameA" id="nameB" value="Music"  onClick={() => setfilter("Music")}/>
                    <label for="nameA">Music</label>
                    </div>

                    <div>
                    SIDE:
                    <input type="radio" name="side" id="side" value="FOR"  onClick={() => setSide("FOR")}/>
                    <label for="side">FOR</label>
                    <input type="radio" name="side" id="side" value="AGAINST"  onClick={() => setSide("AGAINST")}/>
                    <label for="side">AGAINST</label>
                    </div>
        
                </div>   

          </div>
          <Button
          className="create button"
          value="Create Debate"
          disabled={!topic || !description || !filter}
          onClick={() => {
              create_new_debate()
          }}
            />    
      </div>
    )
    return(
        <div>
            {content}
        </div>
      
    );
};

export default CreateDebate;
