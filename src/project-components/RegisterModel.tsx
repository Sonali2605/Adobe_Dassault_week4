// @ts-nocheck
import React, { useState, ChangeEvent } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import CompletionPopup from './CompletionPopup';
import ".././styles/common.css";
import { clientId, clientSecreat, refreshToken, base_adobe_url } from "../AppConfig"

const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* semi-transparent black background */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index:9999;
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

const ModalCloseButton = styled.button`
  position: absolute;
  top: -30px;
  right: -8px;
  background: none;
  border: 1px solid rgba(142, 161, 180, 1);
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

const ModalTitle = styled.div`
  font-size: 24px;
  font-weight: bold;
  font: normal normal normal 24px Impact;
`;

const ModalSubheader = styled.div`
  font-size: 18px;
  margin-top: 10px;
  text-align: center;
  margin-top: 5px;
  margin-bottom: 10px;
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

const Button = styled.button`
  color: white;
  border: none;
  padding: 10px 20px;
  margin-top: 20px;
  cursor: pointer;
  border-radius: 4px;
  display: block;
  margin: 0 auto; /* Align button to center */
  margin-top: 20px;
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
const SecondaryButton = styled(Button)`
border-radius: 9999px;
padding: 0.5rem 3rem;
`;

const Select = styled.select`
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

// const LoginLineRight = styled.span`
// display: inline-block;
//     width: 95px;
//     height: 2px;
//     background: linear-gradient(90deg, hsla(210, 39%, 75%, 1) 0%, hsla(0, 0%, 100%, 1) 100%, hsla(0, 0%, 100%, 1) 100%);
//     opacity: 1;
//     vertical-align: middle;
//     margin: 0 10px;
// `;
// const LoginLineLeft = styled.span`
// display: inline-block;
//     width: 95px;
//     height: 2px;
//     background: linear-gradient(90deg, hsla(0, 0%, 100%, 1) 0%, hsla(210, 39%, 75%, 1) 100%, hsla(0, 0%, 100%, 1) 100%);
//     opacity: 1;
//     vertical-align: middle;
//     margin: 0 10px;
// `;

interface RegisterModalProps {
  onClose: () => void; // Define the type of onClose prop
}

