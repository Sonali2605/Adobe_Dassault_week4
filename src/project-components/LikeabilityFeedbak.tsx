// @ts-nocheck

import React, { useState } from "react";
// import { useTranslation } from "react-i18next";
// import "./LikeabilityFeedback.css";

function LikeabilityFeedback(props) {

    // const {t} = useTranslation()

    let [LikeabilityFeedbackAns] = useState([
        {
            id: 1,
            name: "Strongly disagree"
        },
        {
            id: 2,
            name: "Disagree"
        },
        {
            id: 3,
            name: "Ok"
        },
        {
            id: 4,
            name: "Agree"
        },
        {
            id: 5,
            name: "Strongly agree"
        },
    ])

    const feedbackTranslator = (feedback)=>{
        
        const formatedText = feedback.split(" ").join("-").toLowerCase()
        // const translatedText = t(formatedText)
        
        // if ( translatedText === formatedText ) {
        //     return feedback
        // }
        // else {
        //     return translatedText   
        // }
        return feedback;
    }
    
    return (
        <React.Fragment className="Feedback">
            <div className='question-text fontSize14 mt-4 mb-2'>
                <span style={{ marginRight: "10px" }}>{props?.seq}.</span>
                {props.data.localizedMetadata[0].name}
                {props.data.mandatory && (
                    <span style={{ color: "red" }}>*</span>
                )}
            </div>
            <div className="d-flex">
            {LikeabilityFeedbackAns.map(function (x) {
                return <React.Fragment key={x.id}>
                    <div className="form-check form-check-inline me-3">
                        <input className="form-check-input me-2" type="radio" name={"questionType" + props.data.questionId} value={x.name} onClick={() => props.setAns(props.data.questionId, x.name)} />
                        <label className="form-check-label me-3" htmlFor="inlineRadio11">{feedbackTranslator(x.name)}</label>
                    </div>
                </React.Fragment>
            })}
            </div>
            {/* {props?.data?.mandatory && props?.errorLikeability && <div style= {{color:"red"}}>{props?.errorLikeability}</div>} */}
        </React.Fragment>
    );
}

export default LikeabilityFeedback;