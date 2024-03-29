import React, { useState } from "react";
import { getLocalizedContent } from "./utils/commanUtils";

function QualitativeFeedBack(props) {
    const [text, setText] = useState("");
    const maxCharLimit = 500; 

    const handleInputChange = (e) => {
        const inputValue = e.target.value;
        if (inputValue.length <= maxCharLimit) {
            setText(inputValue);
            props.setAns(props.data.questionId, inputValue);
        }
    };

    return (
        <React.Fragment>
            <div className="question-text mt-3 mb-2">
                <span style={{ marginRight: "10px" }}>{props?.seq}.</span>
                {getLocalizedContent(props?.data?.localizedMetadata)?.name}
                {props?.data?.mandatory && (
                    <span style={{ color: "red" }}>*</span>
                )}
            </div>
            <textarea
                className="form-control feedbackForm1"
                value={text}
                onChange={handleInputChange}
                placeholder={`Enter text here (Character limit: ${maxCharLimit})`}
                rows={Math.ceil(text.length / 50)}
            />
            {/* { props?.data?.mandatory && props?.errorQualitative && (
                <div style={{ color: "red" }}>{props.errorQualitative}</div>
            )} */}
            <p>
        Character Count: {text.length}/{maxCharLimit}
            </p>
            
        </React.Fragment>
    );
}

export default QualitativeFeedBack;

