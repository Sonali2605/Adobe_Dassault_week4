// @ts-nocheck
import { useEffect, useState } from "react";
import Header from "./Header";
import playiconone from "../assets/images/playiconone.png";
import pdficon from "../assets/images/pdf.png";
import ".././styles/Detailspage.css";
// import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

import styled from 'styled-components';
import ModalforSuccess from ".././common/Modal/Modal";
import jsonData from "./resdata.json";
import { apis } from '.././apiServices/apis'
import axios from "axios";
import FeedbackModal from "./FeedbackModal";
import { getLocalizedContent } from "./utils/commanUtils";
import { useTranslation } from 'react-i18next';
import RegisterModal from './RegisterModel';
import ".././styles/common.css";
import { clientId, clientSecreat, refreshToken, base_adobe_url } from "../AppConfig"
import ProfileModal from "./ProfileModal";
const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index:9998;
`;

const ModalContent = styled.div`
background-color: white;
padding: 40px 20px;
border-radius: 8px;
width: 500px; /* Adjust the width as needed */
`;

const ModalHeader = styled.div`
  position: relative;
  text-align: center;
`;

const ModalCloseButton = styled.button`
  position: absolute;
  top: -30px;
  right: -8px;
  background: none;
  border: 1px solid rgba(142, 161, 180, 1);
  cursor: pointer;
  font-size: 14px;
  width: 23px;
  height: 23px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  color: rgba(142, 161, 180, 1);
`;

const ModalTitle = styled.div`
  font-size: 24px;
  font-weight: bold;
  font: normal normal normal 24px Impact;
`;

const InputField = styled.input`
width: 80%;
padding: 6px;
margin-top: 10px;
text-align: center;
transform: translateX(12%);
border: 1px solid #ada7a7;
background: #fff;
border-radius: 20px;
color: #000;
margin-bottom: 0.7rem
`;

const Button = styled.button`
color: white;
border: none;
padding: 10px 20px;
margin-top: 20px;
cursor: pointer;
border-radius: 4px;
display: block;
margin: 0 auto;
margin-top: 20px;
`;

const PrimaryButton = styled(Button)`
border-radius: 9999px;
padding: 0.5rem 3rem;
`;

// const SecondaryButton = styled(Button)`
//   background-color: #ffffff;
//   color: #4471e8;
//   border: 1px solid #4471e8;
//   padding: 10px 40px;
// `;


const LoginRadio = styled.div`
display: flex;
color: #000;
justify-content: center;
& > label:nth-child(2) {
  margin-left: 15px;
}
& > label > input {
  width: auto;
  margin-right: 8px;
  top: 2px;
  position: relative;
}
`
interface Details {
  data?: {
    id?: string; // Add id property
    attributes?: {
      loFormat?: string;
      localizedMetadata?: Array<{ name?: string; overview?: string }>;
      bannerUrl?: string;
      name?: string; // Add name property
      avatarUrl?: string; // Add avatarUrl property
    };
  };
}


