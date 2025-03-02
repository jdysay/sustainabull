import './App.css'; // Your styles if needed
import CowImage from "/src/assets/images/cow.png?import";
import TitleImage from "/src/assets/images/title.png"
import Cloud1Image from "/src/assets/images/cloud1.png"
import Cloud2Image from "/src/assets/images/cloud2.png"

function App() {
  return (
    <div className="min-h-screen w-96 bg-gradient-to-b from-custom-blue-dark to-custom-blue-light flex flex-col items-center justify-center relative">
       <img
        src={TitleImage}
        alt="Title"
        className="w-64 h-auto"
      />
      <img
        src={CowImage}
        alt="Cow"
        className="w-48 h-auto"
      />
      <img
        src={Cloud1Image}
        alt="Cloud"
        className="w-64 h-auto"
      />
       <img
        src={Cloud2Image}
        alt="Cloud"
        className="w-64 h-auto"
      />
    </div>
  );
}

export default App;
