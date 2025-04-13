"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import {
  Shield,
  Eye,
  Share2,
  UserCog,
  Cookie,
  Mail,
  Clock,
  Info,
  Lock,
  FileText,
  ChevronLeft,
  ChevronRight,
  Search,
  ExternalLink,
} from "lucide-react"
import { Input } from "@/components/ui/input"

export default function PrivacyClientPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <PrivacyPolicy />
    </div>
  )
}

function PrivacyPolicy() {
  const [activeTab, setActiveTab] = useState("overview")
  const [searchQuery, setSearchQuery] = useState("")

  // Update active tab
  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  // Get the next tab
  const getNextTab = () => {
    const tabs = ["overview", "collection", "usage", "sharing", "rights", "security", "cookies", "contact"]
    const currentIndex = tabs.indexOf(activeTab)
    return tabs[(currentIndex + 1) % tabs.length]
  }

  // Get the previous tab
  const getPrevTab = () => {
    const tabs = ["overview", "collection", "usage", "sharing", "rights", "security", "cookies", "contact"]
    const currentIndex = tabs.indexOf(activeTab)
    return tabs[(currentIndex - 1 + tabs.length) % tabs.length]
  }

  return (
    <Card className="max-w-4xl mx-auto shadow-lg">
      <CardHeader className="border-b bg-muted/50">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <Badge variant="outline" className="mb-2">
              Updated April 2025
            </Badge>
            <CardTitle className="text-2xl md:text-3xl font-bold">Privacy Policy</CardTitle>
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search policy..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={handleTabChange} className="w-full">
        <div className="px-6 pt-6 overflow-auto">
          <TabsList className="w-full justify-start overflow-x-auto flex-nowrap whitespace-nowrap pb-1">
            <TabsTrigger value="overview" className="flex items-center gap-1">
              <Info className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="collection" className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span className="hidden sm:inline">Collection</span>
            </TabsTrigger>
            <TabsTrigger value="usage" className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Usage</span>
            </TabsTrigger>
            <TabsTrigger value="sharing" className="flex items-center gap-1">
              <Share2 className="h-4 w-4" />
              <span className="hidden sm:inline">Sharing</span>
            </TabsTrigger>
            <TabsTrigger value="rights" className="flex items-center gap-1">
              <UserCog className="h-4 w-4" />
              <span className="hidden sm:inline">Your Rights</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-1">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger value="cookies" className="flex items-center gap-1">
              <Cookie className="h-4 w-4" />
              <span className="hidden sm:inline">Cookies</span>
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex items-center gap-1">
              <Mail className="h-4 w-4" />
              <span className="hidden sm:inline">Contact</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <CardContent className="pt-6">
          <ScrollArea className="h-[450px] pr-4">
            <TabsContent value="overview" className="mt-0 space-y-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Privacy at Insighthink</h3>
                <p>
                  At Insighthink, we take your privacy seriously. This Privacy Policy explains how we collect,
                  use, disclose, and safeguard your information when you use our platform and services.
                </p>

                <div className="bg-muted p-4 rounded-lg border border-muted">
                  <h4 className="font-medium flex items-center gap-2">
                    <Clock className="h-5 w-5 text-purple-500" />
                    Last Updated
                  </h4>
                  <p className="text-sm mt-2">This Privacy Policy was last updated on April 5, 2025.</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-medium">Quick Summary</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="bg-muted/30">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Eye className="h-5 w-5 text-purple-500 mt-0.5" />
                        <div>
                          <h5 className="font-medium">Information We Collect</h5>
                          <p className="text-sm text-muted-foreground">
                            Account information, usage data, and communications
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-muted/30">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <FileText className="h-5 w-5 text-purple-500 mt-0.5" />
                        <div>
                          <h5 className="font-medium">How We Use It</h5>
                          <p className="text-sm text-muted-foreground">
                            Provide services, improve platform, personalize experience
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-muted/30">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Share2 className="h-5 w-5 text-purple-500 mt-0.5" />
                        <div>
                          <h5 className="font-medium">Information Sharing</h5>
                          <p className="text-sm text-muted-foreground">
                            Service providers, legal requirements, with consent
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-muted/30">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <UserCog className="h-5 w-5 text-purple-500 mt-0.5" />
                        <div>
                          <h5 className="font-medium">Your Rights</h5>
                          <p className="text-sm text-muted-foreground">Access, correct, delete, and export your data</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-medium">Scope of This Policy</h4>
                <p>
                  This Privacy Policy applies to all information collected through our platform, website, and any
                  related services, sales, marketing, or events.
                </p>
                <p className="text-sm text-muted-foreground">
                  By using our platform, you consent to the collection, use, and disclosure of your information as
                  described in this Privacy Policy.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="collection" className="mt-0 space-y-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Information We Collect</h3>
                <p>We collect several types of information from and about users of our platform.</p>
              </div>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="personal-info">
                  <AccordionTrigger>Personal Information</AccordionTrigger>
                  <AccordionContent className="space-y-2">
                    <p>We may collect the following personal information:</p>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Name, email address, and contact details</li>
                      <li>Account credentials</li>
                      <li>Billing information and payment details</li>
                      <li>Profile information and preferences</li>
                      <li>Educational background and learning objectives</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="usage-data">
                  <AccordionTrigger>Usage Data</AccordionTrigger>
                  <AccordionContent className="space-y-2">
                    <p>We automatically collect certain information when you visit, use, or navigate our platform:</p>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Device and connection information</li>
                      <li>Browser and operating system details</li>
                      <li>IP address and location information</li>
                      <li>Pages you view and features you use</li>
                      <li>Time spent on platform and learning activities</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="learning-data">
                  <AccordionTrigger>Learning Data</AccordionTrigger>
                  <AccordionContent className="space-y-2">
                    <p>As an educational platform, we collect data related to your learning:</p>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Course progress and completion status</li>
                      <li>Assessment results and quiz scores</li>
                      <li>Engagement metrics and participation data</li>
                      <li>Learning preferences and style indicators</li>
                      <li>Feedback and survey responses</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="third-party">
                  <AccordionTrigger>Information from Third Parties</AccordionTrigger>
                  <AccordionContent className="space-y-2">
                    <p>We may receive information about you from other sources:</p>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Social media profiles when you connect them</li>
                      <li>Educational institutions if you're enrolled through them</li>
                      <li>Partners we collaborate with for integrated services</li>
                      <li>Public databases and publicly available sources</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <div className="bg-purple-50 dark:bg-purple-950/20 p-4 rounded-lg border border-purple-100 dark:border-purple-900">
                <h4 className="font-medium flex items-center gap-2 text-purple-700 dark:text-purple-300">
                  <Info className="h-5 w-5" />
                  Information You Provide Voluntarily
                </h4>
                <p className="text-sm mt-2 text-purple-700 dark:text-purple-300">
                  Some information is collected only when you choose to provide it, such as when you create an account,
                  update your profile, participate in discussions, or contact our support team.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="usage" className="mt-0 space-y-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">How We Use Your Information</h3>
                <p>
                  We use the information we collect for various purposes related to providing, maintaining, and
                  improving our platform and services.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="bg-purple-100 dark:bg-purple-900/50 p-2 rounded-full">
                      <FileText className="h-5 w-5 text-purple-600 dark:text-purple-300" />
                    </div>
                    <h4 className="font-medium">Provide and Manage Services</h4>
                  </div>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Create and manage your account</li>
                    <li>Deliver educational content and resources</li>
                    <li>Process payments and transactions</li>
                    <li>Fulfill your requests and respond to inquiries</li>
                    <li>Provide customer support and assistance</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="bg-purple-100 dark:bg-purple-900/50 p-2 rounded-full">
                      <UserCog className="h-5 w-5 text-purple-600 dark:text-purple-300" />
                    </div>
                    <h4 className="font-medium">Personalize Your Experience</h4>
                  </div>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Customize content based on your preferences</li>
                    <li>Recommend courses and learning paths</li>
                    <li>Adapt difficulty levels to your progress</li>
                    <li>Remember your settings and preferences</li>
                    <li>Provide personalized feedback and guidance</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="bg-purple-100 dark:bg-purple-900/50 p-2 rounded-full">
                      <Shield className="h-5 w-5 text-purple-600 dark:text-purple-300" />
                    </div>
                    <h4 className="font-medium">Security and Protection</h4>
                  </div>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Protect against unauthorized access</li>
                    <li>Detect and prevent fraudulent activities</li>
                    <li>Ensure platform security and integrity</li>
                    <li>Verify identity for sensitive operations</li>
                    <li>Comply with legal obligations</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="bg-purple-100 dark:bg-purple-900/50 p-2 rounded-full">
                      <FileText className="h-5 w-5 text-purple-600 dark:text-purple-300" />
                    </div>
                    <h4 className="font-medium">Improve and Develop</h4>
                  </div>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Analyze usage patterns and trends</li>
                    <li>Identify areas for improvement</li>
                    <li>Develop new features and content</li>
                    <li>Test and debug platform functionality</li>
                    <li>Conduct research to enhance learning outcomes</li>
                  </ul>
                </div>
              </div>

              <div className="bg-muted p-4 rounded-lg border border-muted">
                <h4 className="font-medium">Legal Basis for Processing</h4>
                <p className="text-sm mt-2">
                  We process your information based on one or more of the following legal grounds:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-sm mt-2">
                  <li>
                    <span className="font-medium">Consent:</span> When you have given us permission to process your data
                    for specific purposes.
                  </li>
                  <li>
                    <span className="font-medium">Contract:</span> When processing is necessary to fulfill our
                    contractual obligations to you.
                  </li>
                  <li>
                    <span className="font-medium">Legitimate Interests:</span> When we have a legitimate business
                    interest in processing your information.
                  </li>
                  <li>
                    <span className="font-medium">Legal Obligation:</span> When we need to comply with a legal
                    requirement.
                  </li>
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="sharing" className="mt-0 space-y-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Information Sharing and Disclosure</h3>
                <p>We may share your information in certain circumstances and with specific third parties.</p>
              </div>

              <div className="space-y-5">
                <div className="bg-muted/30 p-4 rounded-lg border">
                  <h4 className="font-medium flex items-center gap-2">
                    <Share2 className="h-5 w-5 text-purple-500" />
                    Service Providers
                  </h4>
                  <p className="text-sm mt-2">
                    We may share your information with third-party vendors, service providers, contractors, or agents
                    who perform services for us or on our behalf and require access to such information to do that work.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Badge variant="outline" className="bg-muted/50">
                      Payment processors
                    </Badge>
                    <Badge variant="outline" className="bg-muted/50">
                      Cloud hosting providers
                    </Badge>
                    <Badge variant="outline" className="bg-muted/50">
                      Analytics services
                    </Badge>
                    <Badge variant="outline" className="bg-muted/50">
                      Customer support tools
                    </Badge>
                  </div>
                </div>

                <div className="bg-muted/30 p-4 rounded-lg border">
                  <h4 className="font-medium flex items-center gap-2">
                    <Share2 className="h-5 w-5 text-purple-500" />
                    Business Transfers
                  </h4>
                  <p className="text-sm mt-2">
                    If we are involved in a merger, acquisition, financing, reorganization, bankruptcy, or sale of
                    company assets, your information may be transferred as part of that transaction.
                  </p>
                </div>

                <div className="bg-muted/30 p-4 rounded-lg border">
                  <h4 className="font-medium flex items-center gap-2">
                    <Share2 className="h-5 w-5 text-purple-500" />
                    Legal Requirements
                  </h4>
                  <p className="text-sm mt-2">
                    We may disclose your information where we are legally required to do so in order to comply with
                    applicable law, governmental requests, judicial proceedings, court orders, or legal processes.
                  </p>
                </div>

                <div className="bg-muted/30 p-4 rounded-lg border">
                  <h4 className="font-medium flex items-center gap-2">
                    <Share2 className="h-5 w-5 text-purple-500" />
                    With Your Consent
                  </h4>
                  <p className="text-sm mt-2">
                    We may share your information with your consent or at your direction, such as when you authorize a
                    third-party application to access your account.
                  </p>
                </div>
              </div>

              <div className="bg-purple-50 dark:bg-purple-950/20 p-4 rounded-lg border border-purple-100 dark:border-purple-900">
                <h4 className="font-medium flex items-center gap-2 text-purple-700 dark:text-purple-300">
                  <Info className="h-5 w-5" />
                  International Data Transfers
                </h4>
                <p className="text-sm mt-2 text-purple-700 dark:text-purple-300">
                  Your information may be transferred to, and maintained on, computers located outside of your state,
                  province, country, or other governmental jurisdiction where the data protection laws may differ from
                  those in your jurisdiction.
                </p>
                <p className="text-sm mt-2 text-purple-700 dark:text-purple-300">
                  If you are located outside the United States and choose to provide information to us, please note that
                  we transfer the data to the United States and process it there.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="rights" className="mt-0 space-y-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Your Privacy Rights</h3>
                <p>Depending on your location, you may have certain rights regarding your personal information.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <Eye className="h-5 w-5 text-purple-500" />
                      <h4 className="font-medium">Right to Access</h4>
                    </div>
                    <p className="text-sm">
                      You have the right to request copies of your personal information that we hold.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-purple-500" />
                      <h4 className="font-medium">Right to Rectification</h4>
                    </div>
                    <p className="text-sm">
                      You have the right to request that we correct any information you believe is inaccurate or
                      incomplete.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <UserCog className="h-5 w-5 text-purple-500" />
                      <h4 className="font-medium">Right to Erasure</h4>
                    </div>
                    <p className="text-sm">
                      You have the right to request that we erase your personal information, under certain conditions.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <Lock className="h-5 w-5 text-purple-500" />
                      <h4 className="font-medium">Right to Restrict Processing</h4>
                    </div>
                    <p className="text-sm">
                      You have the right to request that we restrict the processing of your personal information, under
                      certain conditions.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <Share2 className="h-5 w-5 text-purple-500" />
                      <h4 className="font-medium">Right to Data Portability</h4>
                    </div>
                    <p className="text-sm">
                      You have the right to request that we transfer the data we have collected to another organization,
                      or directly to you, under certain conditions.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-purple-500" />
                      <h4 className="font-medium">Right to Object</h4>
                    </div>
                    <p className="text-sm">
                      You have the right to object to our processing of your personal information, under certain
                      conditions.
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="bg-muted p-4 rounded-lg border border-muted">
                <h4 className="font-medium">How to Exercise Your Rights</h4>
                <p className="text-sm mt-2">
                  To exercise your rights, please contact us using the information provided in the Contact section. We
                  will respond to your request within a reasonable timeframe, typically within 30 days.
                </p>
                <p className="text-sm mt-2">
                  Please note that we may ask you to verify your identity before responding to such requests, and in
                  some cases, we may be legally entitled to decline your request.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="security" className="mt-0 space-y-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Data Security</h3>
                <p>
                  We have implemented appropriate technical and organizational security measures designed to protect the
                  security of any personal information we process.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-purple-100 dark:bg-purple-900/50 p-2 rounded-full mt-1">
                    <Lock className="h-5 w-5 text-purple-600 dark:text-purple-300" />
                  </div>
                  <div>
                    <h4 className="font-medium">Encryption and Protection</h4>
                    <p className="text-sm mt-1">
                      We use encryption to protect sensitive information transmitted online, and we also protect your
                      information offline. Only employees who need the information to perform a specific job are granted
                      access to personally identifiable information.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-purple-100 dark:bg-purple-900/50 p-2 rounded-full mt-1">
                    <Shield className="h-5 w-5 text-purple-600 dark:text-purple-300" />
                  </div>
                  <div>
                    <h4 className="font-medium">Regular Security Assessments</h4>
                    <p className="text-sm mt-1">
                      We regularly review our security procedures to consider appropriate new technology and methods.
                      However, despite our best efforts, no security measures are perfect or impenetrable.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-purple-100 dark:bg-purple-900/50 p-2 rounded-full mt-1">
                    <UserCog className="h-5 w-5 text-purple-600 dark:text-purple-300" />
                  </div>
                  <div>
                    <h4 className="font-medium">Account Security</h4>
                    <p className="text-sm mt-1">
                      You are responsible for maintaining the secrecy of your unique password and account information.
                      We encourage you to use strong passwords and enable two-factor authentication where available.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 dark:bg-purple-950/20 p-4 rounded-lg border border-purple-100 dark:border-purple-900">
                <h4 className="font-medium flex items-center gap-2 text-purple-700 dark:text-purple-300">
                  <Info className="h-5 w-5" />
                  Data Breach Notification
                </h4>
                <p className="text-sm mt-2 text-purple-700 dark:text-purple-300">
                  In the event of a data breach that affects your personal information, we will notify you and the
                  relevant authorities as required by applicable law.
                </p>
              </div>

              <div className="bg-muted p-4 rounded-lg border border-muted">
                <h4 className="font-medium">Data Retention</h4>
                <p className="text-sm mt-2">
                  We will retain your personal information only for as long as is necessary for the purposes set out in
                  this Privacy Policy. We will retain and use your information to the extent necessary to comply with
                  our legal obligations, resolve disputes, and enforce our policies.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="cookies" className="mt-0 space-y-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Cookies and Tracking Technologies</h3>
                <p>
                  We use cookies and similar tracking technologies to track activity on our platform and store certain
                  information.
                </p>
              </div>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="what-are-cookies">
                  <AccordionTrigger>What Are Cookies?</AccordionTrigger>
                  <AccordionContent className="space-y-2">
                    <p>
                      Cookies are small data files that are placed on your device when you visit a website. Cookies are
                      widely used by website owners to make their websites work, or to work more efficiently, as well as
                      to provide reporting information.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Cookies set by the website owner (in this case, InsightThink Learning) are called "first-party
                      cookies". Cookies set by parties other than the website owner are called "third-party cookies".
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="types-of-cookies">
                  <AccordionTrigger>Types of Cookies We Use</AccordionTrigger>
                  <AccordionContent className="space-y-3">
                    <div>
                      <h5 className="font-medium">Essential Cookies</h5>
                      <p className="text-sm">
                        These cookies are necessary for the website to function and cannot be switched off in our
                        systems. They are usually only set in response to actions made by you which amount to a request
                        for services, such as setting your privacy preferences, logging in, or filling in forms.
                      </p>
                    </div>

                    <div>
                      <h5 className="font-medium">Performance Cookies</h5>
                      <p className="text-sm">
                        These cookies allow us to count visits and traffic sources so we can measure and improve the
                        performance of our site. They help us to know which pages are the most and least popular and see
                        how visitors move around the site.
                      </p>
                    </div>

                    <div>
                      <h5 className="font-medium">Functional Cookies</h5>
                      <p className="text-sm">
                        These cookies enable the website to provide enhanced functionality and personalization. They may
                        be set by us or by third-party providers whose services we have added to our pages.
                      </p>
                    </div>

                    <div>
                      <h5 className="font-medium">Targeting Cookies</h5>
                      <p className="text-sm">
                        These cookies may be set through our site by our advertising partners. They may be used by those
                        companies to build a profile of your interests and show you relevant advertisements on other
                        sites.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="managing-cookies">
                  <AccordionTrigger>Managing Your Cookie Preferences</AccordionTrigger>
                  <AccordionContent className="space-y-2">
                    <p>
                      You can set your browser to refuse all or some browser cookies, or to alert you when websites set
                      or access cookies. If you disable or refuse cookies, please note that some parts of this website
                      may become inaccessible or not function properly.
                    </p>
                    <Button variant="outline" size="sm" className="mt-2">
                      Cookie Preferences <ExternalLink className="ml-2 h-3 w-3" />
                    </Button>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <div className="bg-muted p-4 rounded-lg border border-muted">
                <h4 className="font-medium">Other Tracking Technologies</h4>
                <p className="text-sm mt-2">
                  In addition to cookies, we may use web beacons, pixel tags, and other tracking technologies to help
                  customize our platform and improve your experience.
                </p>
                <p className="text-sm mt-2">
                  We may also use third-party analytics services, such as Google Analytics, to collect and analyze
                  information about how users interact with our platform and to generate reports about website activity
                  and internet usage.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="contact" className="mt-0 space-y-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Contact Us</h3>
                <p>If you have questions or comments about this Privacy Policy, please contact us.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-2">
                      <Mail className="h-5 w-5 text-purple-500" />
                      <h4 className="font-medium">Email Us</h4>
                    </div>
                    <p className="text-sm">For privacy-related inquiries:</p>
                    <p className="text-purple-600 dark:text-purple-400 font-medium">privacy@insightthink.com</p>

                    <p className="text-sm mt-4">For general support:</p>
                    <p className="text-purple-600 dark:text-purple-400 font-medium">support@insightthink.com</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-purple-500" />
                      <h4 className="font-medium">Postal Mail</h4>
                    </div>
                    <p className="text-sm">You can also reach us at:</p>
                    <div className="text-sm">
                      <p>InsightThink Learning, Inc.</p>
                      <p>Privacy Department</p>
                      <p>123 Learning Avenue</p>
                      <p>San Francisco, CA 94103</p>
                      <p>United States</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="bg-purple-50 dark:bg-purple-950/20 p-4 rounded-lg border border-purple-100 dark:border-purple-900">
                <h4 className="font-medium flex items-center gap-2 text-purple-700 dark:text-purple-300">
                  <Clock className="h-5 w-5" />
                  Response Time
                </h4>
                <p className="text-sm mt-2 text-purple-700 dark:text-purple-300">
                  We strive to respond to all legitimate inquiries within 30 days. Occasionally, it may take us longer
                  if your request is particularly complex or you have made a number of requests.
                </p>
              </div>

              <div className="bg-muted p-4 rounded-lg border border-muted">
                <h4 className="font-medium">Changes to This Privacy Policy</h4>
                <p className="text-sm mt-2">
                  We may update our Privacy Policy from time to time. We will notify you of any changes by posting the
                  new Privacy Policy on this page and updating the "Last Updated" date at the top of this Privacy
                  Policy.
                </p>
                <p className="text-sm mt-2">
                  You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy
                  Policy are effective when they are posted on this page.
                </p>
              </div>
            </TabsContent>
          </ScrollArea>
        </CardContent>

        <CardFooter className="flex justify-between border-t px-6 py-4 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleTabChange(getPrevTab())}
            disabled={activeTab === "overview"}
            className="gap-1"
          >
            <ChevronLeft className="h-4 w-4" /> Previous
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handleTabChange(getNextTab())}
            disabled={activeTab === "contact"}
            className="gap-1"
          >
            Next <ChevronRight className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Tabs>
    </Card>
  )
}

