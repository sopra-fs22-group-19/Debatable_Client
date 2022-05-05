import React from "react";
import "styles/views/CreateDebate.scss";


const CreateDebate = props => {
    let content;

    content = (
        <div className="create container">
            Create Debate
            <div className="create field">
                Hello
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
