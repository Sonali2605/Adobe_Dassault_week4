import React, { useState } from 'react';
import ScaleTenFeedBack from './ScaleTenFeedBack';
import LikeabilityFeedback from './LikeabilityFeedbak';
import QualitativeFeedBack from './QualitativeFeedBack';
import Success_Icon from "/images/Success_Icon.png";
import Failure1_Icon from "/images/Failure1_Icon.png";
import { Modal } from "react-bootstrap";
import { apis } from '.././apiServices/apis'
import axios from "axios";

const FeedbackModal = ({ show, handleClose, feedBack, enrollmentId }) => {
    const [questionsData, setQuestionsData] = useState(feedBack);
    const [errorQualitative] = useState("");
    const [errorScale] = useState("");
    const [errorLikeability] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [showFBModal, setShowFBModal] = useState(true);
    const [modalMessage, setModalMessage] = useState("");
    const [image, setImage] = useState(true);
    const [showErrorMsg, setShowErrorMsg] = useState(false)

    const handleOkDisplayMessage = () => {
        setShowModal(false);
        setShowFBModal(true);
        handleClose();
    };
    const setAns = (id, ans) => {
        // eslint-disable-next-line no-unsafe-optional-chaining
        let tempQuestions = [...questionsData?.attributes.questions];
        let index = tempQuestions.findIndex((e) => {
            return e.questionId === id;
        });
        tempQuestions[index].answer = ans;
        setQuestionsData({
            ...questionsData,
            attributes: {
                ...questionsData.attributes,
                questions: tempQuestions
            }
        });
    };

    const submitAns = async () => {
        // eslint-disable-next-line no-prototype-builtins
        setShowErrorMsg(false)
        let check = false;
        const answeredQuestions = questionsData?.attributes?.questions?.filter((item) => {
            return Object.prototype.hasOwnProperty.call(item, "answer");
        });


        let hasEmptyMandatoryField = questionsData?.attributes?.questions?.forEach((e) => {

            if (e?.mandatory && !e?.answer?.trim()) {
                // setShowErrorMsg(true)
                check = true
            }
        });


        if (!check) {
            // Prepare the payload                    
            if (answeredQuestions.length !== 0 && !hasEmptyMandatoryField) {
                const payload = {
                    data: {
                        id: questionsData?.id,
                        type: questionsData?.type,
                        attributes: {
                            showAutomatically: questionsData?.attributes.showAutomatically,
                            score: parseInt(answeredQuestions[0].answer),
                            questions: answeredQuestions.map((e) => ({
                                mandatory: e.mandatory,
                                questionId: e.questionId,
                                questionType: e.questionType,
                                answer: e.answer
                            }))
                        }
                    }
                };
                try {
                    // let enrolledInstanceId = enrollmentId;
                    const token = await apis.getRefreshToken()
                    // setlearnerToken(res.access_token)
                    let res;
                    if (payload) {
                        try {
                            res = await axios.post(
                                `https://learningmanager.adobe.com/primeapi/v2/enrollments/${enrollmentId}/l1Feedback`,
                                payload,
                                {
                                    headers: {
                                        Authorization: `bearer ${token.access_token}`,
                                        "Content-Type": "application/vnd.api+json;charset=UTF-8",
                                        Accept: "application/vnd.api+json;charset=UTF-8"
                                    }
                                }
                            );

                            console.log("Response:", res.data);
                        } catch (error) {
                            console.error("Error:", error?.response.data);
                        }

                        // let res = await apis.sendL1FeedbackAnswersFromALearner(enrolledInstanceId, payload);
                        if (res?.status === 204) {
                            // alert(" successfully submitted feedback")
                            setShowModal(true);
                            setModalMessage("Feedback submitted successfully.");
                            setShowFBModal(false);
                            handleClose();
                        } else if (
                            res?.status === 400 &&
                            res?.data?.source?.info?.toLowerCase() == "feedback for the lo is already given."
                        ) {
                            // alert("feedback-already-given")
                            setShowModal(true);
                            setModalMessage("You have already provided the feedback.");
                            setImage(false);
                            setShowFBModal(false);
                            handleClose();
                        } else {
                            // alert("something went wrong please try again later")
                            setShowModal(true);
                            setModalMessage("An error occurred while submitting your feedback. Please try again later.");
                            setImage(false);
                            setShowFBModal(false);
                            // handleClose();
                        }
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        } else {
            setShowErrorMsg(true)
        }
    };

    const questionTypeUI = (e, i) => {
        let questionIndexId = i + 1
        switch (e.questionType) {
            case "scaleTen":
                return (
                    <ScaleTenFeedBack
                        key={e.id}
                        seq={questionIndexId}
                        data={e}
                        setAns={setAns}
                        errorScale={errorScale}></ScaleTenFeedBack>
                );
            case "likeability":
                return (
                    <LikeabilityFeedback
                        key={e.id}
                        seq={questionIndexId}
                        data={e}
                        setAns={setAns}
                        errorLikeability={errorLikeability}></LikeabilityFeedback>
                );
            case "l1Qualitative":
                return (
                    <QualitativeFeedBack
                        key={e.id}
                        seq={questionIndexId}
                        data={e}
                        setAns={setAns}
                        errorQualitative={errorQualitative}></QualitativeFeedBack>
                );
            default:
                break;
        }
    };

    return (
        <>
            {showFBModal && (<div className={show ? 'fixed inset-0 z-50 overflow-hidden flex justify-center items-center' : 'hidden'}>
                {!show && <div className="modal-overlay absolute inset-0 bg-black opacity-50"></div>}
                <div className="modal-content bg-white rounded-lg shadow-lg p-6 w-1/2">
                    <div className="modal-header flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">Feedback</h2>
                        <button className="close-button text-gray-500 hover:text-gray-700" onClick={handleClose}>
                            &times;
                        </button>
                    </div>
                    <div className="modal-body mb-4">
                        {/* <h5 className="fw-bold">{courseDetails?.attributes.localizedMetadata[0].name}</h5> */}
                        {questionsData?.attributes.questions.map((e, i) => (
                            <React.Fragment key={i}>{questionTypeUI(e, i)}</React.Fragment>
                        ))}
                        {showErrorMsg ? <>
                            <div style={{ color: "red" }}>Please fill out all required questions</div>
                        </> : <></>}
                    </div>
                    <div className="modal-footer text-right">
                        {/* <button className="btn bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600" onClick={handleClose}>
            Submit
          </button> */}
                        <button className="btn btn-link m-2" onClick={handleClose}>
                            Cancel
                        </button>
                        <button className="btn primary-btn primary-blue m-2" onClick={submitAns}>
                            Submit
                        </button>
                    </div>
                </div>
            </div>)}

            {showModal && (
                <div className="modal-container success-modal" style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0,0,0,0.5)"
                }}>
                    <Modal centered show={showModal} style={{
                        position: "absolute",
                        width: "50%",
                        height: "auto",
                        backgroundColor: "#fff",
                        margin: "0 auto",
                        padding: "10px 40px",
                        top: "35%",
                        left: "23%"
                    }}  >
                        <Modal.Body className="my-5">
                            <div className="success-modal-container text-center">
                                {image ? (
                                    <img className="failed-icon m-auto" src={Success_Icon} alt="Success" style={{ margin: "0 auto 20px", width: "60px" }}></img>
                                ) : (
                                    <img className="failed-icon" src={Failure1_Icon} alt="failed" style={{ margin: "0 auto 20px", width: "60px" }}></img>
                                )}
                                <div className="success-text-message2">{modalMessage}</div>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <button className="btn primary-btn primary-blue m-2" onClick={() => handleOkDisplayMessage()} style={{
                                padding: "5px 20px",
                                border: "1px solid #333",
                                borderRadius: "4px",
                                margin: "0 auto 25px",
                                position: "relative",
                                left: "calc(50% - 30px)"
                            }}>
                                Ok
                            </button>
                        </Modal.Footer>
                    </Modal>
                </div>)}
        </>
    );
};

export default FeedbackModal;
