// @ts-nocheck
import  { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header';
import CourseCard from './CourseCard'; // Create a CourseCard component to represent each course
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { clientId, clientSecreat, refreshToken, base_adobe_url } from "../AppConfig"

interface Course {
  id: string;
  attributes: {
    imageUrl: string;
    localizedMetadata?: {
      name: string;
      description: string; // Add description property
    }[];
  };
  state?: string;
}


const AllCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const login = searchParams.get("login") || false;
  const [selectedFilter, setSelectedFilter] = useState('');
  console.log("login",login)

  function Sidebar({ handleFilterChange }) {
    return (
      <div style={{ float: 'left', marginRight: '20px' }}>
        <h2  className='font-bold mb-8'>Filter</h2>
        <div className = "my-8" style={{borderBottom: "1px solid rgb(204, 204, 204)"}}></div>
    
        {/* Type */}
        <h3 style={{ color: 'blue' }}>Type</h3>
        <label style={{ display: 'flex', alignItems: 'center' }}>
          <input type="checkbox" onChange={() => handleFilterChange('Courses')} />
          <span style={{ marginLeft: '5px' }}>Courses</span>
        </label>
        <label style={{ display: 'flex', alignItems: 'center' }}>
          <input type="checkbox" onChange={() => handleFilterChange('Learning Paths')} />
          <span style={{ marginLeft: '5px' }}>Learning Paths</span>
        </label>
        <label style={{ display: 'flex', alignItems: 'center' }}>
          <input type="checkbox" onChange={() => handleFilterChange('Learning Paths')} />
          <span style={{ marginLeft: '5px' }}>Learning Paths</span>
        </label>
        <label style={{ display: 'flex', alignItems: 'center' }}>
          <input type="checkbox" onChange={() => handleFilterChange('Learning Paths')} />
          <span style={{ marginLeft: '5px' }}>Job Aids</span>
        </label>
        <div className = "my-8" style={{borderBottom: "1px solid rgb(204, 204, 204)"}}></div>

        <h3 style={{ color: 'blue' }}>Format</h3>
        <label style={{ display: 'flex', alignItems: 'center' }}>
          <input type="checkbox" onChange={() => handleFilterChange('Activity')} />
          <span style={{ marginLeft: '5px' }}>Activity</span>
        </label>
        <label style={{ display: 'flex', alignItems: 'center' }}>
          <input type="checkbox" onChange={() => handleFilterChange('Blended')} />
          <span style={{ marginLeft: '5px' }}>Blended</span>
        </label>
        <label style={{ display: 'flex', alignItems: 'center' }}>
          <input type="checkbox" onChange={() => handleFilterChange('Blended')} />
          <span style={{ marginLeft: '5px' }}>Classroom</span>
        </label>
        <label style={{ display: 'flex', alignItems: 'center' }}>
          <input type="checkbox" onChange={() => handleFilterChange('Blended')} />
          <span style={{ marginLeft: '5px' }}>Self Paced</span>
        </label>
        <label style={{ display: 'flex', alignItems: 'center' }}>
          <input type="checkbox" onChange={() => handleFilterChange('Blended')} />
          <span style={{ marginLeft: '5px' }}>Virtual Classroom</span>
        </label>
        <div className = "my-8" style={{borderBottom: "1px solid rgb(204, 204, 204)"}}></div>

        <h3 style={{ color: 'blue' }}>Duration</h3>
        <label style={{ display: 'flex', alignItems: 'center' }}>
          <input type="checkbox" onChange={() => handleFilterChange('30 mins or less')} />
          <span style={{ marginLeft: '5px' }}>30 mins or less</span>
        </label>
        <label style={{ display: 'flex', alignItems: 'center' }}>
          <input type="checkbox" onChange={() => handleFilterChange('31 mins to 2 hours')} />
          <span style={{ marginLeft: '5px' }}>31 mins to 2 hours</span>
        </label>
        <label style={{ display: 'flex', alignItems: 'center' }}>
          <input type="checkbox" onChange={() => handleFilterChange('31 mins to 2 hours')} />
          <span style={{ marginLeft: '5px' }}>2 hours+</span>
        </label>
        <div className = "my-8" style={{borderBottom: "1px solid rgb(204, 204, 204)"}}></div>
    
        {/* Skills */}
        <h3 style={{ color: 'blue' }}>Skills</h3>
        <label style={{ display: 'flex', alignItems: 'center' }}>
          <input type="checkbox" onChange={() => handleFilterChange('My Skills')} />
          <span style={{ marginLeft: '5px' }}>My Skills</span>
        </label>
        <label style={{ display: 'flex', alignItems: 'center' }}>
          <input type="checkbox" onChange={() => handleFilterChange('Training Skill')} />
          <span style={{ marginLeft: '5px' }}>Training Skill</span>
        </label>
        <div className = "my-8" style={{borderBottom: "1px solid rgb(204, 204, 204)"}}></div>
        {/* Add more skills options if needed */}
      </div>
    );
  }
  
  
  const handleFilterChange = (filterOption: string) => {
    setSelectedFilter(filterOption);
  };

  useEffect(() => {
    getCoursestoExplore();
  }, []);

  async function getCoursestoExplore() {
    try {
      let token;
    if(login){
      const client_id = clientId;
      const client_secret = clientSecreat;
      const refresh_token = refreshToken;

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
      token = tokenData.access_token;
    }else {
      token = localStorage.getItem("access_token")
    }
      const config = {
        headers: { Authorization: `oauth ${token}` },
      };
      const contentLocal= localStorage.getItem("selectedLanguage");
      let language;
      if(contentLocal === "en-US"){
        language= "en-US"
      } else{
        language= "en-US,fr-FR"
      }
      const response = await axios.get(
        `https://learningmanager.adobe.com/primeapi/v2/learningObjects?page[limit]=20&filter.catalogIds=174313&sort=name&filter.learnerState=notenrolled&filter.ignoreEnhancedLP=true&language=${language}`,
        config
      );
      const result = response?.data?.data;
      setCourses(result);
    } catch (error) {
      console.error("Error fetching learning objects:", error);
    }
  }


  const EnrollHandle = async (cid: string) => {
    const course = (courses as any).find(obj => obj?.id === cid);
    const Iid = course.relationships?.instances?.data?.[0].id;

    console.log("nnnnnnn", course, Iid)
    if(!login){
      const token = localStorage.getItem("access_token")
    try {
        navigate(`/learning_object/${cid}/instance/${Iid}/isDashboard=false/isCustomer=true/login=false/detailspage`);
      // } 
    } catch (error) {
      console.log(error)
    }

  } else {
    navigate(`/learning_object/${cid}/instance/${Iid}/isDashboard=false/isCustomer=true/login=true/detailspage`);
  }
  }
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };
  const filteredCourses = courses.filter(course =>
    course?.attributes?.localizedMetadata?.[0]?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const handleGoToExplore = () => {
    navigate('/dashboard')
  }

  const handleGoBack = () => {
    navigate('/')
  }
  return (
    <>
    
      <div className='mb-6'>
              {!login && <Header isLogin={false} />}
          </div>
          {login ?
      <>
        <div style={{ float: 'right'}}>
        <button className ="text-blue-500  mr-4 adobe-font hover:bg-transparent text-blue-500 font-normal py-1 px-5 rounded-md" onClick={handleGoBack}>Go Back</button>
        </div> 
      </>
    :
      <>
        <div className="text-blue-500 mt-2" style={{ float: 'right'}}>
          <button onClick={handleGoToExplore}>{t('goToDashbaord')}</button>
        </div>
      </>
        }
    <div className='px-6'>
      <div>
      {login ?
      <h1 className="text-2xl font-bold mb-4 " > Welcome To 3Ds Learning Portal</h1>
      :
      <h1 className="text-2xl font-bold mb-4 " >{t('allCourses')}</h1>
      }
      
      <input
        type="text"
        placeholder="Search courses..."
        value={searchQuery}
        onChange={handleSearch}
        className="border border-gray-300 rounded-md px-4 py-2 mb-4"
      />
      </div>
      <div style={{ display: 'flex' }}>
      {login && (
        <div style={{ width: '300px', marginRight: '20px', borderRight: '1px solid #ccc', padding: '0 20px' }}>
          <Sidebar handleFilterChange={handleFilterChange} />
        </div>
      )}      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ">
        {filteredCourses.map((course) => (
          <CourseCard key={course.id} course={course} EnrollHandle={EnrollHandle} login={login} />
        ))}
      </div>
      </div>
    </div>
    </>
  );
};

export default AllCourses;
