import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Leaf, Map } from "lucide-react"

export default function StartingTrip() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-500 flex flex-col items-center px-4 py-8">
      {/* Title */}
      <h1 className="text-white text-4xl font-pixel text-center mb-8 drop-shadow-lg">Starting trip...</h1>

      {/* Event Card */}
      <Card className="w-full max-w-sm bg-gradient-to-b from-green-200 to-green-300 border-none shadow-lg">
        <div className="p-6 space-y-4">
          {/* Event Header */}
          <div className="text-center space-y-4">
            <h2 className="text-green-700 text-xl font-pixel">Event Title</h2>
            <div className="bg-white rounded-lg p-4 inline-block">
              <Leaf className="w-12 h-12 text-green-500 mx-auto" />
            </div>
          </div>

          {/* Event Details */}
          <div className="text-center text-green-700 space-y-1">
            <p className="text-sm">Time and Date</p>
            <p className="text-sm">Event Duration - Event Duration</p>
          </div>

          {/* Description */}
          <p className="text-green-700 text-sm text-center">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eget consequat leo. Aliquam at imperdiet sem.
            Fusce ut turpis in risus tempestas convallis ut.
          </p>

          {/* Buttons */}
          <div className="space-y-2 pt-4">
            <Button className="w-full bg-green-500 hover:bg-green-600 text-white font-pixel">Start</Button>
            <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-pixel">Go Back</Button>
          </div>
        </div>
      </Card>

      {/* Bottom Section */}
      <div className="fixed bottom-0 w-full max-w-md mx-auto px-4 pb-4">
        <div className="relative">
          {/* Pixel Art Character */}
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Map%20-%20Starting%20new%20trip-bkCyNPS76ng9fs860zwXj9ESDVXbFa.png"
            alt="Pixel art character"
            className="w-32 h-32 mx-auto mb-4 object-contain"
          />

          {/* Map Button */}
          <Button
            size="lg"
            className="absolute left-1/2 -translate-x-1/2 bottom-0 w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700"
          >
            <Map className="w-6 h-6 text-white" />
          </Button>
        </div>
      </div>
    </div>
  )
}

