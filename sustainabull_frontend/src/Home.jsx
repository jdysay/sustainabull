import cow from './assets/images/cow.png';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-100 to-blue-200 font-mono">

      {/* Top Nav */}
      <div className="flex justify-around bg-blue-600 text-black py-3 text-sm font-bold">
        {['Level', 'Coins', 'Shop', 'Leaderboard', 'Settings'].map((nav) => (
          <button key={nav} className="hover:underline">{nav}</button>
        ))}
      </div>

      {/* Cow Image */}
      <div className="flex-1 flex justify-center items-center">
        <img
          src={cow}
          alt="Cow"
          className="w-[50vw] h-[50vh] object-contain"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-around py-4">
        {['Mood', 'Hunger', 'Poop', 'Walk'].map((action) => (
          <button
            key={action}
            className="bg-green-500 text-white px-6 py-2 rounded-xl shadow-md hover:bg-green-600 transition"
          >
            {action}
          </button>
        ))}
      </div>

      {/* Bottom Nav */}
      <div className="flex justify-around bg-blue-600 text-black py-3 text-sm font-bold">
        {['Inventory', 'Map', 'Farm'].map((nav) => (
          <button key={nav} className="hover:underline">{nav}</button>
        ))}
      </div>
    </div>
  );
}
