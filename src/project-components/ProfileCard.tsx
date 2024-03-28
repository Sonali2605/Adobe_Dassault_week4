import React from "react";
import { Link } from "react-router-dom";

interface ProfileCardProps {
  name: string; // Define the type of name prop
}
const ProfileCard: React.FC<ProfileCardProps> = ({ name }) => {
  return (
    <Link to="/profile">
      <div className="max-w-xs mx-auto bg-white overflow-hidden shadow-lg p-4">
        <div className="text-center">
          <img
            className="w-20 h-20 rounded-full mx-auto"
            src="./images/maryJaneStewart.png"
            alt="Profile"
          />
          <div className="mt-2">
            <h2 className="text-lg font-semibold">{`Welcome,`}</h2>
            <p className="text-gray-600">{name}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProfileCard;
