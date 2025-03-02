import './App.css'; 
import CowImage from "/src/assets/images/cow.png";
import TitleImage from "/src/assets/images/title.png"
import Cloud1Image from "/src/assets/images/cloud1.png"
import Cloud2Image from "/src/assets/images/cloud2.png"

function App() {
  return (
    <div className="min-h-screen w-128 bg-gradient-to-b from-custom-blue-dark to-custom-blue-light flex flex-col items-center justify-between relative">
       <div className="flex-grow-[1]"></div>
      {/* Title and Cow in the center */}
      <div className="flex flex-col items-center mb-6">
        <img src={TitleImage} alt="Title" className="w-96 h-auto" />
        <img src={CowImage} alt="Cow" className="w-64 h-auto" />
      </div>

      <div className="flex-grow-[1]"></div>

      <div className="flex justify-center space-x-0 pb-4">
        <img
            src={Cloud1Image}
            alt="Cloud"
            className="w-64 h-auto absolute bottom-0 left-0 z-10"
          />
          <img
            src={Cloud2Image}
            alt="Cloud"
            className="w-64 h-auto absolute bottom-0 left-40 z-20" 
          />
      </div>
    </div>
  );
}

export default App;
