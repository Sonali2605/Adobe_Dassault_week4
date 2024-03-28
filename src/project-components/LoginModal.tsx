import React, { useState, } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { clientId, clientSecreat, refreshToken, base_adobe_url } from "../AppConfig"
import ".././styles/common.css";

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
 width: 460px; /* Adjust the width as needed */
`;

const ModalHeader = styled.div`
  position: relative;
  text-align: center;
`;

const ModalCloseButton = styled.button`
  position: absolute;
  top: -30px;
  right: -13px;
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

const ModalTitle = styled.div`
  font-size: 24px;
  font-weight: bold;
  font: normal normal normal 24px Impact;
`;

// const ModalSubheader = styled.div`
//   font-size: 18px;
//   margin-top: 10px;
//   text-align: center;
//   margin-top: 5px;
//   margin-bottom: 10px;
// `;

const InputField = styled.input`
  width: 93%;
  padding: 8px;
  margin-top: 10px;
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

const PrimaryButton = styled(Button)`
  background-color: #4471e8;
  color: #ffffff;
  padding: 10px 40px;
`;

// const SecondaryButton = styled(Button)`
//   background-color: #FFFFFF;
//   color: #4471E8;
//   border: 1px solid #4471E8;
//   padding: 10px 40px;
// `;

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

interface LoginModalProps {
  onClose: () => void; // Define the type of onClose prop
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose }) => {


  let [industryId , setIndustryId] = useState('');
  let [companyId , setCompanyId] = useState('');
  let [designationId , setDesignationId] = useState('');
  let [countryId , setCountryId] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>('');


  const handleLogin = async () => {
    //  onClose(); // Close modal
    try {
      const response = await axios.post('https://viku.space/renault/reapi.php', {
        action: 'login',
        username: username,
        password: password,
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InlhdGluIn0.SXp3ID7mgUcLGYMVkvb3RJgc_tJ1hGv2NR_08s5SYNM'
        }
      });
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

      const userDataResponse = await axios.get(
        `${base_adobe_url}/primeapi/v2/users?page[offset]=0&page[limit]=10&sort=id&ids=email:${username}`,
        {
          headers: {
            Authorization: `Bearer dea088ff9bbdca4e8cbbd5fa7de2d290`,
          },
        }
      );

      const userId = userDataResponse.data?.data?.[0]?.id;

      localStorage.setItem('userId', userId);
      const isManager = userDataResponse.data?.data?.[0]?.attributes?.roles.includes('Manager');

      const newPath = isManager ? '/managerDashboard' : '/dashboard';

      if (location.pathname !== newPath) {
        window.location.href = newPath;
      }

      console.log('Login successful', response.data);
      onClose(); // Close modal

      setIndustryId('');
      setCompanyId('');
      setDesignationId('');
      setCountryId('');
      setUsername('');
      setPassword('');
      setError('');
    } catch (error) {
      setError("Issue with Login");
    }
  };

  return (
    <ModalContainer>
      <ModalContent>
        <ModalHeader>
          <ModalCloseButton onClick={onClose}>&#10005;</ModalCloseButton>
          <ModalTitle>Thanks for showing interest in the Nimbus Cloud Academy. Please fill in your details</ModalTitle>
          {/* <div className='w-full pt-4 pb-4'>
            <LoginLineLeft>&nbsp;</LoginLineLeft>
            <span className='text-black'>Login</span>
            <LoginLineRight>&nbsp;</LoginLineRight>
          </div> */}
        </ModalHeader>
        <InputField className='border-2 rounded-md' type="email" placeholder="Company email" value={username} onChange={(e) => setUsername(e.target.value)} />
        <InputField className='border-2 rounded-md' type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <InputField className='border-2 rounded-md' type="text" placeholder="Industry" value={industryId} onChange={(e) => setIndustryId(e.target.value)} />
        <InputField className='border-2 rounded-md' type="text" placeholder="Company" value={companyId} onChange={(e) => setCompanyId(e.target.value)} />
        <InputField className='border-2 rounded-md' type="text" placeholder="Designation" value={designationId} onChange={(e) => setDesignationId(e.target.value)} />
        <InputField className='border-2 rounded-md' type="text" placeholder="Country" value={countryId} onChange={(e) => setCountryId(e.target.value)} />
        {error && <div style={{ color: 'red' }}>{error}</div>}

        <PrimaryButton className='w-8/12' onClick={handleLogin}>Submit</PrimaryButton>
      </ModalContent>
    </ModalContainer>
  );
};

export default LoginModal;
