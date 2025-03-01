import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Leaf } from "lucide-react"

export default function EventsCalendar() {
  const daysInMonth = Array.from({ length: 35 }, (_, i) => i + 1)
  const markedDates = [8, 24] // Example dates with leaf icons

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 to-blue-400 flex flex-col">
      <div className="container max-w-md mx-auto px-4 pt-4 pb-20">
        {/* Navigation Tabs */}
        <Tabs defaultValue="events" className="w-full">
          <TabsList className="bg-transparent border-b border-white/20 rounded-none w-full justify-start h-auto pb-2 gap-8">
            <TabsTrigger
              value="community"
              className="text-white/70 data-[state=active]:text-white data-[state=active]:border-b-2 border-white rounded-none px-0 pb-2"
            >
              COMMUNITY
            </TabsTrigger>
            <TabsTrigger
              value="events"
              className="text-white/70 data-[state=active]:text-white data-[state=active]:border-b-2 border-white rounded-none px-0 pb-2"
            >
              EVENTS
            </TabsTrigger>
            <TabsTrigger
              value="quiz"
              className="text-white/70 data-[state=active]:text-white data-[state=active]:border-b-2 border-white rounded-none px-0 pb-2"
            >
              QUIZ
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Calendar Card */}
        <Card className="mt-6 p-4 bg-white rounded-xl">
          <div className="bg-orange-100 rounded-lg p-4">
            <h2 className="text-center text-2xl font-pixel text-orange-400 mb-4">MARCH</h2>
            <div className="grid grid-cols-7 gap-2">
              {daysInMonth.map((day, index) => (
                <div
                  key={index}
                  className="aspect-square flex items-center justify-center border border-orange-200 bg-white rounded-sm relative"
                >
                  {day <= 31 && (
                    <>
                      <span className="text-sm">{day}</span>
                      {markedDates.includes(day) && <Leaf className="absolute text-green-500 w-3 h-3 top-0 right-0" />}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Rewards Section */}
          <div className="mt-6">
            <h3 className="text-center text-gray-500 mb-4">REWARDS</h3>
            <div className="grid grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-square bg-gray-100 rounded-lg" />
              ))}
            </div>
          </div>
        </Card>

        {/* Upcoming Events */}
        <div className="mt-6">
          <h2 className="text-white mb-4">UPCOMING EVENTS</h2>
          <div className="space-y-4">
            {[1, 2].map((event) => (
              <Card key={event} className="flex p-3 bg-white rounded-lg">
                <div className="w-24 h-24 bg-gray-100 rounded-md mr-3" />
                <div className="flex flex-col justify-center">
                  <h3 className="text-orange-500 font-medium">Event Title</h3>
                  <p className="text-gray-600 text-sm">Time and Date</p>
                  <p className="text-gray-600 text-sm">Event Duration - Event Duration</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Home Button */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2">
        <button className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-6 h-6"
          >
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </button>
      </div>
    </div>
  )
}

