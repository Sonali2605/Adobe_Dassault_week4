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

// const ModalContainer = styled.div`
//   position: fixed;
//   top: 0;
//   left: 0;
//   width: 100%;
//   height: 100%;
//   background-color: rgba(0, 0, 0, 0.5);
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   z-index:9998;
// `;

// const ModalContent = styled.div`
// background-color: white;
// padding: 40px 20px;
// border-radius: 8px;
// width: 500px; /* Adjust the width as needed */
// `;

// const ModalHeader = styled.div`
//   position: relative;
//   text-align: center;
// `;

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
  font-size: 12px;
  color: rgba(142, 161, 180, 1);
`;

// const ModalTitle = styled.div`
//   font-size: 24px;
//   font-weight: bold;
//   font: normal normal normal 24px Impact;
// `;

// const InputField = styled.input`
// width: 80%;
// padding: 6px;
// margin-top: 10px;
// text-align: center;
// transform: translateX(12%);
// border: 1px solid #ada7a7;
// background: #fff;
// border-radius: 20px;
// color: #000;
// margin-bottom: 0.7rem
// `;

// const Button = styled.button`
// color: white;
// border: none;
// padding: 10px 20px;
// margin-top: 20px;
// cursor: pointer;
// border-radius: 4px;
// display: block;
// margin: 0 auto;
// margin-top: 20px;
// `;

const PrimaryButton = styled(Button)`
border-radius: 9999px;
padding: 0.5rem 3rem;
`;

// // const SecondaryButton = styled(Button)`
// //   background-color: #ffffff;
// //   color: #4471e8;
// //   border: 1px solid #4471e8;
// //   padding: 10px 40px;
// // `;


// const LoginRadio = styled.div`
// display: flex;
// color: #000;
// justify-content: center;
// & > label:nth-child(2) {
//   margin-left: 15px;
// }
// & > label > input {
//   width: auto;
//   margin-right: 8px;
//   top: 2px;
//   position: relative;
// }
// `
const CompletionPopup = ({ onClose, navigatedashboard, login }) => {
  const [dashboard, setDashboard] = useState('customer'); // Default selection
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>('');
  const handleGoToAcademy = () => {
    // onClose();

    if(login){
      setShowLoginModal(true)
    } else {
      const newPath = '/dashboard';

      if (location.pathname !== newPath) {
         window.location.href = newPath;
       }
    }
    
  };
  
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
      const bodyData= {
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
        `${base_adobe_url}/primeapi/v2/users/${userId}`,bodyData,config);

      console.log("11111111111111Language", responseData)
      
      localStorage.setItem("selectedLanguage",responseData.data?.data?.attributes?.uiLocale )
      const newPath = '/dashboard';

      if (location.pathname !== newPath) {
        window.location.href = newPath;
      }

      console.log('Login successful', response.data);
      setShowLoginModal(false);
      setAgencyId('');
      setUsername('');
      setPassword('');
      setError('');
      setDashboard('');
    } catch (error) {
      setError("Issue with Login");
    }
  };
  
  const handleRegisterHere = ()=>{
    setShowLoginModal(false);
    setShowRegisterModal(true)
  }

  return (   
    <>
      <ModalContainer>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Congrats on joining the Dassault Systèmes. You can now start with your courses.</ModalTitle>
                       
            <SecondaryButton onClick={handleGoToAcademy}>Go to Academy</SecondaryButton>
          </ModalHeader>
        </ModalContent>
      </ModalContainer>    
      {showLoginModal && (
        <ModalContainer>
          <ModalContent>
            <ModalHeader>
              <ModalCloseButton onClick={() => setShowLoginModal(false)}>&#10005;</ModalCloseButton>
              <ModalTitle>Login</ModalTitle>
            </ModalHeader>
            <InputField className='border-2 rounded-md' type="email" placeholder="Company email" value={username} onChange={(e) => setUsername(e.target.value)} />
            <InputField className='border-2 rounded-md' type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <div className='text-center mt-3'>
              New user?
              <a href="javascript:void(0)" className='text-blue-500' rel="noopener noreferrer"onClick={handleRegisterHere}>Register Here</a>
            </div>
            <PrimaryButton className='mt-5 bg-[#55c1e3] text-white font-bold text-2xl py-2 px-6 rounded-full' onClick={handleLogin}>Login</PrimaryButton>
          </ModalContent>
        </ModalContainer>
      )}

  </> 
  );
};

export default CompletionPopup;