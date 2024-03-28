import { Fragment } from "react";
import "../../styles/modal.css"; // Import the CSS file
import styled from 'styled-components';

interface ModalProps {
  show: boolean;
  handleClose: () => void;
  msg: string;
  title: string;
  imageUrl?: string;
}
const ModalCloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: 2px solid rgba(142, 161, 180, 1);
  cursor: pointer;
  font-size: 14px;
  width: 23px;
  height: 23px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size:12px;
  color:rgba(142, 161, 180, 1);
`;
const ModalforSuccess: React.FC<ModalProps> = ({ show, handleClose, msg, title, imageUrl }) => {
  return (
    <Fragment>
      {show && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="modal bg-white rounded-lg overflow-hidden shadow-xl relative">
            <div className="p-4 cursor-pointer relative h-12">
              <ModalCloseButton onClick={handleClose}>&#10005;</ModalCloseButton>
            </div>
            <div className="modal-content bg-white p-4">
              <h2 className=" text-center mb-4 modal-title">{title}</h2>
              <p className="text-center modal-text">{msg}</p>
              {imageUrl && <img src={imageUrl} alt="Description of the image" className="mx-auto mb-4" style={{ width: "180px", height: "168px" }} />}
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default ModalforSuccess;
