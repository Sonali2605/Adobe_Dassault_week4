// @ts-nocheck
interface LearningObjectInstanceEnrollment {
  id?: string;
  type?: string;
  progressPercentage?: number;  
  state?: string;
  attributes: {
      dateEnrolled?: string;
      dateStarted?: string;
      enrollmentSource?: string;
      hasPassed?: boolean;
      score?: number;
      duration?:number;
      bannerUrl?: string;
      name?: string; // Add name property
      avatarUrl?: string; // Add avatarUrl property\
      isBookmarked?:boolean;
      imageUrl:string;
        localizedMetadata?: {
          name: string;
          description: string;
        }[];
  };
  relationships?: {
      learner?: {
          data?: {
              id?: string;
              type?: string;
          };
      };
      learningObject?: {
          data?: {
              id?: string;
              type?: string;
          };
      };
      loInstance?: {
          data?: {
              id?: string;
              type?: string;
          };
      };
      loResourceGrades?: {
          data?: {
              id?: string;
              type?: string;
          }[];
      };
  };
}
import axios from 'axios';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark as solidBookmark } from '@fortawesome/free-solid-svg-icons';
import { faBookmark as lightBookmark } from '@fortawesome/free-regular-svg-icons';

interface CourseCardProps {
  course: LearningObjectInstanceEnrollment;
  EnrollHandle: (id: string) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, EnrollHandle }) => {
  // Calculate progress percentage
  const progress = course.progressPercentage || 0;

  // Calculate duration in minutes and seconds
  const durationInSeconds = course.attributes?.duration || 0;
  const minutes = Math.floor(durationInSeconds / 60);
  const seconds = durationInSeconds % 60;

  // Get enrollment state
  let enrollmentState = "ENROLL";
  if (course.id && course.state) {
    enrollmentState = course.state;
  }

  // State for bookmark status
  const [isBookmarked, setIsBookmarked] = useState(course.attributes.isBookmarked);

  // Function to handle bookmarking
  const handleBookmark = async (courseId: string) => {
    const token = localStorage.getItem("access_token");
    const config = {
      headers: { Authorization: `oauth ${token}` },
    };
    const bookmarkUrl = `https://learningmanager.adobe.com/primeapi/v2/learningObjects/${courseId}/bookmark`;

    try {
      if (isBookmarked) {
        // Remove bookmark
        await axios.delete(bookmarkUrl, config);
      } else {
        // Add bookmark
        await axios.post(bookmarkUrl, {}, config);
      }
      // Toggle bookmark status
      setIsBookmarked(!isBookmarked);
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    }
  };

  return (
    <div className="course-card bg-white shadow-lg rounded-lg overflow-hidden flex flex-col">
      <img
        className="course-image object-cover h-64 w-full"
        src={course?.attributes?.imageUrl}
        alt={course?.attributes?.localizedMetadata?.[0]?.name || ""}
      />
      {enrollmentState !== "Explore" && (
        <div className="py-2  items-center">
          <div className="w-full bg-gray-200 h-2 rounded-full mr-4">
            <div
              className="h-full bg-blue-500 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}
      <div>
      <div className="px-2 flex justify-between">
            <div className="text-sm text-gray-600">
              {minutes}m {seconds}s
            </div>
            <div className="text-sm text-right text-gray-600">{progress}%</div>
          </div>
          <div className='text-right pr-2'>
          <span
            className="bookmark-icon ml-2 cursor-pointer"
            onClick={() => handleBookmark(course.id || '')}
          >
            <FontAwesomeIcon icon={isBookmarked ? solidBookmark : lightBookmark} />
          </span>
          </div>
      </div>
      <div className="px-6 py-4 flex-grow">
        <div className="font-bold text-xl mb-2 cursor-pointer overflow-hidden"
          style={{ maxHeight: '1.5em', whiteSpace: 'pre-wrap', textOverflow: 'ellipsis' }}
          title={course?.attributes?.localizedMetadata?.[0]?.name}>
          {course?.attributes?.localizedMetadata?.[0]?.name}
        </div>
        <p
          className="text-gray-700 text-base cursor-pointer overflow-hidden"
          style={{ maxHeight: '3em', whiteSpace: 'pre-wrap', textOverflow: 'ellipsis' }}
          title={course?.attributes?.localizedMetadata?.[0]?.description}
        >
          {course?.attributes?.localizedMetadata?.[0]?.description}
        </p>
        <div className="flex justify-center mt-4">
          <button
            className="enroll-link bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={() => EnrollHandle(course?.id || '')}
          >
            {enrollmentState}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
