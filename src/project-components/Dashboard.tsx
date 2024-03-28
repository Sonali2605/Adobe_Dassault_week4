// @ts-nocheck

import { useEffect, useState, useMemo } from "react";
import Header from "./Header";
import DashboardHeading from "./DashboardHeading";
import LineChart from "./LineChart";
import ProfileCard from "./ProfileCard";
import Badges from "./Badges";
import CertificateCard from "./Certificate";
import axios from "axios";
import NewProduct from "./NewProducts";
import ComplianceTraining from "./ComplainceTraining";
import SkillProgress from "./SkillProgress";
import Network from "./Network";
import Leaderboard from "./Leaderboard";
import CourseExplore from "./ExploreCourse";
import CalendarCourse from "./CalenderCourse";

// import DatePicker from "react-datepicker"; // Install react-datepicker2
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import ".././styles/common.css";
import MyLearning from "./MyLearning";

interface Certificate {
  imageUrl: string;
  name: string;
  description: string;
}


// interface Course {
//   title: string;
//   description: string;
// }

const Dashboard = () => {
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const currentDate = new Date();

  const formattedCurrentDate = currentDate.toISOString().split('T')[0]; // Format date as "YYYY-MM-DD"

  const [dotDates] = useState([
    "2024-03-25",
    "2024-03-11",
    "2024-03-24",
    formattedCurrentDate
  ]);

  // Assuming you have course data available
  const courseData = {
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
          "https://learningmanager.adobe.com/primeapi/v2/learningObjects?include=subLOs&page[limit]=1&filter.loTypes=certification&sort=-date&filter.ignoreEnhancedLP=true",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const certificateData = response.data?.data?.[0];
        if (certificateData) {
          // const certificateName = certificateData.attributes.localizedMetadata.find(
          //   (metadata: { name: string }) => metadata.name === 'Consultative Selling'
          // );

          // if (certificateName) {
          const imageUrl =
            certificateData?.attributes?.imageUrl !== undefined
              ? certificateData.attributes.imageUrl
              : "/images/header4.png";
          const name =
            certificateData?.attributes?.localizedMetadata[0]?.name ||
            "Consultative Selling";
          const description =
            certificateData?.attributes?.localizedMetadata[0]?.description ||
            "Consultative Selling is a customer-centric approach to sales that prioritizes understanding and addressing the unique needs, challenges, and objectives of each individual customer.";

          setCertificate({ imageUrl, name, description });
          // }
        }
      } catch (error) {
        console.error("Error fetching certificate:", error);
      }
    };

    fetchData();
  }, []);

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

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

  
  const getSelectedCourse = () => {
    if (!selectedDate) return null;
  
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0'); // Add leading zero for single-digit months
    const day = String(selectedDate.getDate()).padStart(2, '0'); // Add leading zero for single-digit days
  
    const formattedDate = `${year}-${month}-${day}`;
  
    return courseData[formattedDate];
  };

  return (
    <>
      <Header isLogin={false} />
      <div className="mt-5">
        <DashboardHeading />
        <div className="grid grid-rows-3 grid-flow-col gap-4 px-10 ">
          <div className="row-start-1 row-span-4 max-w-xs">
            <ProfileCard name="Olivia Clarke" />
            <Badges />
            {certificate && (
              <CertificateCard
                imageUrl={certificate.imageUrl}
                name={certificate.name}
                description={certificate.description}
              />
            )}
          </div>
          <div className="row-start-1 row-end-4">
            <LineChart />
            <NewProduct />
          </div>
          <div className="row-start-1 row-end-4">
            <ComplianceTraining />
            <SkillProgress />
          </div>
        </div>
        <div className="flex mt-4 px-10">
          <div className="min-w-xs">
            <Network />
          </div>
          <div className="ml-4 flex-grow" style={{ marginTop: "-45px", maxWidth:"72%" }}>
            <Leaderboard />
            <div className="mt-4">
              <CourseExplore isCustomer={false} />
            </div>
            <div className="mt-4">
              <MyLearning isCustomer={false} />
            </div>
            <div className="mt-4 mb-10" style={{ display: "flex" }}>
              <div style={{ minWidth: '20rem', width: "40%", marginRight: "10px" }}>
                {selectedDate && (
              <CalendarCourse
                selectedDate={selectedDate}
                selectedCourse={getSelectedCourse()}
              />
            )}
              </div>
              <div style={{ width: '40%', marginTop: '5%', padding: '15px' }}>
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
        </div>
      </div>
    </>
  );
};

export default Dashboard;
