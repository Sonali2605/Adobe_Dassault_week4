// @ts-nocheck
import styled from 'styled-components';
import ".././styles/common.css";
import { useState } from 'react';

const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index:99999;
`;

const ModalContent = styled.div`
background-color: white;
padding: 40px 20px;
border-radius: 8px;
width: 660px; /* Adjust the width as needed */
`;

const ModalHeader = styled.div`
  position: relative;
  text-align: center;
`;

const ModalTitle = styled.div`
  font-size: 24px;
  font-weight: bold;
  font: normal normal normal 24px Impact;
`;


const Button = styled.button`
color: white;
border: none;
padding: 10px 20px;
margin-top: 20px;
cursor: pointer;
border-radius: 4px;
display: block;
margin: 0 auto;
margin-top: 20px;
`;


const SecondaryButton = styled(Button)`
  background-color: #ffffff;
  color: #4471e8;
  border: 1px solid #4471e8;
  padding: 10px 40px;
`;

const LoginRadio = styled.div`
display: flex;
color: #000;
justify-content: center;
& > label:nth-child(2) {
  margin-left: 15px;
}
& > label > input {
  width: auto;
  margin-right: 8px;
  top: 2px;
  position: relative;
}
`;
const InputField = styled.input`
width: 80%;
padding: 6px;
margin-top: 10px;
text-align: center;
transform: translateX(12%);
border: 1px solid #ada7a7;
background: #fff;
border-radius: 20px;
color: #000;
margin-bottom: 0.7rem
`;


const CompletionPopup = ({ onClose, navigatedashboard }) => {
  const [dashboard, setDashboard] = useState('customer'); // Default selection
  const handleGoToAcademy = () => {
    // onClose();
    const newPath = navigatedashboard === 'customer' ? '/DashboardCustomer' : '/dashboard';

    if (location.pathname !== newPath) {
       window.location.href = newPath;
     } 
    // Any additional logic when "Go to Academy" button is clicked
  };
  
 

  return (    
      <ModalContainer>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Congrats on joining the Nimbus Academy. You can now start with your courses.</ModalTitle>
                       
            <SecondaryButton onClick={handleGoToAcademy}>Go to Academy</SecondaryButton>
          </ModalHeader>
        </ModalContent>
      </ModalContainer>    
  );
};

export default CompletionPopup;