const RegisterModal: React.FC<RegisterModalProps> = ({ onClose }) => {
  const [showCompletionPopup, setShowCompletionPopup] = useState(false);
  const [selectedOption, setSelectedOption] = useState('customer');   
  
  const handleClosePopup = () => {
    setShowCompletionPopup(false);
  };

  const [formData, setFormData] = useState({
    id: '',
    username: '',
    password: '',
    dashboardId: '',
    industryId: '',
    companyId: '',
    designationId: '',
    countryId: '',


  });

  const handleSelect= (option) => {    
    setSelectedOption(option);    
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };


  const checkUsername = async () => {
    try {
      const response = await axios.post('https://viku.space/renault/reapi.php', {
        action: 'checkUsername',
        username: formData.username
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InlhdGluIn0.SXp3ID7mgUcLGYMVkvb3RJgc_tJ1hGv2NR_08s5SYNM',
          'header1': 'test'
        }
      });

      if (response.data.exists) {
        alert('Username already exists. Please choose another one.');
        return false;
      } else {
        return true;
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
      return false;
    }
  };

  const handleSubmit = async () => {
    console.log(selectedOption);

    const client_id = clientId;
    const client_secret = clientSecreat;
    const refresh_token = refreshToken;

    const params = new URLSearchParams({
      client_id,
      client_secret,
      refresh_token
    });
    const url = `${base_adobe_url}/oauth/token/refresh`;
    const responseToken = await axios.post(
      `${url}`,
      params,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    const tokenData = responseToken.data;
    localStorage.setItem(
      'access_token',
      tokenData.access_token
    );
    // Validation: Check if any field is empty
    if (formData.username === '' || formData.password === '') {
      alert('Please fill in all fields.');
      return;
    }

    // Check if username already exists
    const usernameAvailable = await checkUsername();
    if (!usernameAvailable) {
      return;
    }

    // Proceed with registration if username is available
    try {
      // API Call for registration using Axios
      const response = await axios.post('https://viku.space/renault/reapi.php', {
        action: 'register',
        username: formData.username,
        password: formData.password
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InlhdGluIn0.SXp3ID7mgUcLGYMVkvb3RJgc_tJ1hGv2NR_08s5SYNM'
        }
      });

      // Handle API response
      //  console.log(response.data);
      // Close modal and show success message if API call is successful
      if (response.data.success) {
        // onClose(); // Close modal
        setShowCompletionPopup(true);
        alert('Registration successful!');
      } else {
        // Handle API response indicating failure
        alert('Registration failed. Please try again.');
      }
    } catch (error) {
      // Handle errors
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <>
      {!showCompletionPopup && (
        <ModalContainer>
          <ModalContent>
            <ModalHeader>
              <ModalCloseButton onClick={onClose}>&#10005;</ModalCloseButton>
              <ModalTitle>Thanks for showing interest in the Nimbus Cloud Academy.
                <br></br>Please fill in your details. </ModalTitle>
            </ModalHeader>
            <ModalSubheader>

              {/* <div className='w-full pt-4 pb-4'>
            <LoginLineLeft>&nbsp;</LoginLineLeft>
            <LoginLineRight>&nbsp;</LoginLineRight>
          </div> */}

            </ModalSubheader>
            <InputField className='border-2 rounded-md'
              type="email"
              value={formData.username}
              onChange={handleChange}
              name="username"
              placeholder="Company email"
            />
            <InputField className='border-2 rounded-md'
              type="password"
              value={formData.password}
              onChange={handleChange}
              name="password"
              placeholder="Password"
            />
            <InputField className='border-2 rounded-md'
              type="text"
              value={formData.industryId}
              onChange={handleChange}
              name="industryId"
              placeholder="Industry"
            />
            <InputField className='border-2 rounded-md'
              type="text"
              value={formData.companyId}
              onChange={handleChange}
              name="companyId"
              placeholder="Company"
            />
            <InputField className='border-2 rounded-md'
              type="text"
              value={formData.designationId}
              onChange={handleChange}
              name="designationId"
              placeholder="Designation"
            />
            <InputField className='border-2 rounded-md'
              type="text"
              value={formData.countryId}
              onChange={handleChange}
              name="countryId"
              placeholder="Country"
            />

            <Select  name="dashboard" className='dropdown' value={selectedOption}onChange={(e)=> handleSelect(e.target.value)}>
              <option selected value="customer"> Customer Dashboard </option>
              <option  value="partnership">Partnership Dashboard</option>
            </Select>

{/* <LoginRadio>
            <label>
              <InputField 
                type="radio" 
                value="customer" 
                checked={dashboard === 'customer'} 
                onChange={() => setDashboard('customer')} 
              />
               Customer Dashboard
              </label>
              <label>

              
              <InputField 
                type="radio" 
                value="partnership" 
                checked={dashboard === 'partnership'} 
                onChange={() => setDashboard('partnership')} 
              />
              Partnership Dashboard
              </label>
            </LoginRadio>  */}
            {/* <InputField className='border-2 rounded-md'
          type="text"
          value={formData.dashboardId}
          onChange={handleChange}
          name="dashboardId"
          placeholder="Dashboard"
        /> */}

            <SecondaryButton className="px-10 py-3 text-2xl rounded-full bg-[#55c1e3] text-white font-bold" onClick={handleSubmit}>Submit</SecondaryButton>
          </ModalContent>
        </ModalContainer>
      )}
      {showCompletionPopup && (
        <CompletionPopup navigatedashboard={selectedOption} onClose={handleClosePopup} />
      )}
    </>
  );
};

export default RegisterModal;
