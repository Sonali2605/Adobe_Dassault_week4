import { useEffect, useState } from 'react';
import {useNavigate } from "react-router-dom";
import axios from 'axios';

interface Course {
  id: string; // Assuming 'id' is a required property in your data
  attributes: {
    imageUrl: string;
    localizedMetadata?: {
      name: string;
    }[];
  };
  state?: string; // Define 'state' as an optional property
}

const Leaderboard = () => {
  const [courseData, setCourseData] = useState<Course[]>([]);
  const navigate = useNavigate();

  // Dummy data for network members with existing user images
  const networkMembers = [
    { name: "88 points", imageUrl: "https://randomuser.me/api/portraits/men/1.jpg" },
    { name: "87 points", imageUrl: "https://randomuser.me/api/portraits/women/2.jpg" },
    { name: "93 points", imageUrl: "https://randomuser.me/api/portraits/men/3.jpg" },
    { name: "95 points", imageUrl: "https://randomuser.me/api/portraits/women/4.jpg" },
    { name: "105 points", imageUrl: "https://randomuser.me/api/portraits/men/5.jpg" },
    { name: "88 points", imageUrl: "https://randomuser.me/api/portraits/women/6.jpg" },
    { name: "88 points", imageUrl: "https://randomuser.me/api/portraits/men/7.jpg" },
    { name: "88 points", imageUrl: "https://randomuser.me/api/portraits/women/8.jpg" },
    { name: "88 points", imageUrl: "https://randomuser.me/api/portraits/men/9.jpg" },
    { name: "88 points", imageUrl: "https://randomuser.me/api/portraits/women/10.jpg" },
    { name: "88 points", imageUrl: "https://randomuser.me/api/portraits/women/11.jpg" },
    { name: "88 points", imageUrl: "https://randomuser.me/api/portraits/men/12.jpg" }
  ];

  // Dummy data for courses taken by peers
  // const courses = [
  //   { name: "React Fundamentals", imageUrl: "./images/Peers/img1.png" },
  //   { name: "JavaScript Basics", imageUrl: "./images/Peers/img2.png" },
  //   { name: "HTML5 Essentials", imageUrl: "./images/Peers/img3.png" },
  //   { name: "CSS Styling", imageUrl: "./images/Peers/img4.png" },
  //   { name: "Web Design", imageUrl: "./images/Peers/img5.png" }
  // ];

  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    getCoursestoExplore();
  }, []);

  async function getCoursestoExplore() {
    try {
      const token = localStorage.getItem("access_token");
      const config = {
        headers: { Authorization: `oauth ${token}` },
      };
      const response = await axios.get(
        `https://learningmanager.adobe.com/primeapi/v2/learningObjects?page[limit]=20&filter.catalogIds=174772&sort=name&filter.ignoreEnhancedLP=true`,
        config
      );
      const result = response?.data?.data;
      setCourseData(result);
    } catch (error) {
      console.error("Error fetching learning objects:", error);
    }
  }

  const  EnrollHandle = async(cid:string) =>{
    const course = (courseData as any).find(obj => obj?.id === cid);
     const Iid =  course.relationships?.instances?.data?.[0].id;
     
     console.log("nnnnnnn", course, Iid)
     const token = localStorage.getItem("access_token")
     try {
        //  const response = await fetch('https://learningmanager.adobe.com/primeapi/v2/enrollments?loId=' + cid + '&loInstanceId=' + encodeURIComponent(Iid), {
        //      method: 'POST',
        //      headers: {
        //          'Content-Type': 'application/json',
        //          'Authorization': `Bearer ${token}`
        //      },
        //  });
 
        //  if (!response.ok) {
        //      navigate('/')
        //      throw new Error('Failed to enroll');
        //  } else {
           navigate(`/learning_object/${cid}/instance/${Iid}/isDashboard=true/isCustomer=false/login=false/detailspage`);
        //  }
     } catch (error) {
         console.log(error)
     }
    
   }
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="mx-auto bg-white overflow-hidden shadow-lg p-4 pt-4 mt-4 rounded-md">
      <h2 className="text-md font-bold mb-2">Leaderboard</h2>
      <div className="grid grid-cols-5 gap-4">
        {networkMembers.slice(0, 5).map((member, index) => (
          <div key={index} className="flex flex-col items-center" style={{maxWidth:"50%"}}>
            <div className="relative rounded-full overflow-hidden w-12 h-12">
              <img
                className="object-cover w-full h-full"
                src={member.imageUrl}
                alt={member.name}
              />
              {index < 4 && <div className="absolute top-0 left-0 right-0 bottom-0 border border-gray-300 rounded-full"></div>}
            </div>
            <div className="mt-1">
              <h2 className="text-xs">{member.name}</h2>
            </div>
          </div>
        ))}
      </div>
      {!expanded && 
      <div className="text-center mt-8 mb-4">
        <button
          className="border border-blue-500 hover:border-blue-700 text-blue-500 text-sm py-2 px-2 rounded"
          onClick={toggleExpanded}
        >
         VIEW COURSES TAKEN BY YOUR PEERS
        </button>
      </div>
    }
      {expanded && (
        <div className="mt-4">
          <h2 className="text-md font-bold mt-10 mb-8">Courses Taken By Your Peers</h2>
          <div className="grid grid-cols-4 gap-4" style={{rowGap:'30px'}}>
          {courseData.map((course, index) => (
              <div key={index} className="max-w-xs bg-white overflow-hidden shadow-lg rounded-lg px-4">
                <img
                  className="w-full h-40 object-cover mb-4 rounded-t-lg"
                  src={course?.attributes?.imageUrl}
                  alt={course?.attributes?.localizedMetadata?.[0]?.name || ''}
                />
                <div className="px-3">
                  <div className="text-sm mb-2 text-center">{course?.attributes?.localizedMetadata?.[0]?.name}</div>
                  <button className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded w-full text-sm mb-3 capitalize" onClick={()=>EnrollHandle(course?.id)}>
                    EXPLORE
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <button
              className="text-blue-500 font-bold"
              onClick={toggleExpanded}
            >
              Show Less
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
