// @ts-nocheck

import { useEffect, useState, useMemo } from 'react';
import Header from './Header';
import axios from 'axios';
import CourseExplore from './ExploreCourse';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import ".././styles/common.css";
import MyLearning from './MyLearning';
import {useNavigate } from "react-router-dom";
import CalendarCourse from "./CalenderCourse";
interface Certificate {
  imageUrl: string;
  name: string;
  description: string;
}

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

const DashboardCustomer = () => {
  const [, setCertificate] = useState<Certificate | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [courseData, setCourseData] = useState<Course[]>([]);
  const navigate = useNavigate();
  const currentDate = new Date();

  const formattedCurrentDate = currentDate.toISOString().split('T')[0]; // Format date as "YYYY-MM-DD"

  // const courses = [
  //   { name: "React Fundamentals 1", imageUrl: "./images/Peers/img1.png" },
  //   { name: "JavaScript Basics", imageUrl: "./images/Peers/img2.png" },
  //   { name: "HTML5 Essentials", imageUrl: "./images/Peers/img3.png" },
  //   { name: "CSS Styling", imageUrl: "./images/Peers/img4.png" },
  //   { name: "Web Design", imageUrl: "./images/Peers/img5.png" }
  // ];
  const [dotDates,] = useState([
    "2024-03-25",
    "2024-03-11",
    "2024-03-24",
    formattedCurrentDate
  ]);

  // Assuming you have course data available
  const courseDataCalender = {
    "2024-03-25": { title: "Achieving Peak Performance in Insurance Sale", description: "Check out this webinar to see how peak performers at Premier Protect read body language and keywords to pursue their customers." },
    "2024-03-11": { title: "Negotiation Techniques for Closing More Deals", description: "Learn how to effectively negotiate with clients and close more deals with confidence." },
    "2024-03-24": { title: "Building Rapport and Trust with Clients", description: "Discover strategies for building rapport and trust with your clients to create long-term relationships." },
    [formattedCurrentDate]: { title: "Building Rapport and Trust with Clients 1", description: "Discover strategies for building rapport and trust with your clients to create long-term relationships." },
  };
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const fetchData = async () => {
      try {
        const response = await axios.get(
          'https://learningmanager.adobe.com/primeapi/v2/learningObjects?include=subLOs&page[limit]=1&filter.loTypes=certification&sort=-date&filter.ignoreEnhancedLP=true',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const certificateData = response.data?.data?.[0];
        if (certificateData) {
          const certificateName = certificateData.attributes.localizedMetadata.find(
            (metadata: { name: string }) => metadata.name === 'Consultative Selling'
          );

          if (certificateName) {
            const imageUrl = certificateData.attributes.imageUrl;
            const name = certificateName.name;
            const description = certificateName.description;

            setCertificate({ imageUrl, name, description });
          }
        }
      } catch (error) {
        console.error('Error fetching certificate:', error);
      }
    };

    fetchData();
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
         const response = await fetch('https://learningmanager.adobe.com/primeapi/v2/enrollments?loId=' + cid + '&loInstanceId=' + encodeURIComponent(Iid), {
             method: 'POST',
             headers: {
                 'Content-Type': 'application/json',
                 'Authorization': `Bearer ${token}`
             },
         });
 
         if (!response.ok) {
             navigate('/')
             throw new Error('Failed to enroll');
         } else {
           navigate(`/learning_object/${cid}/instance/${Iid}/isDashboard=true/isCustomer=true/detailspage`);
         }
     } catch (error) {
         console.log(error)
     }
    
   }
   const isDottedDate = useMemo(() => {
    const formattedDates = dotDates.map(date => new Date(date).toDateString()); // Convert to Date object and extract only date portion
    return date => formattedDates.includes(date.toDateString());
  }, [dotDates]);
  

   const tileClassName = ({ date }) => {
    if (isDottedDate(date)) {
      return "calendar-dot";
    }
    return "";
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

   const getSelectedCourse = () => {
    if (!selectedDate) return null;
  
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0'); // Add leading zero for single-digit months
    const day = String(selectedDate.getDate()).padStart(2, '0'); // Add leading zero for single-digit days
  
    const formattedDate = `${year}-${month}-${day}`;
  
    return courseDataCalender[formattedDate];
  };

  return (
    <>
      <Header isLogin={false} />
      <div className="mt-5 justify-center text-center">
        <div className="flex mt-4">
          {/* <div style={{width:"60%"}}>
              <Network/>
            </div> */}
          <div>
            <div className='heroSection'>
                <div className="userDetails">
                  <img
                    className="userAvatar"
                    src="./images/maryJaneStewart.png"
                    alt="Profile"
                  />
                  <div>
                    <h1 className="adobe-font">Welcome, <br />Olivia Clarke</h1>
                    <div className='text-white d-flex align-items-center mt-3'>
                      <img src="/images/level.png" alt="Level" className='w-10 h-15' />
                      <div>
                        <p>Level 1</p>
                        <p className='font-bold'>Starter</p>
                      </div>
                    </div>
                  </div>
                </div>
              
              <div>
                <MyLearning isCustomer={true} />
              </div>
              
            </div>
            <div style={{display: 'flex', padding: '10px 30px 20px 30px'}}>
              {/*<div style={{ width: '30%', marginTop: '0px', padding: '15px' }} className="shadowBox">
                <Calendar
                  onChange={handleDateChange as any} // Explicitly cast to any to avoid TypeScript error
                  value={selectedDate}
                  calendarType="US"
                  locale="en-US"
                />
          </div>*/}
          <div className="mt-4 mb-10" style={{ display: "flex" }}>
              <div style={{minWidth: '20rem', width: "40%", marginRight: "10px" }}>
                {selectedDate && (
              <CalendarCourse
                selectedDate={selectedDate}
                selectedCourse={getSelectedCourse()}
              />
            )}
              </div>
              <div style={{ width: '50%', marginTop: '7.6%', padding: '15px' }}>
              <Calendar
              onChange={handleDateChange}
              value={selectedDate}
              calendarType="US"
              locale="en-US"
              // Add custom tileClassName prop to apply styles based on isDottedDate
              tileClassName={tileClassName}            
              />
        </div>
            </div>
            </div>
            <div className='mt-4 bg-[#1a4789] py-6 recommended-course'>
              <CourseExplore isCustomer={true} />
              <div className="mt-4">
               
                <h2 className="text-2xl text-white font-bold mt-10 mb-8 text-left">Courses Taken By Your Peers</h2>
               
                <div className="cardView">
                {courseData.map((course, index) => (
                    <div key={index} className="max-w-xs overflow-hidden rounded-lg customCard">
                      <img
                        className="w-full h-40 object-cover mb-4 rounded-t-lg"
                        src={course?.attributes?.imageUrl}
                        alt={course?.attributes?.localizedMetadata?.[0]?.name || ''}
                      />
                      <div className="px-3">
                        <h2 className="text-center">{course?.attributes?.localizedMetadata?.[0]?.name}</h2>
                        <button className="bg-blue-500 hover:bg-blue-700 text-white p-2 rounded w-full text-md mb-3" onClick={()=>EnrollHandle(course?.id)}>
                            EXPLORE
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default DashboardCustomer;
