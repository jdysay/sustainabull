import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

export default function SignUp() {
  return (
    <div className="min-h-screen bg-blue-200 flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md relative z-10">
        <CardHeader>
          <CardTitle className="text-4xl text-blue-600 text-center font-pixel">Sign Up</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="First Name"
                className="border-b border-t-0 border-x-0 rounded-none bg-transparent placeholder:text-gray-500"
              />
            </div>
            <div>
              <Input
                type="text"
                placeholder="Last Name"
                className="border-b border-t-0 border-x-0 rounded-none bg-transparent placeholder:text-gray-500"
              />
            </div>
            <div>
              <Input
                type="email"
                placeholder="Email"
                className="border-b border-t-0 border-x-0 rounded-none bg-transparent placeholder:text-gray-500"
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Password"
                className="border-b border-t-0 border-x-0 rounded-none bg-transparent placeholder:text-gray-500"
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Confirm Password"
                className="border-b border-t-0 border-x-0 rounded-none bg-transparent placeholder:text-gray-500"
              />
            </div>
            <Button className="w-full bg-gray-500 hover:bg-gray-600 text-white font-pixel">Sign Up</Button>
          </form>

          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-500 hover:underline">
              Log in
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Separator className="flex-1" />
            <span className="text-gray-500 text-sm">OR</span>
            <Separator className="flex-1" />
          </div>

          <Button variant="outline" className="w-full bg-blue-200 hover:bg-blue-300 border-none font-pixel">
            <img src="/google.svg" alt="Google logo" className="w-5 h-5 mr-2" />
            Sign in with Google
          </Button>
        </CardContent>
      </Card>

      {/* Background decoration */}
      <div
        className="fixed inset-0 z-0 opacity-50"
        style={{
          backgroundImage: `url(${encodeURI("https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Sign%20Up-orKYx97PfCRnLShLqwas24kGx3YbOk.png")})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
    </div>
  )
}

