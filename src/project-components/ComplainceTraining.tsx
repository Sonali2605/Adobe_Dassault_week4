import { useState } from "react";
import ".././styles/common.css";
import CoursePlayer from "./CoursePlayer";
import { useLocation } from "react-router-dom";

const ComplianceTraining = () => {
  const location = useLocation();
  const currentUrl = location.pathname;
  const [showCoursePlayer, setShowCoursePlayer] = useState(false);

  // Define products and getColor function
  const products = [
    { name: "Third Party Risk Management", dueDate: "Due Date: 29th April 2024" },
    { name: "Anti Money Laundering Solution", dueDate: "Due Date: 5th May 2024" },
    { name: "Anti Money Laundering Solution", dueDate: "Due Date: 16th May 2024" }
  ];

  const getColor = (index: number) => {
    if (index === 0) {
      return 'text-red-500'; // Red color for index 0
    } else if (index === 1) {
      return 'text-yellow-500'; // Yellow color for index 1
    } else {
      return 'text-green-500'; // Green color for index 2 and beyond
    }
  };

  // Function to handle the click event of the "START" button
  const handleStartCourse = () => {
    setShowCoursePlayer(true); // Set showCoursePlayer state to true to display the CoursePlayer
  };

  
  return (
    <div className="max-w-xs mx-auto bg-white overflow-hidden shadow-lg p-4 rounded-md">
      <h2 className="text-md font-bold mb-4">Pending Compliance Training</h2>
      {products.map((product, index) => (
        <div key={index} className="flex justify-between items-center border-b pb-2">
          <div className="flex items-center">
            <div className="px-3 py-2">
              <div className={`text-sm mb-1`}>{product.name}</div>
              <p className={`text-gray-700 text-xs ${getColor(index)}`}>{product.dueDate}</p>
            </div>
          </div>
          <button className="adobe-font bg-blue-500 hover:bg-blue-700 text-white py-1 px-6 rounded" onClick={handleStartCourse}>
            START
          </button>
        </div>
      ))}
      {showCoursePlayer && (
        <CoursePlayer
          cid="course:9180283"
          mid=""
          goBackUrl={currentUrl}
        />
      )}
    </div>
  );
};

export default ComplianceTraining;
