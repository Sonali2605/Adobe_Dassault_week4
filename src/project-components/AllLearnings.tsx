import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CourseCard from './CourseCard'; // Create a CourseCard component to represent each course
import { useNavigate } from "react-router-dom";
import Header from './Header';
import { useTranslation } from 'react-i18next';
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
  progressPercentage?: number;
}


const AllLearnings = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { t } = useTranslation();
  useEffect(() => {
    getMyLearningData();
  }, []);

  async function getMyLearningData() {
    try {
      const token = localStorage.getItem("access_token");
      const config = {
        headers: { Authorization: `oauth ${token}` },
      };
      let limit = 10;
      const contentLocal= localStorage.getItem("selectedLanguage");
      let language;
      if(contentLocal === "en-US"){
        language= "en-US"
      } else{
        language= "en-US,fr-FR"
      }
      const response = await axios.get(
        `https://learningmanager.adobe.com/primeapi/v2/learningObjects?include=enrollment,instances,instances.l1FeedbackInfo&page[limit]=${limit}&filter.catalogIds=174313&sort=name&filter.learnerState=enrolled&filter.learnerState=started&filter.learnerState=completed&filter.ignoreEnhancedLP=true&language=${language}`,
        config
      );
      const result = response?.data?.data;
      for (const item of result) {
        const enrollment = item.relationships?.enrollment?.data;
        let state = null;
        let progressPercentage = 0;

        if (enrollment) {
          const enrollmentId = enrollment.id;
          const includedItem = response?.data?.included.find(included => included.id === enrollmentId);
          state = includedItem?.attributes?.state || null;
          progressPercentage = includedItem?.attributes.progressPercent || 0;
        }

        item.state = state;
        item.progressPercentage = progressPercentage
      }

      setCourses(result);
    } catch (error) {
      console.error("Error fetching learning objects:", error);
    }
  }

  const EnrollHandle = async (cid: string) => {
    const course = (courses as any).find(obj => obj?.id === cid);
    const Iid = course.relationships?.instances?.data?.[0].id;

    try {
      navigate(`/learning_object/${cid}/instance/${Iid}/isDashboard=false/isCustomer=false/detailspage`);

    } catch (error) {
      console.log("error")
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
  return (
    <>
      <div className='mb-20'>
        <Header isLogin={true} />
      </div>
      <div className='px-6'>

        <h1 className="text-2xl font-bold mb-4">{t('myLearnings')}</h1>
        <input
          type="text"
          placeholder="Search courses..."
          value={searchQuery}
          onChange={handleSearch}
          className="border border-gray-300 rounded-md px-4 py-2 mb-4"
        />
        <div className="text-blue-500" style={{ float: 'right', marginTop: '-20px' }}>
          <button onClick={handleGoToExplore}>{t('goToDashbaord')}</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} EnrollHandle={EnrollHandle} />
          ))}
        </div>
        
      </div>  </>
  );
};

export default AllLearnings;
