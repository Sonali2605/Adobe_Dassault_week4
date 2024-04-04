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


const MyLearning = ({ isCustomer }: { isCustomer: boolean }) => {
  const [courseData, setCourseData] = useState<Course[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    getMyLearningData();
  }, []);

  async function getMyLearningData() {
    try {
      const token = localStorage.getItem("access_token");
      const config = {
        headers: { Authorization: `oauth ${token}` },
      };
      let limit;
      if (isCustomer){
        limit = 10
      } else {
        limit = 10
      }
      const response = await axios.get(
        `https://learningmanager.adobe.com/primeapi/v2/learningObjects?include=enrollment&page[limit]=${limit}&filter.catalogIds=174313&sort=name&filter.learnerState=enrolled&filter.learnerState=started&filter.learnerState=completed&filter.ignoreEnhancedLP=true`,
        config
      );
      const result = response?.data?.data;
      for (const item of result) {
        const enrollment = item.relationships?.enrollment?.data;
        let state = null;
      
        if (enrollment) {
          const enrollmentId = enrollment.id;
          const includedItem = response?.data?.included.find(included => included.id === enrollmentId);
          state = includedItem?.attributes?.state || null;
        }
      
        item.state = state;
      }
      setCourseData(result);
    } catch (error) {
      console.error("Error fetching learning objects:", error);
    }
  }

  const customStyles = `
    .course-carousel-container {
      max-width: 100%;
      overflow-x: hidden;
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
      width: calc(20% + 25px); /* Adjust spacing between cards as needed */
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
    }

    .course-title {
      font-size: 18px;
      font-weight: bold;
      color: #fff;
    }

    .enroll-link {
      position: absolute;
      bottom: 10px;
      left: 50%;
      transform: translateX(-50%);
      background-color: #007bff;
      color: #fff;
      text-decoration: none;
      font-size: 16px;
      border: 1px solid #007bff;
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
    
    try {
          navigate(`/learning_object/${cid}/instance/${Iid}/isDashboard=true/isCustomer=${isCustomer}/login=false/detailspage`);
        
    } catch (error) {
      console.log("error")
    }
   
  }

  const scrollLeft = () => {
    const carousel = document.querySelector('.learning .course-carousel');
    carousel?.scrollBy({
      left: -300, // Adjust this value to control the scroll distance
      behavior: 'smooth',
    });
  };

  const scrollRight = () => {
    const carousel = document.querySelector('.learning .course-carousel');
    carousel?.scrollBy({
      left: 300, // Adjust this value to control the scroll distance
      behavior: 'smooth',
    });
  };
  console.log(courseData)

  const handleGoToExplore=()=>{
    navigate('/myLearnings')
  }
  return (
    <div>
      {isCustomer ?
      <>
      <h2 className="font-bold text-left" style={{marginBottom:"18px", fontSize: '1.5rem'}}>My Learning List</h2>
      <div className="scroll-arrows" style={{marginTop: "-46px",marginLeft: "-446px"}}>
          <FontAwesomeIcon icon={faChevronLeft} onClick={scrollLeft} />
          <FontAwesomeIcon icon={faChevronRight} onClick={scrollRight} />
        </div>
      </>
      :
      <>
      <h2 className="text-lg font-bold mb-4" >My Learning</h2>
      <div className="scroll-arrows" style={{marginTop: "-40px",marginLeft: "108px"}}>
          <FontAwesomeIcon icon={faChevronLeft} onClick={scrollLeft} />
          <FontAwesomeIcon icon={faChevronRight} onClick={scrollRight} />
      </div>
      <div  className="text-blue-500" style={{ float: 'right', marginTop: '-20px' }}>
        <button onClick={handleGoToExplore}>Go To My Learning</button>
      </div>
      </>
      }
      <style>{customStyles}</style>
      <div className="course-carousel-container learning pt-4" >
        <div className="course-carousel">
          {courseData.map((course, index) => (
            <div key={index} className="course-card">
              <img
                className="course-image"
                src={course?.attributes?.imageUrl}
                alt={course?.attributes?.localizedMetadata?.[0]?.name || ''}
              />
              <div className="course-details">
                <h2 className="course-title">{course?.attributes?.localizedMetadata?.[0]?.name}</h2>
              </div>
              <button className="enroll-link" onClick={()=>EnrollHandle(course?.id)}>{course?.state}</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyLearning;
