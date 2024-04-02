import { useEffect, useState } from "react";

const CustomToast = ({ message, onClose }) => {
    const [remainingTime, setRemainingTime] = useState(100);
  
    useEffect(() => {
      const timer = setInterval(() => {
        setRemainingTime(prevTime => prevTime - 1);
      }, 50); // Update every 50 milliseconds
  
      const timeout = setTimeout(() => {
        clearInterval(timer);
        onClose();
      }, 5000); // Automatically close after 5 seconds
  
      return () => {
        clearInterval(timer);
        clearTimeout(timeout);
      };
    }, [onClose]);
  
    const timerWidth = (remainingTime / 100) * 100 + "%";
  
    return (
      <div style={{ position: 'fixed', bottom: '20px', right: '20px', backgroundColor: 'rgba(0, 123, 255, 0.7)', color: 'white', padding: '20px', borderRadius: '5px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '300px', fontSize: '18px' }}>
        <div style={{ flex: '1' }}>{message}</div>
        <button style={{ backgroundColor: 'transparent', border: 'none', color: 'white', cursor: 'pointer', fontSize: '10px', padding: '5px', borderRadius: '50%', position: 'absolute', top: '-5px', right: '1px' }} onClick={onClose}>X</button>
        <div style={{ position: 'absolute', bottom: '0', left: '0', height: '4px', backgroundColor: 'green', borderRadius: '2px', width: timerWidth }}></div>
      </div>
    );
};

export default CustomToast;
