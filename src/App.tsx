// @ts-nocheck
import Login from "./project-components/Login";
import Dashboard from "./project-components/Dashboard";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Detailspage from "./project-components/Detailspage";
import ManagerDashboard from "./project-components/ManagerDashboard";
import ProfilePage from "./project-components/profilePage";
import DashboardCustomer from "./project-components/DashboardCustomer";
import FluidicPlayer from "./project-components/FluidicPlayer";
import AllCourses from "./project-components/AllCourses";
import AllLearnings from "./project-components/AllLearnings";
import Header from './project-components/Header';

export default function App() {
  return (
    <>
      {/* <Login/> */}
      {/* <Dashboard/> */}
      
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/learning_object/:courseId/instance/:instanceId/:isDashboard/:isCustomer/detailspage" element={<Detailspage />} />
          <Route path="/managerDashboard" element={<ManagerDashboard />} />
          <Route path="/profile" element={<ProfilePage/>} />
          <Route path="/DashboardCustomer" element={<DashboardCustomer/>} />
          <Route path="/fludicPlayer" element={<FluidicPlayer/>}/>
          <Route path="/allCourses" element={<AllCourses/>}/>
          <Route path="/myLearnings" element={<AllLearnings/>}/>
        </Routes>
      </BrowserRouter>
    </>
  );
}
