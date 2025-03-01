import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"

export default function CommunityEvents() {
  const events = [
    {
      id: 1,
      title: "Event Title",
      date: "Time and Date",
      duration: "Event Duration - Event Duration",
    },
    {
      id: 2,
      title: "Event Title",
      date: "Time and Date",
      duration: "Event Duration - Event Duration",
    },
    {
      id: 3,
      title: "Event Title",
      date: "Time and Date",
      duration: "Event Duration - Event Duration",
    },
    {
      id: 4,
      title: "Event Title",
      date: "Time and Date",
      duration: "Event Duration - Event Duration",
    },
    {
      id: 5,
      title: "Event Title",
      date: "Time and Date",
      duration: "Event Duration - Event Duration",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 to-blue-400 flex flex-col">
      <div className="container max-w-md mx-auto px-4 pt-4 pb-20">
        <Tabs defaultValue="community" className="w-full">
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

        <div className="mt-6">
          <h2 className="text-white mb-4">UPCOMING EVENTS</h2>
          <div className="space-y-4">
            {events.map((event) => (
              <Card key={event.id} className="flex p-3 bg-white rounded-lg">
                <div className="w-24 h-24 bg-gray-100 rounded-md mr-3" />
                <div className="flex flex-col justify-center">
                  <h3 className="text-orange-500 font-medium">{event.title}</h3>
                  <p className="text-gray-600 text-sm">{event.date}</p>
                  <p className="text-gray-600 text-sm">{event.duration}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 w-full flex flex-col items-center">
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Community%20-%201-edZRMKIYD3zlXtWwLhTHAjEoVo8zfM.png"
          alt="Decorative pixel art"
          className="w-32 h-32 object-contain"
        />
        <button className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
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

