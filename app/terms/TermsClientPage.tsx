"use client"

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { useState } from "react"
import { ChevronRight, CheckCircle2, AlertCircle } from "lucide-react"

export default function TermsClientPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <TermsAndConditions />
    </div>
  )
}

function TermsAndConditions() {
  const [activeTab, setActiveTab] = useState("overview")
  const [progress, setProgress] = useState(0)
  const [accepted, setAccepted] = useState(false)

  // Update progress when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value)

    // Update progress based on tab
    const tabValues = ["overview", "usage", "privacy", "liability", "agreement"]
    const currentIndex = tabValues.indexOf(value)
    setProgress(((currentIndex + 1) / tabValues.length) * 100)
  }

  return (
    <Card className="max-w-4xl mx-auto shadow-lg">
      <CardHeader className="border-b bg-muted/50">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <CardTitle className="text-2xl md:text-3xl font-bold">Terms and Conditions</CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Reading progress</span>
            <Progress value={progress} className="w-24 md:w-40 h-2" />
            <span>{Math.round(progress)}%</span>
          </div>
        </div>
      </CardHeader>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={handleTabChange} className="w-full">
        <div className="px-6 pt-6 overflow-auto">
          <TabsList className="w-full justify-start overflow-x-auto flex-nowrap whitespace-nowrap pb-1">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="usage">Usage Terms</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="liability">Liability</TabsTrigger>
            <TabsTrigger value="agreement">Agreement</TabsTrigger>
          </TabsList>
        </div>

        <CardContent className="pt-6">
          <ScrollArea className="h-[400px] pr-4">
            <TabsContent value="overview" className="mt-0 space-y-4">
              <h3 className="text-xl font-semibold">Welcome to InsightThink Learning</h3>
              <p>
                These Terms and Conditions govern your use of the InsightThink Learning platform and services. By
                accessing or using our platform, you agree to be bound by these terms.
              </p>

              <div className="bg-muted p-4 rounded-lg border border-muted">
                <h4 className="font-medium flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-amber-500" />
                  Important Notice
                </h4>
                <p className="text-sm mt-2">
                  Please read these terms carefully before using our platform. These terms constitute a legally binding
                  agreement between you and InsightThink Learning.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Last Updated</h4>
                <p className="text-sm text-muted-foreground">April 5, 2025</p>
              </div>

              <div className="flex items-center justify-end">
                <Button variant="outline" size="sm" onClick={() => handleTabChange("usage")} className="gap-1">
                  Continue <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="usage" className="mt-0 space-y-4">
              <h3 className="text-xl font-semibold">Usage Terms</h3>
              <p>The following terms outline how you may use our platform and services.</p>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">1. Account Registration</h4>
                  <p className="text-sm mt-1">
                    You must register for an account to access certain features of our platform. You agree to provide
                    accurate information during registration and to keep your account credentials secure.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium">2. Acceptable Use</h4>
                  <p className="text-sm mt-1">
                    You agree to use our platform only for lawful purposes and in accordance with these Terms. You will
                    not use our platform to violate any applicable laws or regulations.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium">3. Intellectual Property</h4>
                  <p className="text-sm mt-1">
                    All content on our platform, including text, graphics, logos, and software, is the property of
                    InsightThink Learning and is protected by intellectual property laws.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end">
                <Button variant="outline" size="sm" onClick={() => handleTabChange("privacy")} className="gap-1">
                  Continue <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="privacy" className="mt-0 space-y-4">
              <h3 className="text-xl font-semibold">Privacy Policy</h3>
              <p>Our Privacy Policy describes how we collect, use, and protect your personal information.</p>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">1. Data Collection</h4>
                  <p className="text-sm mt-1">
                    We collect personal information that you provide to us, such as your name, email address, and
                    payment information. We also collect information about your use of our platform.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium">2. Data Use</h4>
                  <p className="text-sm mt-1">
                    We use your personal information to provide and improve our services, to communicate with you, and
                    to personalize your experience on our platform.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium">3. Data Protection</h4>
                  <p className="text-sm mt-1">
                    We implement appropriate security measures to protect your personal information from unauthorized
                    access, alteration, or disclosure.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end">
                <Button variant="outline" size="sm" onClick={() => handleTabChange("liability")} className="gap-1">
                  Continue <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="liability" className="mt-0 space-y-4">
              <h3 className="text-xl font-semibold">Limitation of Liability</h3>
              <p>This section outlines the limits of our liability for your use of our platform.</p>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">1. Disclaimer of Warranties</h4>
                  <p className="text-sm mt-1">
                    Our platform is provided "as is" and "as available" without any warranties of any kind, either
                    express or implied.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium">2. Limitation of Liability</h4>
                  <p className="text-sm mt-1">
                    In no event shall InsightThink Learning be liable for any indirect, incidental, special,
                    consequential, or punitive damages arising out of or related to your use of our platform.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium">3. Indemnification</h4>
                  <p className="text-sm mt-1">
                    You agree to indemnify and hold harmless InsightThink Learning from any claims, damages, or expenses
                    arising out of your use of our platform or your violation of these Terms.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end">
                <Button variant="outline" size="sm" onClick={() => handleTabChange("agreement")} className="gap-1">
                  Continue <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="agreement" className="mt-0 space-y-4">
              <h3 className="text-xl font-semibold">User Agreement</h3>
              <p>By using our platform, you agree to the following terms.</p>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">1. Acceptance of Terms</h4>
                  <p className="text-sm mt-1">
                    By accessing or using our platform, you agree to be bound by these Terms and our Privacy Policy.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium">2. Changes to Terms</h4>
                  <p className="text-sm mt-1">
                    We may modify these Terms at any time. Your continued use of our platform after any changes
                    indicates your acceptance of the modified Terms.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium">3. Termination</h4>
                  <p className="text-sm mt-1">
                    We may terminate or suspend your access to our platform at any time, with or without cause, and
                    without prior notice or liability.
                  </p>
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg border mt-6">
                <div className="items-top flex space-x-3">
                  <Checkbox
                    id="terms-acceptance"
                    checked={accepted}
                    onCheckedChange={(checked) => setAccepted(checked as boolean)}
                    className="mt-1"
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="terms-acceptance"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I have read and accept the Terms and Conditions
                    </label>
                    <p className="text-xs text-muted-foreground">
                      By checking this box, you acknowledge that you have read, understood, and agree to be bound by
                      these Terms and Conditions and our Privacy Policy.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </ScrollArea>
        </CardContent>

        <CardFooter className="flex justify-between border-t px-6 py-4 mt-4">
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            {accepted ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>Terms accepted</span>
              </>
            ) : (
              <>
                <AlertCircle className="h-4 w-4 text-amber-500" />
                <span>Please accept the terms to continue</span>
              </>
            )}
          </div>
          <Button disabled={!accepted} className="px-6">
            Continue
          </Button>
        </CardFooter>
      </Tabs>
    </Card>
  )
}

