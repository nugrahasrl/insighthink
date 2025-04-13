"use client"

import type React from "react"

import { useState } from "react"
import { Search, HelpCircle, FileText, Users, ExternalLink } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SupportFaq from "./support-faq"
import ContactForm from "./contact-form"

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">How can we help?</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Find answers to your questions and get the help you need with our support resources.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-xl mx-auto mb-12">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search for help articles..."
            className="pl-10 h-12"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {searchQuery && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-md shadow-md z-10 p-2">
            <p className="text-sm text-muted-foreground p-2">Showing results for &quot;{searchQuery}&quot;...</p>
          </div>
        )}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="faq" className="mb-12">
        <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="contact">Contact Us</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="faq" className="mt-6">
          <SupportFaq />
        </TabsContent>

        <TabsContent value="contact" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Support</CardTitle>
              <CardDescription>Fill out the form below to get in touch with our support team.</CardDescription>
            </CardHeader>
            <CardContent>
              <ContactForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <ResourceCard
              icon={<FileText className="h-8 w-8" />}
              title="Documentation"
              description="Browse our comprehensive documentation to learn how to use our platform."
              link="#"
              linkText="View Documentation"
            />
            <ResourceCard
              icon={<Users className="h-8 w-8" />}
              title="Community Forum"
              description="Join our community forum to connect with other users and share knowledge."
              link="#"
              linkText="Visit Forum"
            />
            <ResourceCard
              icon={<HelpCircle className="h-8 w-8" />}
              title="Video Tutorials"
              description="Watch step-by-step video tutorials to master our platform features."
              link="#"
              linkText="Watch Tutorials"
            />
          </div>
        </TabsContent>
      </Tabs>

      {/* Quick Help Section */}
      <div className="bg-muted rounded-lg p-6 mb-12">
        <h2 className="text-2xl font-bold mb-4">Need immediate help?</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex items-start gap-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <HelpCircle className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">Live Chat</h3>
              <p className="text-sm text-muted-foreground">
                Chat with our support team in real-time during business hours.
              </p>
              <Button variant="link" className="px-0 h-auto">
                Start Chat
              </Button>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">Community Support</h3>
              <p className="text-sm text-muted-foreground">Get help from our community of users and experts.</p>
              <Button variant="link" className="px-0 h-auto">
                Join Community
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ResourceCard({
  icon,
  title,
  description,
  link,
  linkText,
}: {
  icon: React.ReactNode
  title: string
  description: string
  link: string
  linkText: string
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="mb-4 text-primary">{icon}</div>
        <h3 className="text-xl font-medium mb-2">{title}</h3>
        <p className="text-muted-foreground mb-4">{description}</p>
        <a href={link} className="inline-flex items-center text-sm font-medium text-primary">
          {linkText}
          <ExternalLink className="ml-1 h-4 w-4" />
        </a>
      </CardContent>
    </Card>
  )
}

