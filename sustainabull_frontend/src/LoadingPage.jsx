import { useNavigate } from "react-router-dom";
import './App.css'; 
import Cloud1Image from "/src/assets/images/cloud1.png";
import Cloud2Image from "/src/assets/images/cloud2.png";
import TopCloudImage1 from "/src/assets/images/top-cloud1.png";
import TopCloudImage2 from "/src/assets/images/top-cloud2.png";
import BarImage from "/src/assets/images/bar.png";

function LoadingPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-blue-100 relative">
            {/* Top Clouds */}
            <div className="absolute top-0 left-0 w-full flex justify-between">
                 <img src={TopCloudImage1} alt="Cloud" className="w-64 h-auto absolute left-0 z-10" />
                 <img src={TopCloudImage2} alt="Cloud" className="w-64 h-auto absolute right-0 z-20" />
            </div>

            <div className="relative flex items-center justify-center">
                {/* Loading Bar Image */}
                <img src={BarImage} alt="loading" className="w-64 h-auto" />

                {/* Text on top of the image */}
                <p className="absolute text-white text-xl font-bold">Loading...</p>
            </div>


            {/* Bottom Clouds */}
            <div className="absolute bottom-40 left-0 w-full flex justify-between">
                <img src={Cloud1Image} alt="Cloud" className="w-64 h-auto absolute left-0 z-10" />
                <img src={Cloud2Image} alt="Cloud" className="w-64 h-auto absolute right-0 z-20" />
            </div>
        </div>
    );
}


export default LoadingPage;
