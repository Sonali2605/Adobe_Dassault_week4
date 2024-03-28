import ModalforSuccess from '@/common/Modal/Modal';
import { useEffect, useRef , useState} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function FluidicPlayer() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const iframeRef = useRef<any>(null);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [title] = useState(
    "Congratulations on completing the “Negotiations 101” course"
  );
  const [errorMsg] = useState("You have earned your badge!");
  /* const [img] = useState(
    "https://cpcontents.adobe.com/public/account/107442/accountassets/107442/badges/8f41853356a8453d9e263f39d4377d74/badge_blackbelt.png"
  ); */
  const [img] = useState(
    "./images/Asset_7_4x.png"
  );

  useEffect(() => {
    console.log(searchParams.has('gg'));
    const token = localStorage.getItem("access_token")
    if (!searchParams.has('cid')) return;
    let url = `https://learningmanager.adobe.com/app/player?lo_id=${searchParams.get('cid')}&access_token=${token}`;
    if (searchParams.has('mid')) {
      url = url + `&module_id=${searchParams.get('mid')}`;
    }
    if (searchParams.has('preview')) {
      url = url + `&preview=true&no_reporting=true`;
    }
    if (iframeRef.current) {
      iframeRef.current.src = url;
      window.addEventListener("message", function closePlayer(event) {
        if (event.data === "status:close") {
          window.removeEventListener("message", closePlayer);
          localStorage.setItem("previousPathname", "/fludicPlayer");
          navigate(searchParams.get('back_url') || '/');
        }
      });
    }
  }, [searchParams]);

  return (
    <>
      <iframe
        ref={iframeRef}
        scrolling="no"
        id="pplayer_iframe"
        name="pfplayer_frame"
        allowTransparency={true}
        allowFullScreen
        title="Player"
        style={{
          display: "block",
          background: "#000",
          border: "none",
          height: "100vh",
          width: "100vw"
        }}
      />
      <ModalforSuccess
        show={showModal}
        handleClose={() => setShowModal(false)}
        msg={errorMsg}
        title={title}
        imageUrl={img}
      />
    </>
  );
}

export default FluidicPlayer;