interface LearningObjectInstanceEnrollment {
  id?: string;
  type?: string;
  attributes: {
      dateEnrolled?: string;
      dateStarted?: string;
      enrollmentSource?: string;
      hasPassed?: boolean;
      progressPercent?: number;
      score?: number;
      state?: string;
      bannerUrl?: string;
      name?: string; // Add name property
      avatarUrl?: string; // Add avatarUrl property
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


const Detailspage = () => {
  const [activeTab, setActiveTab] = useState(1);
  const location = useLocation();
  const[ , setlearnerToken]=useState();
  const[dateData, setDateData] =  useState<string | null>(null);
  const[enrollmentData, setEnrollmentData]= useState<LearningObjectInstanceEnrollment>();
  const[author, setAuthor]= useState<LearningObjectInstanceEnrollment>();
  const[isfeedback, setIsFeedback]= useState<LearningObjectInstanceEnrollment>();
  const[iId, setIId]= useState<LearningObjectInstanceEnrollment>();
  const[instanceObject, setInstanceObject] = useState<any>();
  const { pathname } = location;
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>('');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const[loResouceData, setloResouceData]= useState<LearningObjectInstanceEnrollment>();
  const[loResoucesGrade, setLoResoucesGrade]= useState<LearningObjectInstanceEnrollment>();
  const [isEnroll, setIsEnroll]= useState(false);

  const { t } = useTranslation();
  const handleFeedbackClick = () => {
    setShowFeedbackModal(true);
  };
  

  // Split the URL by '/'
  const parts = pathname.split('/');

  // Find the part containing 'course:'
  const coursePart = parts.find(part => part.includes('course:'));
console.log("coursePart", coursePart)
  // Extract the value after 'course:'
  const courseId = coursePart ? coursePart.split(':')[1] : '';
  
  const isCustomerPart = parts.find(part => part.includes("isCustomer"));

// Split the isCustomer part by "=" to get the value
   const isCustomerValue = isCustomerPart?.split("=")[1];
   const isDashboardPart = parts.find(part => part.includes("isDashboard"));

// Split the isCustomer part by "=" to get the value
   const isDashboardValue = isDashboardPart?.split("=")[1];

   const loginPart = parts.find(part => part.includes("login"));
   const loginValue = loginPart?.split("=")[1];

   console.log("loginValue",loginValue, typeof(loginValue))

  const [showDateValidationModal, setShowDateValidationModal] = useState(false);
  const [title] = useState(
    "Congratulations on completing the “Negotiations 101” course"
  );
  const [errorMsg] = useState("You have earned your badge!");
  /* const [img] = useState(
    "https://cpcontents.adobe.com/public/account/107442/accountassets/107442/badges/8f41853356a8453d9e263f39d4377d74/badge_blackbelt.png"
  ); */
  const [img] = useState(
    "/images/Asset_7_4x.png"
  );

  const navigate = useNavigate();
  const [details, setDetails] = useState<Details | undefined>();

  const handleLogin = async () => {
    localStorage.setItem("pathLogin",pathname);
    try {
      const response = await axios.post('https://viku.space/renault/reapi.php', {
        action: 'login',
        username: username,
        password: password,
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InlhdGluIn0.SXp3ID7mgUcLGYMVkvb3RJgc_tJ1hGv2NR_08s5SYNM'
        }
      });
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
      localStorage.setItem(
        'access_token',
        tokenData.access_token
      );     
      const config = {
        headers: { Authorization: `oauth ${ tokenData.access_token}` },
      };
      // const response = await axios.get('https://learningmanager.adobe.com/primeapi/v2/user', config);
      // console.log
      const userDataResponse = await axios.get(
        `${base_adobe_url}/primeapi/v2/user`,
        {
          headers: {
            Authorization: `Bearer ${tokenData.access_token}`,
          },
        }
      );

      const userId = userDataResponse.data?.data?.id;
console.log("user profile data", userDataResponse.data?.data);
      localStorage.setItem('userId', userId);
      let contentLocale = "en-US";
      const bodyData= {
        data: {
        id: userId,
        type: 'user',
        attributes: {
          contentLocale: contentLocale,
          uiLocale: contentLocale,
        },
      },
    }
      const responseData = await axios.patch(
        `${base_adobe_url}/primeapi/v2/users/${userId}`,bodyData,config);

      console.log("11111111111111Language", responseData)
      
      localStorage.setItem("selectedLanguage",responseData.data?.data?.attributes?.uiLocale )
      // const parts = pathname.split('/');
      const regex = /instance\/course:(\d+_?\d+)/;
      const match = pathname.match(regex);
      const courseInstanceId = match ? match[1] : null; // This will give you "9391878_10066226"
      // try {
        // const response = await fetch('https://learningmanager.adobe.com/primeapi/v2/enrollments?loId=' + "course:"+courseId + '&loInstanceId=' + encodeURIComponent("course:"+courseInstanceId), {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //     'Authorization': `Bearer ${tokenData.access_token}`
        //   },
        // });
        // if (!response.ok) {
        //   navigate('/')
        //   throw new Error('Failed to enroll');
        // } else {
          if(response?.data?.success)
            setShowProfileModal(true);
          // navigate(`/learning_object/course:${courseId}/instance/course:${courseInstanceId}/isDashboard=false/isCustomer=true/login=false/detailspage`);
          // window.location.reload();
        // } 
      // } catch (error) {
      //   console.log("error",error)
      // }
      
      setShowLoginModal(false);
      setAgencyId('');
      setUsername('');
      setPassword('');
      setError('');
      setDashboard('');
    } catch (error) {
      setError("Issue with Login");
    }
  };

  async function getLearningObjects() {
    try {
      const res = await apis.getRefreshToken()
      setlearnerToken(res.access_token)
      console.log(res?.access_token ,"response")
      const config = {
        // headers: { Authorization: "Bearer dea088ff9bbdca4e8cbbd5fa7de2d290" },
        headers: { Authorization: `oauth ${res.access_token}` },
      };
      const contentLocal= localStorage.getItem("selectedLanguage");
      let language;
      if(contentLocal === "en-US"){
        language= "en-US"
      } else{
        language= "en-US,fr-FR"
      }
      const response = await axios.get(
        `https://learningmanager.adobe.com/primeapi/v2/learningObjects/course:${courseId}?include=enrollment.loResourceGrades%2CsubLOs.enrollment.loResourceGrades%2Cenrollment.loInstance.loResources.resources%2Cinstances.loResources.resources%2Cinstances.l1FeedbackInfo%2Cskills.skillLevel.skill%2CsubLOs.instances.subLoInstances%2CsupplementaryLOs.instances.loResources.resources%2csubLOs.instances.loResources.resources%2CprerequisiteLOs%2cenrollment.learnerBadge.badge%2cauthors%2cauthors.account&language=${language}`,

        config
      );
      const result = response?.data;
      const enrollment = result?.included.find((findData: LearningObjectInstanceEnrollment) => findData.type === 'learningObjectInstanceEnrollment' && findData?.id === result?.data.relationships.enrollment?.data.id);
      setEnrollmentData(enrollment);
      console.log("222222222222222222222222222222eb", enrollment)

      const loGradeArray= enrollment?.relationships?.loResourceGrades?.data;
      let loresourceDataArray= [];      
      let resourceDatacount = 0;      
      let resourceDataObj={}
      for( let i = 0 ; i < loGradeArray?.length ; i++){
        let resourceData =  result?.included.find((ele: LearningObjectInstanceEnrollment) =>ele?.id === loGradeArray[i]?.id);
        if(resourceData?.attributes?.hasPassed)
          resourceDatacount += 1;
      }
      resourceDataObj.hasPassedCount= resourceDatacount;
      resourceDataObj.totalModule = loGradeArray?.length;

      setLoResoucesGrade(resourceDataObj);
      console.log("neww",resourceDataObj)

      const author = result?.included.find((findData: LearningObjectInstanceEnrollment) => findData.type === 'user' && findData?.id === result?.data.relationships.authors?.data[0].id);
      setAuthor(author);

      const instance = result?.included.find((findData: LearningObjectInstanceEnrollment) => findData.type === 'learningObjectInstance' && findData?.id === result?.data.relationships.instances?.data[0].id);
      
      const feedback = result?.included.find((findData: LearningObjectInstanceEnrollment) => findData.type === 'feedbackInfo' && findData?.id === instance.relationships.l1FeedbackInfo?.data.id);
     
      setIsFeedback(feedback);
      const Iids = result?.included.find((findData: LearningObjectInstanceEnrollment) => findData.type === 'learningObjectInstance' && findData?.id === result?.data.relationships.instances?.data[0].id);
      
      setInstanceObject(Iids);
      const loResourceData = Iids.relationships?.loResources;

      let resourceDataArray= [];
      for( let i = 0 ; i < loResourceData?.data?.length ; i++){
        let resourceDataObj={}
        let resourceData =  result?.included.find((ele: LearningObjectInstanceEnrollment) =>ele?.id === loResourceData.data[i].id);
        resourceDataObj.name= getLocalizedContent(resourceData?.attributes?.localizedMetadata)?.name;
        resourceDataObj.id = resourceData?.id;
        resourceDataObj.previewEnabled= resourceData?.attributes?.previewEnabled;
        console.log("PPPPPPPPPPPPPPPPPPPPPPPPPP",resourceData?.relationships?.resources?.data[0]);
        let resourceDetails =  result?.included.find((ele: LearningObjectInstanceEnrollment) =>ele?.id === resourceData?.relationships?.resources?.data[0]?.id);
        console.log("qqqqqqqqqqqqqqqqqqqqq",resourceDetails);
        resourceDataObj.contentType = resourceDetails?.attributes?.contentType;
        resourceDataArray.push(resourceDataObj);
      }
      setloResouceData(resourceDataArray);
      
      // setIId(Iid.relationships?.loResources.data[0].id);
      const effectiveModifiedDate = new Date(result?.data?.attributes?.effectiveModifiedDate);

    // Current date
    const currentDate = new Date();

      // Calculate the difference in milliseconds
      const differenceInMs = currentDate.getTime() - effectiveModifiedDate.getTime();
      // Convert milliseconds to hours
      const differenceInHours = Math.floor(differenceInMs / (1000 * 60 * 60));

      // Calculate remaining milliseconds after removing hours
      const remainingMs = differenceInMs - (differenceInHours * (1000 * 60 * 60));

      // Convert remaining milliseconds to minutes
      const differenceInMinutes = Math.floor(remainingMs / (1000 * 60));

      // Set the difference in hours and minutes state
      setDateData(`${differenceInHours} hrs ${differenceInMinutes} mins`);

      setDetails(result);
      const previousPathname = localStorage.getItem("previousPathname");        
      localStorage.removeItem("previousPathname")
      if (previousPathname === "/fludicPlayer" && enrollment?.attributes?.progressPercent  === 100) {
        setShowDateValidationModal(true);
      }
      return result;
    } catch (error) {
      console.error("Error fetching learning objects:", error);
    }
  }

  useEffect(() => {
    console.log(jsonData, "jsonData");
    // detailsPageApi();
    getLearningObjects();
  }, [isEnroll]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // const playCourse = (cid: string, mid?: string) => {
  //   setIsCid(cid);
  //   if (mid) {
  //     setIsCiid(mid);
  //   }
  // };\\

  const handleRegisterHere = ()=>{
    setShowLoginModal(false);
    setShowRegisterModal(true)
  }

  const handlePlayerPreview= (id: string | undefined) => {
    navigate(`/fludicPlayer?cid=${id}&back_url=${window.location.pathname}`)
  }
  const handleplayer = (id: string | undefined) => {
    if (enrollmentData?.attributes?.progressPercent !== 100) {
      // setIsPlayCourse(true);
      // playCourse(id);
      navigate(`/fludicPlayer?cid=${id}&mid=${iId}&back_url=${window.location.pathname}`)
    } else {
      if(isDashboardValue === "true"){
        if(isCustomerValue === "true"){
          navigate('/DashboardCustomer')
        }else {
        navigate('/dashboard')
        }
      } else{
        if(isCustomerValue === "true"){
          if(loginValue === "true"){
            navigate('/allCourses?login=true')
          }else {
            navigate('/allCourses')
          }
        }else {
        navigate('/myLearnings')
        }
      }
    }
     setShowDateValidationModal(true);
  };

  const handleTabClick = (tabNumber: number) => {
    setActiveTab(tabNumber);
  };
  console.log(enrollmentData,author, "progressPercentage");
  console.log("details", details?.data)

  const handleGoBack = () => {
    localStorage.clear();
    navigate('/allCourses?login=true')
  }
  const handleProfileClose = () =>{
   setShowProfileModal(false);
   const regex = /instance\/course:(\d+_?\d+)/;
   const match = pathname.match(regex);
   const courseInstanceId = match ? match[1] : null;
   navigate(`/learning_object/course:${courseId}/instance/course:${courseInstanceId}/isDashboard=false/isCustomer=true/login=false/detailspage`);
   window.location.reload();
  }

  const loHandleClick = (courseId, moduleId) =>{
    if(localStorage.getItem("access_token")){
      if(details?.data?.attributes?.price ){
        alert("This content cannot be viewed. Please click on Pay to enroll before accessing the content")
      }else {
      setIId(moduleId);
      navigate(`/fludicPlayer?cid=${courseId}&mid=${moduleId}&back_url=${window.location.pathname}`)
      }
    } else{
      alert("This content cannot be viewed. Please login and enroll in the training before playing this content")
    }
  
  }
  
  const handleEnroll= async()=>{
    console.log("Inside enroll")
    try{
      const regex = /instance\/course:(\d+_?\d+)/;
      const match = pathname.match(regex);
      const courseInstanceId = match ? match[1] : null; 
     const response = await fetch('https://learningmanager.adobe.com/primeapi/v2/enrollments?loId=' + "course:"+courseId + '&loInstanceId=' + encodeURIComponent("course:"+courseInstanceId), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem(
              'access_token')}`
          },
        });
        if (!response.ok) {
          setIsEnroll(false);
          navigate('/')
          throw new Error('Failed to enroll');
        } else {
          setIsEnroll(true);
          navigate(`/learning_object/course:${courseId}/instance/course:${courseInstanceId}/isDashboard=false/isCustomer=true/login=false/detailspage`);
          window.location.reload();
        }
      }catch(error){
        console.log(error)
      }
  }

  console.log("final lo", loResouceData);
  
  console.log("neww",details?.data?.relationships?.enrollment)

  return (
    <>
      {loginValue === "false" &&
      <Header isLogin={false} />
      }
      {loginValue === "true" &&
      <div style={{ float: 'right'}}>
      <button className ="text-blue-500 my-5 mr-4 adobe-font hover:bg-transparent text-blue-500 font-normal py-1 px-5 rounded-md" onClick={handleGoBack}>Go Back</button>
      </div> 
      }
      
      <img src={details?.data?.attributes?.bannerUrl} alt="Logo" style={{ maxHeight: "360px",  width: "100%", display: "block", margin: "0 auto" }}/>

      <div className="container flex ">
        <div className="my-8 flex-1 mx-5 mr-16">
          <div className="">
            
            <h1 className="heading">
              {getLocalizedContent(details?.data?.attributes?.localizedMetadata)?.name}
            </h1>
            <p className="description-self">
              {details?.data?.attributes?.loFormat}
            </p>
          </div>
          <p className="description-content">
            {getLocalizedContent(details?.data?.attributes?.localizedMetadata)?.overview}
          </p>
          <div className="">
            <div className="">
              <div className="flex border-b-2">
                <button
                  className={`w-1/10 py-2 px-4 rounded-tl-lg focus:outline-none pb-2 ${
                    activeTab === 1 ? " tab-active" : "tab-unactive"
                  }`}
                  onClick={() => handleTabClick(1)}
                >
                  MODULES
                </button>
                <button
                  className={`w-1/10 py-2 px-4 rounded-tr-lg focus:outline-none pb-2 ${
                    activeTab === 2 ? " tab-active" : "tab-unactive"
                  }`}
                  onClick={() => handleTabClick(2)}
                >
                  NOTES
                </button>
              </div>
              <div className="p-8 pl-0 pr-0">
                <div
                  className={activeTab === 1 ? "" : "hidden"}
                  id="tab-content-1"
                >
                  <p className="core-content">Core Content</p>
                  {loResouceData?.map(item => (
                  <div className="rounded-lg bg-gray-200 flex justify-between p-6 pl-7 my-4 cursor-pointer" onClick={() =>loHandleClick(details?.data?.id, item?.id)}>
                  <div className="flex">
                    <span className="mr-6">
                      <img
                        src={item.contentType === "VIDEO" ? playiconone : pdficon}
                        alt="Logo"
                        style={item.contentType === "VIDEO" ? {width: "54px", height: "53px" } : {width: "50px", height: "53px" }}
                      />
                    </span>
                    <span className="">
                      <div>
                        <span className="module-title">
                          {
                             item?.name
                          }
                        </span>
                      </div>
                      <div>
                        <span className="module-type">
                          {details?.data?.attributes?.loFormat}
                        </span>
                      </div>
                    </span>
                  </div>
                  <div className="flex">
                    <span className="">
                      <div>
                        <span className="module-title">Last visited</span>
                      </div>
                      <div>
                        <span className="module-type">{dateData}</span>
                      </div>
                    </span>
                  </div>
                </div>
                  ))}
                </div>
                <div
                  className={activeTab === 2 ? "" : "hidden"}
                  id="tab-content-2"
                >
                  <p></p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="card mr-0 mt-8 ">
          <div className="card-content">
            {loginValue === "true" ?
            <>
             <div className="text-lg font-bold mb-4" style={{color:"rgb(66, 162, 218)", marginLeft: "auto", float:"right"}}>
            {details?.data?.attributes?.price ? "$ "+ details?.data?.attributes?.price : "Free"}
            </div>
            <button
            /* className="bg-blue-300 rounded-lg w-full p-2 mb-8" */
            style={{backgroundColor:"rgb(66, 162, 218)"}}
            className="rounded-lg w-full p-2 mb-8 text-white uppercase"
            onClick={() => setShowLoginModal(true)}
          >
            Login to access course
          </button>
          </>
            :
          details?.data?.attributes?.price && !details?.data?.relationships?.enrollment ?
          <button
          /* className="bg-blue-300 rounded-lg w-full p-2 mb-8" */
          style={{backgroundColor:"rgb(66, 162, 218)"}}
          className="rounded-lg w-full p-2 mb-8 text-white uppercase"
         
        >
          BUY NOW |  ${details?.data?.attributes?.price}
        </button>
        :    
            details?.data?.relationships?.enrollment ?
            <>
            <span className="course-progress">{t('courseProgress')}</span>
            <div className="flex justify-between mt-7 mb-5">
              <div>
                <span className="modules-completed">{ `${loResoucesGrade?.hasPassedCount }/${loResoucesGrade?.totalModule}`} {t('modulesComplete')}</span>
              </div>
              <div>
                <span className="modules-completed">
                  {enrollmentData?.attributes?.progressPercent}% {t('completed')}
                </span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-lg overflow-hidden mb-9">
              <div
                className="h-1 rounded-lg progress"
                style={{ width: `${enrollmentData?.attributes?.progressPercent}%` }}
              ></div>
            </div>
            <button
              /* className="bg-blue-300 rounded-lg w-full p-2 mb-8" */
              style={{backgroundColor:"rgb(66, 162, 218)"}}
              className={`  ${enrollmentData?.attributes?.progressPercent === 100
                ? ""
                : ""} rounded-lg w-full p-2 mb-8 text-white uppercase` }
              onClick={() => handleplayer(details?.data?.id)}
            >
              {enrollmentData?.attributes?.progressPercent !== 100
                ? t('continueCourse')
                : t('goBackToPreviousPage')}
            </button>
            </>
            :
            <button
          /* className="bg-blue-300 rounded-lg w-full p-2 mb-8" */
          style={{backgroundColor:"rgb(66, 162, 218)"}}
          className="rounded-lg w-full p-2 mb-8 text-white uppercase"
         onClick={()=>handleEnroll()}
        >
         Enroll
        </button>
          }
          { localStorage.getItem("access_token") && !details?.data?.relationships?.enrollment && details?.data?.attributes?.hasPreview && (
             <button
             /* className="bg-blue-300 rounded-lg w-full p-2 mb-8" */
             style={{backgroundColor:"rgb(66, 162, 218)"}}
             className="rounded-lg w-full p-2 mb-8 text-white uppercase"
             onClick={() => handlePlayerPreview(details?.data?.id)}
           >
             Preview
           </button>
          )}
          {/* )
            
          } */}
            {isfeedback &&  enrollmentData?.attributes?.progressPercent === 100 &&(
        <div>
          <p className="give-feedback mb-4 text-lg font-bold text-blue-500 cursor-pointer" onClick={handleFeedbackClick}>
           {t('giveFeedback')}
          </p>
        </div>
      )}
      {/* Feedback Modal */}
      {showFeedbackModal && <FeedbackModal show={showFeedbackModal} handleClose={() => setShowFeedbackModal(false)} feedBack = {isfeedback} enrollmentId = {enrollmentData?.id}  />}
            <p className="levels-achieved">Levels achieved after completion</p>
            <p className="levels-achieved-credit">
              Level 1 - Professional (Credit 3)
            </p>

            <div className="mt-5 ml-3">
                <p className="author">{t('author')}</p></div>
            <div className="author-info mb-6">
              <img
                src={author?.attributes?.avatarUrl}
                alt="Logo"
                className="rounded-full"
                style={{ width: "54px", height: "53px" }}
              />
              <div>
                <p className="username">
                  {/* {details?.data?.attributes?.authorNames[0]} */}
                  {author?.attributes?.name}
                </p>
                {/* <p className="post">{author?.attributes?.profile}</p> */}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ModalforSuccess
        show={showDateValidationModal}
        handleClose={() => setShowDateValidationModal(false)}
        msg={errorMsg}
        title={title}
        imageUrl={img}
      />
       {showLoginModal && (
        <ModalContainer>
          <ModalContent>
            <ModalHeader>
              <ModalCloseButton onClick={() => setShowLoginModal(false)}>&#10005;</ModalCloseButton>
              <ModalTitle>Login</ModalTitle>
            </ModalHeader>
            <InputField className='border-2 rounded-md' type="email" placeholder="Company email" value={username} onChange={(e) => setUsername(e.target.value)} />
            <InputField className='border-2 rounded-md' type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <div className='text-center mt-3'>
              New user?
              <a href="javascript:void(0)" className='text-blue-500' rel="noopener noreferrer"onClick={handleRegisterHere}>Register Here</a>
            </div>
            <PrimaryButton className='mt-5 bg-[#55c1e3] text-white font-bold text-2xl py-2 px-6 rounded-full' onClick={handleLogin}>Login</PrimaryButton>
          </ModalContent>
        </ModalContainer>
      )}

      {showRegisterModal && (
        <RegisterModal onClose={() => setShowRegisterModal(false)} login = {true}/>
      )}
      {showProfileModal && (
        <ProfileModal isOpen={showProfileModal} onClose={handleProfileClose} />
      )}
    </>
  );
};

export default Detailspage;
