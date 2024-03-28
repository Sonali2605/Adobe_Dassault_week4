import React from 'react';

const FeedbackModal = ({ show, handleClose }) => {
  return (
    <div className={show ? 'fixed inset-0 z-50 overflow-hidden flex justify-center items-center' : 'hidden'}>
      {!show && <div className="modal-overlay absolute inset-0 bg-black opacity-50"></div>}
      <div className="modal-content bg-white rounded-lg shadow-lg p-6">
        <div className="modal-header flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Feedback</h2>
          <button className="close-button text-gray-500 hover:text-gray-700" onClick={handleClose}>
            &times;
          </button>
        </div>
        <div className="modal-body mb-4">
          <p className="text-gray-700">Please provide your feedback:</p>
          {/* Add your feedback form or input fields here */}
          {/* Example input field */}
          <textarea className="mt-2 p-2 w-full border rounded-md" rows="4" cols="50"></textarea>
        </div>
        <div className="modal-footer text-right">
          <button className="btn bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600" onClick={handleClose}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;
