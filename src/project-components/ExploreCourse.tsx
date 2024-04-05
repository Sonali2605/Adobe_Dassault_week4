import { useEffect, useState } from 'react';
import axios from 'axios';
import {useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
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
interface CourseExploreProps {
  isCustomer: boolean;
  isRecomdation: boolean; // Define the type for isRecomdation
}

const CourseExplore: React.FC<CourseExploreProps> = ({ isCustomer, isRecomdation }) => {
  const [courseData, setCourseData] = useState<Course[]>([]);
  const navigate = useNavigate();

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
        `https://learningmanager.adobe.com/primeapi/v2/learningObjects?page[limit]=20&filter.catalogIds=174313&sort=name&filter.learnerState=notenrolled&filter.ignoreEnhancedLP=true`,
        config
      );
      const result = response?.data?.data;
      setCourseData(result);
    } catch (error) {
      console.error("Error fetching learning objects:", error);
    }
  }

  const customStyles = `
    .course-carousel-container {
      max-width: 100%;
      overflow-x: hidden;
      width: 100%;
    }

    .course-carousel {
      display: flex;
      justify-content: flex-start;
      overflow-x: auto;
      scrollbar-width: none; /* Firefox */
      -ms-overflow-style: none; /* Internet Explorer 10+ */
    }

    .course-carousel::-webkit-scrollbar {
      display: none; /* WebKit */
    }

    .course-card {
      width:  calc(20% + 25px); /* Adjust spacing between cards as needed */
      margin-right: 20px;
      flex-shrink: 0;
      position: relative;
    }

    .course-image {
      width: 100%;
      height: 200px;
      object-fit: cover;
      border-radius: 8px;
    }

    .course-details {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      padding: 10px;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
      text-align: center;
      background-color:rgba(0,0,0,0.7);
    }

    .course-title {
      font-size: 16px;
      font-weight: bold;
      color: #fff;
    }

    .enroll-link {
      position: absolute;
      bottom: 10px;
      left: 50%;
      transform: translateX(-50%);
      background-color: #005686;
      color: #fff;
      text-decoration: none;
      font-size: 16px;
      border: 1px solid #005686;
      padding: 5px 10px;
      border-radius: 4px;
    }

    .enroll-link:hover {
      background-color: #0056b3;
      color: #fff;
    }
  `;

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
          navigate(`/learning_object/${cid}/instance/${Iid}/isDashboard=true/isCustomer=${isCustomer}/login=false/detailspage`);
        }
    } catch (error) {
        console.log(error)
    }
   
  } 
  const scrollLeft = () => {
    const carousel = document.querySelector('.customerExplore .course-carousel');
    carousel?.scrollBy({
      left: -300, // Adjust this value to control the scroll distance
      behavior: 'smooth',
    });
  };

  const scrollRight = () => {
    const carousel = document.querySelector('.customerExplore .course-carousel');
    carousel?.scrollBy({
      left: 300, // Adjust this value to control the scroll distance
      behavior: 'smooth',
    });
  };

  // const handleGoToExplore=()=>{
  //   navigate('/allCourses')
  // }
  return (
    <div>
      {isCustomer? 
      <>
       <h2 className="text-2xl text-white font-bold mt-10 mb-8 text-left">Recommended by Timbus</h2> 
       <div className="scroll-arrows" style={{marginTop: "-57px",marginLeft: "280px", textAlign:"left", color:"white"}}>
          <FontAwesomeIcon icon={faChevronLeft} onClick={scrollLeft} />
          <FontAwesomeIcon icon={faChevronRight} onClick={scrollRight} />
        </div>
      </>
       :
       <>
       <div>
      {isRecomdation ?
      <>
        <h2 className="text-lg font-bold mb-4">Recommendation for you</h2>
      <div className="scroll-arrows" style={{marginTop: "-40px",marginLeft: "200px"}}>
          <FontAwesomeIcon icon={faChevronLeft} onClick={scrollLeft} />
          <FontAwesomeIcon icon={faChevronRight} onClick={scrollRight} />
        </div>
      </>
      
      :
      <>
      <h2 className="text-lg font-bold mb-4">Courses to Explore</h2>
      <div className="scroll-arrows" style={{marginTop: "-40px",marginLeft: "175px"}}>
          <FontAwesomeIcon icon={faChevronLeft} onClick={scrollLeft} />
          <FontAwesomeIcon icon={faChevronRight} onClick={scrollRight} />
        </div>
      </>
      
    }
        
        <div  className="text-blue-500" style={{ float: 'right', marginTop: '-20px' }}>
        {/* <button onClick={handleGoToExplore}>Go To Explore page</button> */}
      </div>
      </div>
       </>
      }
      <style>{customStyles}</style>
      <div className="course-carousel-container customerExplore mt-4">
        <div className="course-carousel">
          {courseData.map((course, index) => (
            <div key={index} className="course-card">
              <img
                className="course-image"
                src={course?.attributes?.imageUrl}
                alt={course?.attributes?.localizedMetadata?.[0]?.name || ''}
              />
              <div className="myCustomCard">
                <div className="course-details">
                  <h2 className="course-title">{course?.attributes?.localizedMetadata?.[0]?.name}</h2>
                </div>
                <button className="enroll-link" onClick={()=>EnrollHandle(course?.id)}>ENROLL</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseExplore;
