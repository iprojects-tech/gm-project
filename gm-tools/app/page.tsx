import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import ExamplePrompts from "@/components/example-prompts"
import Image from "next/image"

export default function Home() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)]">
      {/* Hero Section with GM EV Lineup Background */}
      <div className="relative overflow-hidden">
        {/* Background Image with Next/Image for better loading */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/gm-ev-lineup.jpeg"
            alt="GM Electric Vehicle Lineup"
            fill
            priority
            style={{
              objectFit: "cover",
              objectPosition: "center 30%",
            }}
          />
          {/* Overlay gradient for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-gm-darkblue/90 via-gm-darkblue/70 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 py-24 md:py-36 lg:py-40 text-white">
          <div className="flex flex-col items-start space-y-6 max-w-2xl">
            <div className="bg-white p-2 rounded-lg">
              <Image
                src="/images/gm-logo-2021.png"
                alt="General Motors"
                width={64}
                height={64}
                className="h-16 w-auto"
              />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight uppercase">GM AI TOOLS PLATFORM</h1>
            <p className="text-xl md:text-2xl text-gray-100">
              Powering innovation with artificial intelligence to enhance the experience of our customers and employees
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white dark:from-gm-darknavy to-transparent"></div>
      </div>

      {/* Features Section */}
      <div className="bg-white dark:bg-gm-darknavy py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gm-darkblue dark:text-white uppercase">
            AI-POWERED TOOLS
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-50 dark:bg-gm-navy rounded-xl p-6 shadow-md border border-gray-100 dark:border-gm-blue/20 flex flex-col">
              <div className="rounded-full bg-gm-blue/10 dark:bg-gm-blue/20 p-3 w-fit mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-gm-blue"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gm-darkblue dark:text-white uppercase">
                AI Best Practices Chatbot
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 flex-grow">
                Get advice on workplace best practices, programming standards, safety protocols, and more.
              </p>
              <Link href="/chat">
                <Button
                  variant="ghost"
                  className="text-gm-blue dark:text-gm-lightblue hover:bg-gm-blue/10 dark:hover:bg-gm-blue/20 justify-start group"
                >
                  Start chat
                  <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>

            <div className="bg-gray-50 dark:bg-gm-navy rounded-xl p-6 shadow-md border border-gray-100 dark:border-gm-blue/20 flex flex-col">
              <div className="rounded-full bg-gm-blue/10 dark:bg-gm-blue/20 p-3 w-fit mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-gm-blue"
                >
                  <path d="M18 20V10"></path>
                  <path d="M12 20V4"></path>
                  <path d="M6 20v-6"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gm-darkblue dark:text-white uppercase">
                Video Sentiment Analyzer
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 flex-grow">
                Analyze sentiment in YouTube videos to better understand user reactions and opinions.
              </p>
              <Link href="/analyzer">
                <Button
                  variant="ghost"
                  className="text-gm-blue dark:text-gm-lightblue hover:bg-gm-blue/10 dark:hover:bg-gm-blue/20 justify-start group"
                >
                  Analyze video
                  <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Examples Section */}
      <div className="bg-gray-50 dark:bg-gm-navy/80 py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-2 text-gm-darkblue dark:text-white uppercase">EXAMPLES</h2>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto">
            Explore some examples of how our AI tools can help you in your daily work
          </p>
          <ExamplePrompts />
        </div>
      </div>

      {/* GM Innovation Section */}
      <div className="bg-white dark:bg-gm-darknavy py-16 relative overflow-hidden">
        <div className="absolute inset-0 z-0 bg-gm-blue/5 dark:bg-gm-blue/10"></div>
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 text-gm-darkblue dark:text-white uppercase">
            INNOVATION AT GENERAL MOTORS
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            At GM, we are committed to technological innovation to create a smarter, safer, and more sustainable future
            for our customers and communities.
          </p>
          <div className="flex justify-center">
            <Button className="bg-gm-blue hover:bg-gm-darkblue text-white">Learn more about GM</Button>
          </div>
        </div>
      </div>

      <footer className="border-t border-gray-200 dark:border-gm-blue/20 py-8 bg-white dark:bg-gm-darknavy">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {/* Logo with original colors, no white background */}
              <Image
                src="/images/gm-logo-2021.png"
                alt="General Motors"
                width={32}
                height={32}
                className="h-8 w-auto"
              />
              <span className="text-sm text-gray-500 dark:text-gray-400">
                © {new Date().getFullYear()} General Motors
              </span>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              AI Tools Platform — Powered by General Motors
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
