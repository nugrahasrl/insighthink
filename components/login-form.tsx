"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"
import { Eye, EyeOff, Github, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/hooks/use-toast"
import { useToast } from "@/hooks/use-toast"


export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams?.get("callbackUrl") || "/dashboard"

  const [formData, setFormData] = useState({ email: "", password: "" })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const handleChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }))
    // Clear error when user starts typing again
    if (error) setError("")
  }

  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields")
      return
    }

    try {
      setIsLoading(true)
      setError("")

      const result = await signIn("credentials", {
        redirect: false, // We'll handle redirection manually for better error handling
        email: formData.email,
        password: formData.password,
        callbackUrl,
      })

      if (result?.error) {
        setError(result.error || "Invalid email or password. Please try again.")
        toast({
          title: "Authentication failed",
          description: result.error,
          variant: "destructive",
        })
      } else if (result?.url) {
        // Get user data from the session
        const response = await fetch('/api/auth/session');
        const session = await response.json();
        
        if (session?.user) {
          // Store user data in localStorage
          const userToStore = {
            name: session.user.name || formData.email.split('@')[0], // Fallback to username from email
            email: session.user.email,
            avatar: session.user.image || "/avatar/shadcn.jpg"
          };
          
          localStorage.setItem("user", JSON.stringify(userToStore));
          
          // You may want to store the token as well if your app needs it
          if (session.accessToken) {
            localStorage.setItem("authToken", session.accessToken);
          }
        }
        
        // Successful login
        router.push(result.url)
        toast({
          title: "Welcome back!",
          description: "You've successfully logged in.",
        })
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = async (provider: string) => {
    setIsLoading(true)
    try {
      await signIn(provider, { callbackUrl })
    } catch (error) {
      setIsLoading(false)
      setError(`Failed to sign in with ${provider}`)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden shadow-lg">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
            <div className="flex flex-col gap-6">
              <header className="flex flex-col items-center text-center space-y-2">
                <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
                <p className="text-balance text-muted-foreground">Login to your Insighthink account</p>
              </header>

              {error && (
                <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-md text-center">
                  {error}
                </div>
              )}

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={formData.email}
                  onChange={handleChange("email")}
                  className="h-10"
                  autoComplete="email"
                  disabled={isLoading}
                  aria-invalid={!!error}
                />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="/forgot-password"
                    className="text-sm text-primary hover:underline underline-offset-4 transition-colors"
                    tabIndex={0}
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange("password")}
                    className="h-10 pr-10"
                    autoComplete="current-password"
                    disabled={isLoading}
                    aria-invalid={!!error}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(!!checked)}
                  disabled={isLoading}
                />
                <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
                  Remember me for 30 days
                </Label>
              </div>

              <Button type="submit" className="w-full h-10" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>

              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <SocialButton
                  provider="apple"
                  label="Apple"
                  onClick={() => handleSocialLogin("apple")}
                  disabled={isLoading}
                />
                <SocialButton
                  provider="google"
                  label="Google"
                  onClick={() => handleSocialLogin("google")}
                  disabled={isLoading}
                />
                <SocialButton
                  provider="github"
                  label="GitHub"
                  onClick={() => handleSocialLogin("github")}
                  disabled={isLoading}
                />
              </div>

              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <a href="/signup" className="text-primary hover:underline underline-offset-4 transition-colors">
                  Sign up
                </a>
              </div>
            </div>
          </form>

          <div className="relative hidden bg-muted md:block">
            <img
              src="login.png"
              alt="Login illustration"
              className="absolute inset-0 h-auto w-400 object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>

      <footer className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        By clicking continue, you agree to our <a href="/terms">Terms of Service</a> and{" "}
        <a href="/privacy">Privacy Policy</a>.
      </footer>
    </div>
  )
}

interface SocialButtonProps {
  provider: "google" | "apple" | "github"
  label: string
  onClick: () => void
  disabled?: boolean
}

function SocialButton({ provider, label, onClick, disabled }: SocialButtonProps) {
  return (
    <Button type="button" variant="outline" className="h-10 w-full" onClick={onClick} disabled={disabled}>
      <SocialIcon provider={provider} />
      <span className="sr-only">{label}</span>
    </Button>
  )
}

function SocialIcon({ provider }: { provider: "google" | "apple" | "github" }) {
  switch (provider) {
    case "apple":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
          <path
            d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
            fill="currentColor"
          />
        </svg>
      )
    case "google":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
          <path
            d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
            fill="currentColor"
          />
        </svg>
      )
    case "github":
      return <Github className="h-5 w-5" />
  }
}

