// @ts-nocheck
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './Header';
import LanguageDropdown from './LanguageDropdown';

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
  const [about, setAbout] = useState('');
  const [editedAvatarUrl, setEditedAvatarUrl] = useState('');
  const [editedEmail, setEditedEmail] = useState('');
  const [editedAddress, setAddress] = useState('');
  const [editedCellNumber, setEditedCellNumber] = useState('');
  const [editedDOB, setEditedDOB] = useState('');
  const [editedZipCode, setEditedZipCode] = useState('');

  //fields







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
        setAbout(response.data?.data.attributes.bio);
        setEditedEmail(response.data?.data.attributes.email);
        setAddress(response.data?.data.attributes?.fields.Address)
        setEditedCellNumber(response.data?.data.attributes?.fields["Cell Number"])
        setEditedDOB(response.data?.data.attributes?.fields.DOB)
        setEditedZipCode(response.data?.data.attributes?.fields["Zip Code"])


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
    setAbout(userData && userData.attributes && userData.attributes.bio);
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
            name: `${editedName}`,
            bio: `${about}`,
            email: `${editedEmail}`,
            Address: `${editedAddress}`,
            "Cell Number": `${editedCellNumber}`,
            DOB: `${editedDOB}`,
            "Zip Code": `${editedZipCode}`

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
  const showTooltip = (e) => {
    console.log(e);
  }
  // console.log("00000000000000000000000", userSkills)
  return (
    <>
      <div className='mb-5'>
        <Header isLogin={true} />
      </div>
      <h1 style={{ fontSize: "25px", width: "100%", marginLeft: "10rem", marginBottom: "1rem" }}>User Profile</h1>
      <div className="flex justify-center">
        <style>

        </style>
        <div className="border border-gray-300 rounded-lg overflow-hidden w-3/4 p-6" style={{ backgroundColor: "#fff" }}>
          <div className="flex overflow-hidden" style={{ border: "1px solid #e7e6e6", borderRadius: "8px", position: "relative" }}>

            <div className="mr-10 rounded-lg" style={{ width: "300px", backgroundColor: "#503fa6", color: "#fff", minHeight: "420px" }}>
              <div className='imgDiv rounded-full overflow-hidden' style={{
                position: "relative",
                width: "50%",
                textAlign: "center",
                margin: "20px auto 10px"
              }}>

                <img
                  src={isEditing ? editedAvatarUrl : (userData && userData.attributes && userData.attributes.avatarUrl)}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="field text-center">


                {isEditing ? (
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="text-xl font-semibold focus:outline-none text-center"
                    style={{ backgroundColor: "transparent" }}
                  />
                ) : (
                  <h2 className="text-xl font-semibold">{userData && userData.attributes && userData.attributes.name}</h2>
                )}

                <p style={{ padding: "2px 4px", display: "block" }}>{userData && userData.attributes && userData.attributes.profile}</p>

              </div>
            </div>
            <div style={{ width: "calc(100% - 320px)", paddingTop: "20px" }}>
              {isEditing ? (
                <div className="field">
                  <label style={{ minWidth: "124px", display: "inline-block" }}>Language: </label>
                  <LanguageDropdown />
                </div>
              ) : (
                <div className="field "><label style={{ minWidth: "130px", display: "inline-block" }}>Language: </label>
                  <p style={{ padding: "2px 4px", backgroundColor: "#fff", display: "inline-block" }}>{localStorage.getItem("selectedLanguage") === "en-US" ? "English" : "Français"}</p>
                </div>
              )}
              <div className="field ">
                <label style={{ minWidth: "126px", display: "inline-block" }}>Email: </label> <input type="email" name="Email" id="Email" value={editedEmail} disabled={!isEditing} onChange={(e) => setEditedEmail(e.target.value)} style={{ padding: "2px 4px", backgroundColor: "#fff", display: "inline-block" }} />
              </div>

              <div className="field"><label style={{ minWidth: "130px", display: "inline-block" }}>Address: </label><input type="text" name="Address" id="Address" value={editedAddress} disabled={!isEditing} onChange={(e) => setAddress(e.target.value)} style={{ padding: "2px 4px", backgroundColor: "#fff", display: "inline-block" }} />
              </div>

              <div className="field"><label style={{ minWidth: "126px", display: "inline-block" }}>CellNumber: </label> <input type="text" name="CellNumber" id="CellNumber" value={editedCellNumber} disabled={!isEditing} onChange={(e) => setEditedCellNumber(e.target.value)} style={{ padding: "2px 4px", backgroundColor: "#fff", display: "inline-block" }} /></div>
              <div className="field"><label style={{ minWidth: "127px", display: "inline-block" }}>DOB: </label> <input type="text" name="DOB" id="DOB" value={editedDOB} disabled={!isEditing} onChange={(e) => setEditedDOB(e.target.value)} style={{ padding: "2px 4px", backgroundColor: "#fff", display: "inline-block" }} /></div>
              <div className="field"><label style={{ minWidth: "130px", display: "inline-block" }}>ZipCode: </label><input type="text" name="ZipCode" id="ZipCode" value={editedZipCode} disabled={!isEditing} onChange={(e) => setEditedZipCode(e.target.value)} style={{ padding: "2px 4px", backgroundColor: "#fff", display: "inline-block" }} /></div>
              <div className="field mt-2 mb-4"><label style={{ minWidth: "135px", display: "inline-block" }}>Description: </label>
                <textarea value={about} onChange={(e) => setAbout(e.target.value)} style={{ border: "none", padding: "0", margin: "", display: "inline-block", verticalAlign: "top", backgroundColor: "#fff", width: "calc(100% - 145px)" }} name="" id="about_bio" disabled={!isEditing} rows={"4"}></textarea>
              </div>
              {isEditing && (
                <div>
                  <button onClick={handleSave} className="px-4 py-2 bg-blue-500 text-white rounded-md mr-2" style={{ backgroundColor: "#005686" }}>Save</button>
                  <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-gray-500 text-white rounded-md">Cancel</button>
                </div>
              )}
            </div>
            {!isEditing && (
              <button onClick={handleEdit} className="ml-auto px-4 py-2 text-white rounded-md" style={{
                backgroundColor: "#005686", position: "absolute",
                right: "15px",
                top: "15px"
              }}>Edit</button>
            )}
          </div>

          <div className="flex justify-between mt-6">
            <div className="w-1/2 p-6" style={{ border: "1px solid #e7e6e6", borderRadius: "8px", marginRight: "10px" }}>
              <h3 className="text-lg font-semibold mb-4">Skills</h3>
              <ul style={{ listStyle: "disc", padding: "0 0 0 15px", lineHeight: "28px" }}>
                {userSkills.map((skill) => (
                  <li key={skill.id}>{skill.attributes.name}</li>
                ))}
              </ul>
            </div>
            <div className="w-1/2 p-6" style={{ border: "1px solid #e7e6e6", borderRadius: "8px", marginLeft: "10px" }}>
              <h3 className="text-lg font-semibold mb-4">Badges</h3>
              <div className="flex flex-wrap">
                {userBadges.map((badge) => (
                  <div key={badge.id} className="mb-4  ml-auto" style={{ width: "100px", position: "relative" }}>
                    <a href="https://in.linkedin.com" target='_blank' className="href" title='Share on Lnked In' >
                      
                      <img src={badge.attributes.imageUrl} alt="Badge" className="w-full h-auto" />
                    </a>
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
