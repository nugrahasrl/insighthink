"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function SupportFaq() {
  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>

      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">Account & Billing</h3>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>How do I create an account?</AccordionTrigger>
            <AccordionContent>
              <p>
                To create an account, click on the "Sign Up" button in the top right corner of our website. Fill in your
                details including your name, email address, and password. After submitting the form, you'll receive a
                verification email. Click the link in the email to verify your account and you're all set!
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>How do I reset my password?</AccordionTrigger>
            <AccordionContent>
              <p>
                If you've forgotten your password, click on the "Login" button, then select "Forgot Password". Enter the
                email address associated with your account, and we'll send you a password reset link. Click the link in
                the email and follow the instructions to create a new password.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>How do I upgrade or downgrade my subscription?</AccordionTrigger>
            <AccordionContent>
              <p>
                To change your subscription plan, log in to your account and navigate to "Account Settings" &gt;
                "Subscription". From there, you can view your current plan and select "Change Plan" to upgrade or
                downgrade. Changes to your subscription will take effect at the start of your next billing cycle.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">Using the Platform</h3>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-4">
            <AccordionTrigger>How do I create my first project?</AccordionTrigger>
            <AccordionContent>
              <p>
                After logging in, navigate to the Dashboard and click the "New Project" button. Enter a name for your
                project, select a template if desired, and click "Create". You'll be redirected to your new project
                where you can begin adding content and configuring settings.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-5">
            <AccordionTrigger>Can I collaborate with team members?</AccordionTrigger>
            <AccordionContent>
              <p>
                Yes! To invite team members, go to your project settings and select the "Team" tab. Enter the email
                addresses of the people you want to invite and assign them appropriate roles (Admin, Editor, or Viewer).
                They'll receive an invitation email with instructions to join your project.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-6">
            <AccordionTrigger>How do I export my data?</AccordionTrigger>
            <AccordionContent>
              <p>
                To export your data, go to "Project Settings" {"->"} "Export". Select the data you want to export and
                your preferred format (CSV, JSON, or XML). Click "Generate Export" and once processing is complete,
                you'll receive a download link. For large exports, we'll email you when the export is ready.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">Troubleshooting</h3>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-7">
            <AccordionTrigger>Why is my application running slowly?</AccordionTrigger>
            <AccordionContent>
              <div>
                <p className="mb-2">If you're experiencing slow performance, try these troubleshooting steps:</p>
                <ol className="list-decimal pl-5 space-y-1">
                  <li>Clear your browser cache and cookies</li>
                  <li>Try using a different browser</li>
                  <li>Check your internet connection speed</li>
                  <li>Close unnecessary browser tabs and applications</li>
                  <li>If you're working with large datasets, consider breaking them into smaller chunks</li>
                </ol>
                <p className="mt-2">
                  If the issue persists, please contact our support team with details about your environment and the
                  specific actions that are running slowly.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-8">
            <AccordionTrigger>I'm getting an error when uploading files</AccordionTrigger>
            <AccordionContent>
              <div>
                <p className="mb-2">If you're having trouble uploading files, check the following:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Ensure your file is under the 50MB size limit</li>
                  <li>Check that the file format is supported (.jpg, .png, .pdf, .docx, .xlsx, .csv)</li>
                  <li>Verify you have a stable internet connection</li>
                  <li>Try a different browser or device</li>
                </ul>
                <p className="mt-2">
                  If you're still encountering issues, please take a screenshot of the error message and contact our
                  support team.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-9">
            <AccordionTrigger>The application is not loading correctly</AccordionTrigger>
            <AccordionContent>
              <div>
                <p className="mb-2">If the application isn't loading correctly, try these steps:</p>
                <ol className="list-decimal pl-5 space-y-1">
                  <li>Refresh the page</li>
                  <li>Clear your browser cache</li>
                  <li>Disable browser extensions that might interfere</li>
                  <li>Try using an incognito/private browsing window</li>
                  <li>Check if your browser is up to date</li>
                </ol>
                <p className="mt-2">
                  If none of these solutions work, please provide us with your browser version, operating system, and a
                  description of what you're seeing on the screen.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )
}

