'use client' // Required for client-side interactivity

import { useRouter } from "next/navigation" // Correct import path
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function LandingPage() {
  const router = useRouter()

  return (
    <main className="container mx-auto px-4 py-8">
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          Welcome to Insighthink
        </h1>
        <p className="text-muted-foreground mb-6">
          Start your learning journey with us
        </p>
        <Button onClick={() => router.push('/login')}>Get Started</Button>
      </section>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-2">Reading Curated Books</h2>
          <p className="text-muted-foreground">
            Saving your reading book list and get recommendation
          </p>
          <img src="/Online-Learning-5--Streamline-Milano.png" alt=""/>
        </Card>
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-2">Sharing your learning journey</h2>
          <p className="text-muted-foreground">
            Share to your friends
          </p>
          <img src="/Inspire-Others-1--Streamline-Milano.png" alt="" />
        </Card>
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-2">Make and join The Community</h2>
          <p className="text-muted-foreground">
            Join the community and share your knowledge
          </p>
          <img src="/Facetime-Meeting-3--Streamline-Milano.png" alt="" />
        </Card>
      </div>
    </main>
  )
}