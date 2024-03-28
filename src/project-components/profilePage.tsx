// @ts-nocheck
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './Header';

interface UserData {
  data?: {
    id?: string;
    attributes?: {
      profile: string;
      name: string;
      avatarUrl?: string;
    };
  };
}
interface skills {
  data?: {
    id?: string;
    attributes?: {
      name?: string;
      avatarUrl?: string;
    };
  };
}
const ProfilePage = () => {
  const [userData, setUserData] = useState<UserData>();
  const [userSkills, setUserSkills] = useState<skills>([]);
  const [userBadges, setUserBadges] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedAvatarUrl, setEditedAvatarUrl] = useState('');

  useEffect(() => {
    // Fetch user data
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const config = {
          headers: { Authorization: `oauth ${token}` },
        };
        const response = await axios.get('https://learningmanager.adobe.com/primeapi/v2/user', config);
        setUserData(response.data?.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    // Fetch user skills
    const fetchUserSkills = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const config = {
          headers: { Authorization: `oauth ${token}` },
        };
        const response = await axios.get(`https://learningmanager.adobe.com/primeapi/v2/users/${userData?.id}/userSkills?include=skill&page[offset]=0&page[limit]=10&restrictPageLimitIncludes=false&sort=dateAchieved`, config);

        const result = response?.data?.included;
        setUserSkills(result);
      } catch (error) {
        console.error('Error fetching user skills:', error);
      }
    };

    // Fetch user badges
    const fetchUserBadges = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const config = {
          headers: { Authorization: `oauth ${token}` },
        };
        const response = await axios.get(`
        https://learningmanager.adobe.com/primeapi/v2/badges?page[offset]=0&page[limit]=10&sort=name`, config);
        setUserBadges(response.data?.data);
      } catch (error) {
        console.error('Error fetching user badges:', error);
      }
    };

    if (!userData) {
      fetchUserData();
    } else {
      fetchUserSkills();
      fetchUserBadges();
    }
  }, [userData]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedName(userData && userData.attributes && userData.attributes.name);
    setEditedAvatarUrl(userData && userData.attributes && userData.attributes.avatarUrl);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const config = {
        headers: { Authorization: `oauth ${token}` },
      };
      const BodyData = {
        data: {
          id: `${userData?.id}`,
          type: `${userData?.type}`,
          attributes: {
            name: `${editedName}`
          }
        }
      };
      // const updatedUserData = {data:{ ...userData }};
      // updatedUserData.data.attributes.name = editedName;
      const url = `https://learningmanager.adobe.com/primeapi/v2/users/${userData.id}`;

      console.log("22222", BodyData, url)
      const result = await axios.patch(`${url}`, BodyData, config);
      console.log("_____________________", url, result.data)
      setIsEditing(false);
      // Refresh page to reflect changes
      window.location.reload();
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  console.log("00000000000000000000000", userSkills)
  return (
    <>
      <div className='mb-5'>
        <Header isLogin={true} />
      </div>
      <h1 style={{ fontSize: "25px", width: "100%", marginLeft: "10rem", marginBottom: "1rem"}}>User Profile</h1>
      <div className="flex justify-center">

        <div className="border border-gray-300 rounded-lg overflow-hidden w-3/4 p-6" style={{ backgroundColor: "#fff" }}>
          <div className="flex items-center">

            <div className="rounded-full overflow-hidden mr-4" style={{width:"200px"}}>
              <img
                src={isEditing ? editedAvatarUrl : (userData && userData.attributes && userData.attributes.avatarUrl)}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              {isEditing ? (
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="text-xl font-semibold focus:outline-none"
                />
              ) : (
                <h2 className="text-xl font-semibold">{userData && userData.attributes && userData.attributes.name}</h2>
              )}
              <p>{userData && userData.attributes && userData.attributes.profile}</p>
              {isEditing && (
                <div>
                  <button onClick={handleSave} className="px-4 py-2 bg-blue-500 text-white rounded-md mr-2"  style={{backgroundColor:"#005686"}}>Save</button>
                  <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-gray-500 text-white rounded-md">Cancel</button>
                </div>
              )}
            </div>
            {!isEditing && (
              <button onClick={handleEdit} className="ml-auto px-4 py-2 text-white rounded-md" style={{backgroundColor:"#005686"}}>Edit</button>
            )}
          </div>
          <div className="flex justify-between mt-6">
            <div className="w-1/2 p-6" style={{border: "1px solid #e7e6e6",borderRadius: "8px", marginRight:"10px"}}>
              <h3 className="text-lg font-semibold mb-4">Skills</h3>
              <ul style={{    listStyle: "disc",    padding: "0 0 0 15px",    lineHeight: "28px"}}>
                {userSkills.map((skill) => (
                  <li key={skill.id}>{skill.attributes.name}</li>
                ))}
              </ul>
            </div>
            <div className="w-1/2 p-6" style={{border: "1px solid #e7e6e6",borderRadius: "8px", marginLeft:"10px"}}>
              <h3 className="text-lg font-semibold mb-4">Badges</h3>
              <div className="flex flex-wrap">
                {userBadges.map((badge) => (
                  <div key={badge.id} className="mb-4  ml-auto" style={{width:"100px"}}>
                    <img src={badge.attributes.imageUrl} alt="Badge" className="w-full h-auto" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
