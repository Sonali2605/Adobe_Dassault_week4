import { useState } from "react";


const Sidebar = ({ handleFilterChange }) => {
    const [courseTypeList, setCourseTypeList] = useState(["Courses", "Learning Paths", "Job Aids"]);
    const [courseFormatList, setCourseFormatList] = useState(["Activity", "Blended", "Classroom", "Self Paced", "Virtual Classroom"]);
    const [courseDurationList, setCourseDurationList] = useState(["30 mins or less", "31 mins to 2 hours", "2 hours+"]);
    const [courseSkillList, setCourseSkillList] = useState(["Training Skill", "UI Designer", "Software Developer", "zoro_gaming", "After Effects", "Gamification", "General", "Lightroom", "LMS Basics", "Mastering Illustrator", "Photoshop", "Tag Management"]);
    const [coursePriceList, setCoursePriceList] = useState(["Paid", "Free"]);
    function coursesList(cousre, handleFilterChange) {
        return cousre?.map((data) => (
            <div id="test" style={{ display: 'flex' }} key={data}>
                <input style={{ width: "15px", marginRight: "10px" }} type="checkbox" onChange={() => handleFilterChange(data)} />
                <label style={{ textWrap: "nowrap" }}>
                    {data}
                </label>
            </div>
        ))
    }
    return (
        <div style={{ float: 'left', marginRight: '20px' }}>
            <h2 className='font-bold mb-8' style={{ display: "flex", background: "#d2d8dd", padding: "8px" }}><svg className="h-4 w-5 text-black-500 m-1"   viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round">  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>Filter</h2>
            <div className="my-8" style={{ borderBottom: "1px solid rgb(204, 204, 204)" }}></div>
            {/* Type */}
            <h3 className='font-bold' style={{ marginBottom: "10px" }}>Price</h3>
            {coursesList(coursePriceList, handleFilterChange)}
            <div className="my-8" style={{ borderBottom: "1px solid rgb(204, 204, 204)" }}></div>


            {/* Type */}
            <h3 className='font-bold' style={{ marginBottom: "10px" }}>Type</h3>
            {coursesList(courseTypeList, handleFilterChange)}
            <div className="my-8" style={{ borderBottom: "1px solid rgb(204, 204, 204)" }}></div>

            <h3 className='font-bold' style={{ marginBottom: "10px" }} >Format</h3>
            {coursesList(courseFormatList, handleFilterChange)}


            <div className="my-8" style={{ borderBottom: "1px solid rgb(204, 204, 204)" }}></div>

            <h3 className='font-bold' style={{ marginBottom: "10px" }}>Duration</h3>
            {coursesList(courseDurationList, handleFilterChange)}

            <div className="my-8" style={{ borderBottom: "1px solid rgb(204, 204, 204)" }}></div>
            {/* Skills */}
            <h3 className='font-bold' style={{ marginBottom: "10px" }}>Skills</h3>
            {coursesList(courseSkillList, handleFilterChange)}
            <div className="my-8" style={{ borderBottom: "1px solid rgb(204, 204, 204)" }}></div>
            {/* Add more skills options if needed */}
        </div>
    );
}

export default Sidebar;