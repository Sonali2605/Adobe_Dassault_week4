import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";
import ".././styles/CoursePlayer.css";
import { apis } from '.././apiServices/apis'

interface CoursePlayerProps {
    cid: string;
    mid: string;
    goBackUrl: string;
    setShowDateValidationModal?: React.Dispatch<React.SetStateAction<boolean>>;
    setProgressPercentage?: React.Dispatch<React.SetStateAction<number>>;
    setIsPlayCourse?: React.Dispatch<React.SetStateAction<boolean>>;
}

function CoursePlayer(props: CoursePlayerProps ) {
    const navigate = useNavigate();
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const { goBackUrl } = props;
    const [learnerToken , setLearnerToken]=useState<string | undefined>();
    const [tokenFetched, setTokenFetched] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await apis.getRefreshToken();
                setLearnerToken(response.access_token);
                setTokenFetched(true);
            } catch (error) {
                console.error("Error fetching access token:", error);
            }
        };
        
        fetchData();
    }, []);

    useEffect(() => {
        if (learnerToken && tokenFetched && iframeRef?.current) {
            const url = `https://learningmanager.adobe.com/app/player?lo_id=${props.cid}&access_token=${learnerToken}`;
            iframeRef.current.src = url;
            iframeRef.current.setAttribute('allowTransparency', 'true');
            iframeRef.current.setAttribute('allowFullScreen', 'true');
        }
    }, [learnerToken, props.cid, tokenFetched]);

    useEffect(() => {
        const closePlayer = (event: MessageEvent) => {
            if (event.data === "status:close") {
                window.removeEventListener("message", closePlayer);
                navigate(goBackUrl as string);
                if(goBackUrl === '/dashboard'){
                    window.location.reload();
                }
                if (props.setShowDateValidationModal) {
                    props.setShowDateValidationModal(true);
                }
                if (props.setProgressPercentage) {
                    props.setProgressPercentage(100);
                }
                if (props.setIsPlayCourse) {
                    props.setIsPlayCourse(false);
                }
            }
        };
        
        window.addEventListener("message", closePlayer);

        return () => {
            window.document.body.style.overflowY = 'auto';
            window.removeEventListener("message", closePlayer);
        };
    }, [navigate, goBackUrl, props]);

    return (
        <div className={'course-player-container'}>
            <div className={'course-player-wrapper'}>
                <iframe
                    ref={iframeRef}
                    id="pplayer_iframe"
                    name="pfplayer_frame"
                    title="Player"
                    className={'course-player-iframe'}
                />
            </div>
        </div>
    );
}

export default CoursePlayer;
