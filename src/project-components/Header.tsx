// @ts-nocheck

import { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import RegisterModal from './RegisterModel';
import LoginModalPage from './LoginModalPage';
import { clientId, clientSecreat, refreshToken, base_adobe_url } from "../AppConfig"
import { useLocation } from 'react-router-dom'; // Import the useLocation hook
import ".././styles/common.css";
import logo from '../assets/images/DS3logo.jpg';

import { useTranslation } from 'react-i18next';
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
    right: 0; /* Change this to left: 0 */
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
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const config = {
          headers: { Authorization: `oauth ${token}` },
        };
        const response = await axios.get<UserData>(
          "https://learningmanager.adobe.com/primeapi/v2/user",
          config
        );
        setUserData(response?.data?.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData(); // Call fetchUserData function
  }, []); // Add an empty dependency array to run this effect only once


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

      console.log("11111111111111Language", responseData)

      localStorage.setItem("selectedLanguage", responseData.data?.data?.attributes?.uiLocale)
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

  const openProfilePage = () => {
    window.location.href = '/profile'
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
    <>
      <HeaderContainer>
        {location.pathname.toLowerCase().includes('dashboardcustomer') || window.location.pathname.includes("/isCustomer=true/") ? (
          <> <Logo>
            <img style={{ width: '65%' }}
              src={logo}
              alt=''
            />
          </Logo>
            <Menu >
              <MenuItem className='products-menu uppercase' onClick={openHomePage} id='HOME'>
                {t('home')}
              </MenuItem>

              <MenuItem className='  products-menu uppercase' onClick={openAllCoursesPage} id='ALL_COURSES'>
                {t('allCourses')}
              </MenuItem>

              <MenuItem className='  products-menu uppercase' onClick={openMyLearningPage} id='MY_LEARNINGS'>
                {t('myLearnings')}
              </MenuItem>

              {location.pathname.toLowerCase().includes('dashboard') || location.pathname.toLowerCase().includes('dashboardcustomer') || window.location.pathname.includes("/isCustomer=true/") || location.pathname.toLowerCase().includes('/myLearnings') || window.location.pathname.includes("/allCourses")
                ?
                (<MenuItem className='products-menu uppercase'>
                  <img
                    src={userData?.attributes?.avatarUrl}
                    alt="Avatar"
                    style={{ marginTop: '-9px' }}
                    className="w-10 h-10 object-cover rounded-full"
                  />
                  <div className="submenu">
                    <MenuItem className='adobe-font' onClick={openProfilePage}>{userData?.attributes?.name}</MenuItem>
                    <MenuItem className='adobe-font' onClick={handleLogout}>{t('logout')}</MenuItem>
                    {/* Add more submenu items as needed */}
                  </div>
                </MenuItem>) :
                (
                  <MenuItem className='products-menu uppercase' onClick={() => setShowLoginModal(true)}>{t('login')}</MenuItem>
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
              <MenuItem className='products-menu uppercase' onClick={openHomePage} id='HOME'>
                {t('home')}
              </MenuItem>

              <MenuItem className='  products-menu uppercase' onClick={openAllCoursesPage} id='ALL_COURSES'>
                {t('allCourses')}
              </MenuItem>

              <MenuItem className='  products-menu uppercase' onClick={openMyLearningPage} id='MY_LEARNINGS'>
                {t('myLearnings')}
              </MenuItem>
              {/* <div className="submenu">
              <MenuItem className=' '>Pricing</MenuItem>
            </div> */}
              {location.pathname.toLowerCase().includes('dashboard') || location.pathname.toLowerCase().includes('dashboardcustomer') || window.location.pathname.includes("/detailspage") || location.pathname.toLowerCase().includes('/mylearnings') || window.location.pathname.toLowerCase().includes("/allcourses") || window.location.pathname.toLowerCase().includes("/profile")
                ?
                (
                  // <MenuItem className='products-menu uppercase' onClick={handleLogout}>{t('logout')}</MenuItem>
                  <MenuItem className='products-menu uppercase'>
                    <img
                      src={userData?.attributes?.avatarUrl}
                      alt="Avatar"
                      style={{ marginTop: '-9px' }}
                      className="w-10 h-10 object-cover rounded-full"
                    />
                    <div className="submenu">
                      <MenuItem className='adobe-font' onClick={openProfilePage}>{userData?.attributes?.name}</MenuItem>
                      <MenuItem className='adobe-font' onClick={handleLogout}>{t('logout')}</MenuItem>
                      {/* Add more submenu items as needed */}
                    </div>
                  </MenuItem>
                )
                :
                (
                  <MenuItem className='products-menu uppercase login' onClick={() => setShowLoginModal(true)}>{t('login')}</MenuItem>
                )
              }        </Menu>
          </>
        )}


        {/* {showLoginModal && (
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
              <a href="javascript:void(0)" className='text-blue-500' rel="noopener noreferrer">Forgot Password?</a>
            </div>
            <PrimaryButton className='mt-5 bg-[#55c1e3] text-white font-bold text-2xl py-2 px-6 rounded-full' onClick={handleLogin}>Login</PrimaryButton>
          </ModalContent>
        </ModalContainer>
      )} */}

      </HeaderContainer >
      
      {showRegisterModal && (
        <RegisterModal onClose={() => setShowRegisterModal(false)} />
      )}
      {showLoginModal && (<LoginModalPage></LoginModalPage>)}
    </>
  );
};

export default Header;
