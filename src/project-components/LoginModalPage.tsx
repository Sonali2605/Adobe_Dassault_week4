// @ts-nocheck
import { useState } from 'react';
import styled from 'styled-components';
import RegisterModal from './RegisterModel';
import axios from 'axios';

import { useNavigate, useLocation } from "react-router-dom";
import ".././styles/common.css";

import { clientId, clientSecreat, refreshToken, base_adobe_url } from "../AppConfig"
import { useTranslation } from 'react-i18next';
import logo from '../assets/images/DS3logo.jpg';
import banner from '../assets/images/login-bg.png';
const LoginContener = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #000;
  display: block;
  z-index:9999;
  overflow: hidden;
`;

const LeftContener = styled.div`
  background-color: #033c64;
 padding: 0; 
 margin:0; 
 width: 53%;
 height: 100%;
 position:relative;
 display:inline-block;
 vertical-align: top; 
 overflow: hidden;
 
`;
const RightContener = styled.div`
background-color: #fff;
padding: 0;  
margin:0;
width: 47%;
height: 100%;
position:relative;
display:inline-block;
vertical-align: top; 
`;

const TextBoxWrapper = styled.div`
  text-align:left;
position:relative;
width:80%;
margin:0 auto;
color:#000;
top:50%;
transform: translateY(-50%);
`;

const TextRow = styled.div`  
  margin-bottom: 10px;
  width:100%;
  position:relative;
`;

const InputField = styled.input`
width: 100%;
padding: 6px;
text-align: left;
border: 1px solid #ada7a7;
background: #fff;
border-radius: 4px;
color: #000;
margin-top:6px;
`;

const Button = styled.button`
padding: 10px 20px;
margin-top: 20px;
cursor: pointer;
border-radius: 4px;
display: block;
margin: 0 auto;
margin-top: 20px;
`;

const PrimaryButton = styled(Button)`
color: #fff;
border-radius: 6px;
padding: 0.5rem 3rem;
width:100%;
border: none;
`;
const SecondaryButton = styled(Button)`
position: absolute;
top: 20px;
right: 0;
border: 1px solid #000;
padding: 2px 10px;
margin: 0;
font-size: 1.3rem;
background-color:transparent;
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

interface LoginModalPageProps {
  onClose: () => void; // Define the type of onClose prop
}

const LoginModalPage: React.FC<LoginModalPageProps> = ({ onClose }) => {

  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [dashboard, setDashboard] = useState('customer'); // Default selection
  const [error, setError] = useState<string>('');
  const [, setAgencyId] = useState('');

  const { t } = useTranslation();
  const handleLogin = async () => {
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
        `${base_adobe_url}/primeapi/v2/user`,
        {
          headers: {
            Authorization: `Bearer ${tokenData.access_token}`,
          },
        }
      );

      const userId = userDataResponse.data?.data?.id;

      localStorage.setItem('userId', userId);
      // const isManager = userDataResponse.data?.data?.[0]?.attributes?.roles.includes('Manager');
      const config = {
        headers: { Authorization: `oauth ${tokenData.access_token}` },
      };
      let contentLocale = "en-US";
      const bodyData = {
        data: {
          id: userId,
          type: 'user',
          attributes: {
            contentLocale: contentLocale,
            uiLocale: contentLocale,
          },
        },
      }
      const responseData = await axios.patch(
        `${base_adobe_url}/primeapi/v2/users/${userId}`, bodyData, config);

      // console.log("11111111111111Language", responseData)

      localStorage.setItem("selectedLanguage", responseData.data?.data?.attributes?.uiLocale)
      const newPath = '/dashboard';

      if (location.pathname !== newPath) {
        window.location.href = newPath;
      }

      console.log('Login successful', response.data);
      setAgencyId('');
      setUsername('');
      setPassword('');
      setError('');
      setDashboard('');
    } catch (error) {
      setError("Issue with Login");
    }
  };

  return (
    <>
      <LoginContener >
        <LeftContener >
          <img src={banner} alt="Login Image" style={{
            maxWidth: "inherit",
            height: "100%",
            width: "auto",
            position: "relative",
            top: "45%",
            transform: "translateY(-50%)"
          }} />
        </LeftContener >
        <RightContener >
          <TextBoxWrapper >
            <TextRow>
              <img src= {logo} alt="Login Logo" style={{
                width: "180px",
                height: "auto",
                marginBottom: "30px"
              }} />
              <SecondaryButton className="font-bold text-2xl rounded-full" onClick={() => navigate('/allCourses?login=true')}>Explore Courses</SecondaryButton>
            </TextRow>
            <TextRow>
              <span className='font-bold text-2xl text-black-800'>LOGIN</span>
            </TextRow>
            <TextRow>
              <label htmlFor="emailInput">Username</label>
              <InputField id="emailInput" className='border-2 rounded-md' type="email" placeholder="Company email" value={username} onChange={(e) => setUsername(e.target.value)} />
            </TextRow>

            <TextRow>
              <label htmlFor="passwordInput">Password</label>
              <InputField id="passwordInput" className='border-2 rounded-md' type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </TextRow>
            {error && <TextRow><div style={{ color: 'red' }}>{error}</div></TextRow>}
            <div className='text-center mt-3'>
              <a href="javascript:void(0)" className='text-blue-500' rel="noopener noreferrer">Forgot Password?</a>
            </div>
            <TextRow>
              <PrimaryButton className='mt-5 bg-[#55c1e3] text-white font-bold text-2xl py-2 px-6 rounded-full' onClick={handleLogin}>Login</PrimaryButton>
            </TextRow>

            <TextRow>
              <div className='text-center mt-3'>
                <span className='text-gray-500'>New user?</span> <a href="javascript:void(0)" className='text-blue-500' rel="noopener noreferrer" onClick={() => setShowRegisterModal(true)}>Register Now</a>
              </div>
            </TextRow>
          </TextBoxWrapper >
        </RightContener >
      </LoginContener >
      {showRegisterModal && (
        <RegisterModal onClose={() => setShowRegisterModal(false)} login={false} />
      )}
    </>
  );
};

export default LoginModalPage;
