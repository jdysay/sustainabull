import '/src/App.css';
import Cloud1Image from "/src/assets/images/cloud1.png";
import Cloud2Image from "/src/assets/images/cloud2.png";
import TopCloudImage1 from "/src/assets/images/top-cloud1.png";
import TopCloudImage2 from "/src/assets/images/top-cloud2.png";

function PreOnboarding1() {
    
    return (
        <div className="min-h-screen w-[400px] flex flex-col items-center justify-center bg-custom-blue-light relative">
            {/* Top Clouds */}
            <div className="absolute top-0 left-0 w-full flex justify-center">
                <img src={TopCloudImage1} alt="Cloud" className="w-64 h-auto absolute left-0 z-10" />
                <img src={TopCloudImage2} alt="Cloud" className="w-64 h-auto absolute right-0 z-20" />
            </div>

            {/* White Login Box */}
            <div className="w-[300px] bg-white p-6 rounded-lg shadow-lg flex flex-col items-center z-30">
                <h1 className="text-4xl font-bold mb-4">Reason #1</h1>
               
            </div>

            {/* Bottom Clouds */}
            <div className="absolute bottom-40 left-0 w-full flex justify-center">
                <img src={Cloud1Image} alt="Cloud" className="w-64 h-auto absolute left-0 z-10" />
                <img src={Cloud2Image} alt="Cloud" className="w-64 h-auto absolute right-0 z-20" />
            </div>
        </div>
    );
}

export default PreOnboarding1;
