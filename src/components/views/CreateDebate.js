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
    const [category, setCategory] = useState(null);
    const [side, setSide] = useState(null);
    const filters = ["Science", "History", "Sports", "Health", "Art", "Entertainment", "Politics", "Culture", "Economics", "Education", "Other"]

    const create_new_debate = async () => {
      // TODO: user id hard coded for now
      let userId = 2;
      try {
        const requestBody = JSON.stringify({userId, topic, description, category});
        const post_topic = await api.post("/debates", requestBody);
        console.log(post_topic.data);
        console.log(topic, description, category);

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

    let content;
    content = (
      <div>
        <div className="create heading">Create Debate</div>
        <div className="create container">
                <div>
                  <input type="radio" name="side" id="side" value="FOR"  onClick={() => setSide("FOR")}/>
                  <label for="side" className="create text-filter">FOR</label>
                  <input type="radio" name="side" id="side" value="AGAINST"  onClick={() => setSide("AGAINST")}/>
                  <label for="side" className="create text-filter">AGAINST</label>
                </div>
                
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
                    <div className="create radio">
                    {filters.map(filter => (
                      <div>
                      <input type="radio" name="filter" id="filter" value={filter}  onClick={() => setCategory(String(filter))}/>
                      <label for="filter" className="create text-filter">{filter}</label>
                      </div>
                    ))}  
                    </div>
                </div>   

          </div>
          <Button
          className="create button"
          value="Create Debate"
          disabled={!topic || !description || !category}
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
