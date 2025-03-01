export default function TripCompleted() {
  return (
    <div className="min-h-screen bg-blue-400 flex flex-col px-4 py-8">
      {/* Title */}
      <h1 className="text-white text-4xl font-pixel text-center mb-8 drop-shadow-lg">Trip completed!</h1>

      {/* Map Card */}
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden mb-6">
        <div className="aspect-square relative">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Map%20-%20Completed-Wo93yzKKTA5nf8Z3KSbzFVdU1kLofq.png"
            alt="Trip route map"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-white rounded-3xl p-6 shadow-lg">
        <h2 className="text-orange-400 font-pixel text-xl mb-6">Travel Summary</h2>

        {/* Route Section */}
        <div className="mb-6">
          <h3 className="text-orange-300 mb-2 font-pixel">ROUTE</h3>
          <div className="space-y-1 pl-4">
            <div className="text-green-600 font-pixel text-sm">+10 EXP</div>
            <div className="text-yellow-500 font-pixel text-sm">+100 COINS</div>
          </div>
        </div>

        {/* Discoveries Section */}
        <div className="mb-6">
          <h3 className="text-orange-300 mb-2 font-pixel">DISCOVERIES</h3>
          <div className="space-y-1 pl-4">
            <div className="text-gray-600 font-pixel text-sm">1x FARMER'S HAT</div>
            <div className="text-gray-600 font-pixel text-sm">1x GOLD TIE</div>
          </div>
        </div>

        {/* Power Ups Section */}
        <div>
          <h3 className="text-orange-300 mb-2 font-pixel">POWER UPS</h3>
          <div className="space-y-1 pl-4">
            <div className="text-gray-600 font-pixel text-sm">2x DOUBLE EXP BOOST</div>
            <div className="text-gray-600 font-pixel text-sm">1x DOUBLE COIN BOOST</div>
          </div>
        </div>
      </div>

      {/* Background Decoration */}
      <div
        className="fixed inset-0 z-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: `url(${encodeURI("https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Map%20-%20Completed-Wo93yzKKTA5nf8Z3KSbzFVdU1kLofq.png")})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
    </div>
  )
}

