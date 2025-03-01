import { Button } from "@/components/ui/button"
import { Trophy, ShoppingBag, Calendar, Menu, Map, Smile, Utensils, Footprints } from "lucide-react"

export default function GameInterface() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <div className="flex items-center">
          <div className="bg-white rounded-full px-6 py-2">
            <span className="text-blue-600 font-bold">Level 5</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-white/10 rounded-full px-3 py-1">
            <span className="text-sm">$</span>
            <span className="font-medium ml-1">426</span>
          </div>
          <Button variant="ghost" size="icon" className="text-white">
            <Trophy className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-white">
            <ShoppingBag className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-white">
            <Calendar className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-white">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex justify-center items-center h-[calc(100vh-8rem)]">
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Home-l4OHihU2iRkLnrAXKqdeX0TIQDSyVi.png"
          alt="Pixel art cow"
          className="w-48 h-48 object-contain"
        />
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 w-full">
        <div className="relative">
          {/* Map Button */}
          <Button className="absolute left-1/2 -translate-x-1/2 -top-6 w-14 h-14 rounded-full bg-white shadow-lg hover:bg-gray-100">
            <Map className="h-6 w-6 text-blue-600" />
          </Button>

          {/* Navigation Bar */}
          <div className="bg-blue-600 p-4 flex justify-between items-center px-12">
            <Button variant="secondary" className="w-12 h-12 rounded-xl bg-green-200 hover:bg-green-300">
              <Smile className="h-6 w-6 text-green-700" />
            </Button>
            <Button variant="secondary" className="w-12 h-12 rounded-xl bg-green-200 hover:bg-green-300">
              <Utensils className="h-6 w-6 text-green-700" />
            </Button>
            <Button variant="secondary" className="w-12 h-12 rounded-xl bg-yellow-200 hover:bg-yellow-300">
              <span className="text-2xl" role="img" aria-label="poop">
                💩
              </span>
            </Button>
            <Button variant="secondary" className="w-12 h-12 rounded-xl bg-red-200 hover:bg-red-300">
              <Footprints className="h-6 w-6 text-red-700" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

