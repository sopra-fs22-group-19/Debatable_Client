import React from "react";
import {useState} from 'react';
import PropTypes from "prop-types";
import "styles/views/CreateDebate.scss";
import 'styles/views/Login.scss';

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
    let content;
    const [description, setDescription] = useState(null);
    const [topic, setTopic] = useState(null);
    //             <div className="create field">
    content = (
        <div className="create container">
            <div className="create input-text">Create Debate</div>
                
                <div className="create field">
                    <FormField
                        label="Enter Topic:"
                        value={topic}
                        onChange={un => setTopic(un)}
                    />
                    <FormField
                        label="Description:"
                        value={description}
                        onChange={n => setDescription(n)}
                    />
                </div>

            
            
        </div>
    )
    return(
        <div>
            {content}
        </div>
      
    );
};

export default CreateDebate;
