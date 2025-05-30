import Link from "next/link"
import { MessageSquare, BarChart2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)]">
      {/* Hero Section with GM Background - Fallback version without Next/Image */}
      <div className="relative overflow-hidden">
        {/* Background color as fallback */}
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-gm-darkblue to-gm-blue">
          {/* Try to load image with regular img tag as fallback */}
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/EV_Lineup_Full_DT_V2.jpg-wXiWgmMD6Wlk16apXiYBdOduzVeZcL.jpeg"
            alt="GM Electric Vehicle Lineup"
            className="absolute inset-0 w-full h-full object-cover object-center opacity-70"
            style={{ objectPosition: "center 30%" }}
            onError={(e) => {
              e.currentTarget.style.opacity = "0"
            }}
          />
          {/* Overlay gradient for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-gm-darkblue/90 via-gm-darkblue/70 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 py-24 md:py-36 lg:py-40 text-white">
          <div className="flex flex-col items-start space-y-6 max-w-2xl">
            <div className="bg-white p-2 rounded-lg">
              <img
                src="/images/gm-logo-2021.png"
                alt="General Motors"
                className="h-16 w-auto"
                onError={(e) => {
                  e.currentTarget.style.display = "none"
                }}
              />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">GM AI Tools Platform</h1>
            <p className="text-xl md:text-2xl text-gray-100">
              Potenciando la innovación con inteligencia artificial para mejorar la experiencia de nuestros clientes y
              empleados
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Link href="/chat">
                <Button size="lg" className="w-full sm:w-auto gap-2 bg-white text-gm-blue hover:bg-gray-100">
                  <MessageSquare className="h-5 w-5" />
                  AI Best Practices Chatbot
                </Button>
              </Link>
              <Link href="/analyzer">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto gap-2 border-white text-white hover:bg-white/10"
                >
                  <BarChart2 className="h-5 w-5" />
                  Video Sentiment Analyzer
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white dark:from-gm-darknavy to-transparent"></div>
      </div>

      {/* Rest of the page content remains the same */}
      {/* ... */}
    </div>
  )
}
