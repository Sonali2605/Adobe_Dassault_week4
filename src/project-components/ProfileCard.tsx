// @ts-nocheck
import  { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

interface UserData {
  id: string;
  attributes: {
    firstName: string;
    lastName: string;
    avatarUrl: string,
    name: string
    // Add any other necessary user data properties here
  };
}

interface ProfileCardProps {
  name: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ name }) => {
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

  return (
    <Link to="/profile">
      <div className="max-w-xs mx-auto bg-white overflow-hidden shadow-lg p-4">
        <div className="text-center">
          <img
            className="w-20 h-20 rounded-full mx-auto"
            src={userData?.attributes?.avatarUrl}
            alt="Profile"
          />
          <div className="mt-2">
            <h2 className="text-lg font-semibold">{`Welcome,`}</h2>
            <p className="text-gray-600">{userData?.attributes?.name}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProfileCard;
