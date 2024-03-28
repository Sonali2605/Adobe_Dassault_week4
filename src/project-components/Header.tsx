// @ts-nocheck

import { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import RegisterModal from './RegisterModel';
import { clientId, clientSecreat, refreshToken, base_adobe_url } from "../AppConfig"
import { useLocation } from 'react-router-dom'; // Import the useLocation hook
import ".././styles/common.css";
import logo from '../assets/images/3DExpEdu1920.png'
const HeaderContainer = styled.div<{ isLogin: boolean }>`
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
  color: #333;
  height: 5rem;
  background-color: ${(props) => (props.isLogin ? 'transparent' : '#fff')}; /* Conditionally set background color */
`;

const Logo = styled.div`
  font-weight: bold;
  font: normal normal 24px Impact;
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
`

const Menu = styled.div`
  display: flex;
  gap: 20px;
  font: normal bold 25px bahnschrift;

  /* Nested Menu Items */
  & > .products-menu {
    position: relative;
  }

  & > .products-menu:hover{
    color:#55c1e3;
  }

  /* Submenu Container */
  .submenu {
    position: absolute;
    top: 100%;
    left: 0;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    padding: 10px;
    display: none;
    width: max-content;
  }

  /* Submenu Text Color */
  .submenu .adobe-font {
    color: #ffffff;
  }

  /* Increase space between submenu items */
  .submenu .adobe-font:not(:last-child) {
    margin-bottom: 10px; /* Adjust the margin as needed */
  }

  /* Show Submenu on Hover */
  .products-menu:hover .submenu {
    display: block;
  }
`;

const MenuItem = styled.div`
  cursor: pointer;
  font-size: 20px;
  color: #005686;
`;

const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 40px 20px;
  border-radius: 8px;
  width: 500px; /* Adjust the width as needed */
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
  font-size: 12px;
  color: rgba(142, 161, 180, 1);
`;

const ModalTitle = styled.div`
  font-size: 24px;
  font-weight: bold;
  font: normal normal normal 24px Impact;
  color: #000
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
  margin: 0 auto;
  margin-top: 20px;
`;

const PrimaryButton = styled(Button)`
border-radius: 9999px;
padding: 0.5rem 3rem;
`;

// const LoginLineRight = styled.span`
//   display: inline-block;
//   width: 95px;
//   height: 2px;
//   background: linear-gradient(90deg, hsla(210, 39%, 75%, 1) 0%, hsla(0, 0%, 100%, 1) 100%, hsla(0, 0%, 100%, 1) 100%);
//   opacity: 1;
//   vertical-align: middle;
//   margin: 0 10px;
// `;

// const LoginLineLeft = styled.span`
//   display: inline-block;
//   width: 95px;
//   height: 2px;
//   background: linear-gradient(90deg, hsla(0, 0%, 100%, 1) 0%, hsla(210, 39%, 75%, 1) 100%, hsla(0, 0%, 100%, 1) 100%);
//   opacity: 1;
//   vertical-align: middle;
//   margin: 0 10px;
// `;

const Header = ({ isLogin }: { isLogin: boolean }) => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [, setAgencyId] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>('');
  const [dashboard, setDashboard] = useState('customer'); // Default selection
  const location = useLocation(); // Get the current location

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
        `${base_adobe_url}/primeapi/v2/users?page[offset]=0&page[limit]=10&sort=id&ids=email:${username}`,
        {
          headers: {
            Authorization: `Bearer ${tokenData.access_token}`,
          },
        }
      );

      const userId = userDataResponse.data?.data?.[0]?.id;

      localStorage.setItem('userId', userId);
      // const isManager = userDataResponse.data?.data?.[0]?.attributes?.roles.includes('Manager');

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

  const handleLogout = () => {
    setAgencyId('');
    setUsername('');
    setPassword('');
    setError('');
    setDashboard('');
    localStorage.clear();
    window.location.href = '/'
  }
  console.log(location.pathname.toLowerCase().includes('dashboardcustomer'))
  console.log(window.location.pathname.includes("/isCustomer=true/"))

  const openHomePage = function () {
    const newPath = '/dashboard';
    if (location.pathname !== newPath) {
     window.location.href = newPath;
    }
  }
  const openAllCoursesPage = function () {
    const newPath = '/allCourses';
    if (location.pathname !== newPath) {
     window.location.href = newPath;
    }
  }
  const openMyLearningPage = function () {
    const newPath = '/myLearnings';
    if (location.pathname !== newPath) {
     window.location.href = newPath;
    }
  }

  return (
    <HeaderContainer>
      {location.pathname.toLowerCase().includes('dashboardcustomer') || window.location.pathname.includes("/isCustomer=true/") ? (
        <> <Logo>
          <img style={{ width: '65%' }}
            src={logo}
            alt=''
          />
        </Logo>
          <Menu >
            <MenuItem className='products-menu' onClick={openHomePage} id='HOME'>
              HOME
            </MenuItem>

            <MenuItem className='  products-menu' onClick={openAllCoursesPage} id='ALL_COURSES'>
              ALL COURSES
            </MenuItem>

            <MenuItem className='  products-menu' onClick={openMyLearningPage} id='MY_LEARNINGS'>
              MY LEARNINGS
            </MenuItem>

            {location.pathname.toLowerCase().includes('dashboard') || location.pathname.toLowerCase().includes('dashboardcustomer') || window.location.pathname.includes("/isCustomer=true/")
              ?
              (<MenuItem className='products-menu' onClick={handleLogout}>LOGOUT</MenuItem>) :
              (
                <MenuItem className='products-menu' onClick={() => setShowLoginModal(true)}>LOGIN</MenuItem>
              )
            }

          </Menu>
        </>

      ) : (
        <>
          <Logo>
              <img style={{ width: '65%' }}
                src={logo}
                alt=''
              />
            </Logo>
          <Menu >
            <MenuItem className='products-menu' onClick={openHomePage} id='HOME'>
              HOME
            </MenuItem>

            <MenuItem className='  products-menu' onClick={openAllCoursesPage} id='ALL_COURSES'>
              ALL COURSES
            </MenuItem>

            <MenuItem className='  products-menu' onClick={openMyLearningPage} id='MY_LEARNINGS'>
              MY LEARNINGS
            </MenuItem>
            {/* <div className="submenu">
              <MenuItem className=' '>Pricing</MenuItem>
            </div> */}
            {location.pathname.toLowerCase().includes('dashboard') || location.pathname.toLowerCase().includes('dashboardcustomer') || window.location.pathname.includes("/isCustomer=false/")
              ?
              (<MenuItem className='products-menu' onClick={handleLogout}>LOGOUT</MenuItem>) :
              (
                <MenuItem className='products-menu' onClick={() => setShowLoginModal(true)}>LOGIN</MenuItem>
              )
            }        </Menu>
        </>
      )}


      {showLoginModal && (
        <ModalContainer>
          <ModalContent>
            <ModalHeader>
              <ModalCloseButton onClick={() => setShowLoginModal(false)}>&#10005;</ModalCloseButton>
              <ModalTitle>Login</ModalTitle>
              {/* <div className='w-full pt-4 pb-4'>
                <LoginLineLeft>&nbsp;</LoginLineLeft>
                <span className='text-black'>Login</span>
                <LoginLineRight>&nbsp;</LoginLineRight>
              </div> */}
            </ModalHeader>
            <InputField className='border-2 rounded-md' type="email" placeholder="Company email" value={username} onChange={(e) => setUsername(e.target.value)} />
            <InputField className='border-2 rounded-md' type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />

            {/*}  <LoginRadio>
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
            </LoginRadio>*/}

            {/* <InputField className='border-2 rounded-md' type="text" placeholder="Dashboard" value={dashboard} onChange={(e) => setDashboard(e.target.value)} /> */}

            {/* <InputField className='border-2 rounded-md' type="text" placeholder="Industry" value={agencyId} onChange={(e) => setAgencyId(e.target.value)} />
            <InputField className='border-2 rounded-md' type="text" placeholder="Company" value={agencyId} onChange={(e) => setAgencyId(e.target.value)} />
            <InputField className='border-2 rounded-md' type="text" placeholder="Designation" value={agencyId} onChange={(e) => setAgencyId(e.target.value)} />
            <InputField className='border-2 rounded-md' type="text" placeholder="Country" value={agencyId} onChange={(e) => setAgencyId(e.target.value)} /> */}
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <div className='text-center mt-3'>
              <a href="javascript:void(0)" className='text-blue-500' rel="noopener noreferrer">Forgot Password?</a>
            </div>
            <PrimaryButton className='mt-5 bg-[#55c1e3] text-white font-bold text-2xl py-2 px-6 rounded-full' onClick={handleLogin}>Login</PrimaryButton>
          </ModalContent>
        </ModalContainer>
      )}

      {showRegisterModal && (
        <RegisterModal onClose={() => setShowRegisterModal(false)} />
      )}
    </HeaderContainer >
  );
};

export default Header;
