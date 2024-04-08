import { useEffect, useState } from 'react';
import axios from 'axios';
import './ProfileModal.css'; 
import LanguageDropdown from './LanguageDropdown';
import { base_adobe_url } from '@/AppConfig';

const ProfileModal = ({ isOpen, onClose }) => {
  const [userData, setUserData] = useState<any>(null);
  const [name, setName] = useState('');
  const [language, setLanguage] = useState('');
  const [cellNumber, setCellNumber] = useState('');
  const [address, setAddress] = useState('');
  const [dob, setDob] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [skill, setSkill] = useState<any>([]);
  const [selectedValue, setSelectedValue] = useState('');


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const config = {
          headers: { Authorization: `oauth ${token}` },
        };
        const response = await axios.get('https://learningmanager.adobe.com/primeapi/v2/user', config);
        setUserData(response.data?.data);
        setName(response.data?.data?.attributes?.name || '');
        setCellNumber(response.data?.data?.attributes?.fields?.["Cell Number"]|| '');
        setAddress(response.data?.data?.attributes?.fields?.Address || '');
        setDob(response.data?.data?.attributes?.fields?.DOB || '');
        setZipCode(response.data?.data?.attributes?.fields?.["Zip Code"] || '');

        const skills = await axios.get("https://learningmanager.adobe.com/primeapi/v2/skills?page[offset]=0&page[limit]=100&sort=name",config);
        setSkill(skills?.data?.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('An error occurred. Please try again later.'); // Update error state
      }
    };

    if (isOpen) {
      fetchUserData();
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {

      const skillUpdate = await axios.post(`https://learningmanager.adobe.com/primeapi/v2/users/${localStorage.getItem('userId')}/skillInterest/${selectedValue}?filter.skillInterestTypes=ADMIN_DEFINED`);
      console.log("****************", skillUpdate)

      const client_id = "449923a1-a01c-4bf5-b7c8-2137718d6d04";
      const client_secret = "b1b22c3e-900c-4bd1-b010-daf95c01b968";
      const refresh_token = "4022c902affc1b9527820308dfd0f56d";

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
      const config = {
        headers: { Authorization: `oauth ${tokenData.access_token}` },
      };
      const BodyData = {
        data: {
          id: `${userData?.id}`,
          type: `${userData?.type}`,
          attributes: {
            name: `${name}`,
            // bio: `${about}`,
            // contentLocale: localStorage.getItem("selectedLanguage"),
            // uiLocale: localStorage.getItem("selectedLanguage"),
            fields: {
              "Cell Number": `${cellNumber}`,
              Address: `${address}`,
              DOB: `${dob}`,
              "Zip Code": `${zipCode}`
          },
          }
        }
      };

      const BodyDataStatic = {
        data: {
          id: `${userData?.id}`,
          type: `${userData?.type}`,
          attributes: {
            contentLocale: localStorage.getItem("selectedLanguage"),
            uiLocale: localStorage.getItem("selectedLanguage"),
          }
        }
      };
      // const updatedUserData = {data:{ ...userData }};
      // updatedUserData.data.attributes.name = editedName;
      const urlUser = `https://learningmanager.adobe.com/primeapi/v2/users/${userData.id}`;

      console.log("22222", BodyData, url)
      const resultNonActive = await axios.patch(`${urlUser}`, BodyDataStatic, {
        headers: { Authorization: `oauth ${localStorage.getItem("access_token")}` },
      });
      const result = await axios.patch(`${urlUser}`, BodyData, config);

      console.log("checkReposnse", BodyDataStatic,resultNonActive);
      console.log("_____________________", urlUser, result.data)
      localStorage.setItem("selectedLanguage",result?.data?.data?.attributes?.uiLocale )
      setError(null);
      alert('Profile updated successfully!');
      onClose();
   
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Profile not updated!');
      setError('An error occurred. Please try again later.'); // Update error state
      setIsLoading(false);
    }
  };

  const handleSelectChange = (event) => {
    console.log(event.target.value)
    setSelectedValue(event.target.value);
  };
  console.log("NNNNNNNNNNNNNNNNNNNNNNNNNNN", skill);
  return (
    <div className={`modal-overlay ${isOpen ? 'open' : ''}`}>
      <div className="modal">
        <span className="close" onClick={onClose}>&times;</span>
        <h1 id='heading'>Edit Profile</h1>
        <form id="form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            </div>
            <div className="form-row">
            <div className="form-group">
              <label htmlFor="language">Language:</label>
              <LanguageDropdown/>
            </div>
          </div>
            <div className="form-row">
            <div className="form-group">
              <label htmlFor="role">Role:</label>
              {userData?.attributes?.roles.map((item, index) => (
        <span key={index}>
          {item}
          {/* Adding a comma after each item, except the last one */}
          {index !== userData?.attributes?.roles.length - 1 ? ', ' : ''}
        </span>
      ))}

            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="language">Skill Interest:</label>
              <select value={selectedValue} onChange={handleSelectChange}>
              <option value="">Select an option</option>
                {skill.length && skill?.map(ele =>{
                  return <option value={ele?.id}>{ele?.attributes?.name}</option>
                })}
            </select>
            </div>
          </div>
          <div className="button-container">
            <button type="submit" disabled={isLoading}>Save</button>
          </div>
          {error && <div className="error">{error}</div>}
        </form>
      </div>
    </div>
  );
};

export default ProfileModal;
