import React from "react";

function ScaleTenFeedBack(props) {
    return (
        <div className='question-text fontSize14 mt-4 mb-2'>
            <span style={{ marginRight: "10px" }}>{props?.seq}.</span>
            {props?.data?.localizedMetadata[0].name}
            {props?.data?.mandatory && (
                <span style={{ color: "red" }}>*</span>
            )}

            <div className="scale-ten-feedback-container" style={{ display: "flex", gap: "10px" }}>
                {Array.apply(null, Array(10)).map((_, i) => {
                    const answerValue = (i + 1).toString();
                    return (
                        <div className="form-check me-4" key={i}>
                            <input
                                className="form-check-input me-2"
                                type="radio"
                                name={`questionType-${props.data.questionId}`}
                                value={answerValue}
                                onClick={() => props.setAns(props.data.questionId, answerValue)}
                            />
                            <label className="form-check-label" htmlFor={`questionType-${props.data.questionId}`}>
                                {answerValue}
                            </label>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default ScaleTenFeedBack;
