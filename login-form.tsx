"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { AirplayIcon as Spotify, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { loginWithSpotify, loginWithEmail, signupWithEmail } from "@/lib/spotify-api"
import { toast } from "@/components/ui/use-toast"

interface LoginFormProps {
  onSuccess: () => void
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showVerification, setShowVerification] = useState(false)
  const [activeTab, setActiveTab] = useState("login")
  const [otpSent, setOtpSent] = useState(false)
  const [otpTimer, setOtpTimer] = useState(0)
  const [generatedOtp, setGeneratedOtp] = useState("")

  // Timer for OTP expiration
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [otpTimer])

  const handleSpotifyLogin = () => {
    loginWithSpotify()
  }

  const generateOTP = () => {
    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    setGeneratedOtp(otp)
    // In a real app, this would be sent via SMS/email
    console.log(`OTP for ${email}: ${otp}`)

    // For demo purposes, show the OTP in a toast
    toast({
      title: "OTP Generated",
      description: `Your OTP is: ${otp} (This would normally be sent via SMS/email)`,
      duration: 10000,
    })

    setOtpSent(true)
    setOtpTimer(120) // 2 minutes expiration
    return otp
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      if (!otpSent) {
        // First step: Generate and send OTP
        generateOTP()
        setIsLoading(false)
        return
      }

      // Second step: Verify OTP and login
      if (verificationCode !== generatedOtp) {
        setError("Invalid OTP. Please try again.")
        setIsLoading(false)
        return
      }

      // OTP is valid, proceed with login
      const success = await loginWithEmail(email, password)
      if (success) {
        toast({
          title: "Login Successful",
          description: "Welcome back to Euphony!",
        })
        onSuccess()
      } else {
        setError("Invalid email or password")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Generate and send OTP
      const otp = generateOTP()

      // In a real app, we would store the user details in a database
      localStorage.setItem(
        "pending_signup",
        JSON.stringify({
          email,
          password,
          otp,
          timestamp: Date.now(),
        }),
      )

      setShowVerification(true)
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Get the pending signup data
      const pendingSignupData = localStorage.getItem("pending_signup")
      if (!pendingSignupData) {
        setError("Signup session expired. Please try again.")
        setIsLoading(false)
        return
      }

      const { email, password, otp, timestamp } = JSON.parse(pendingSignupData)

      // Check if OTP is expired (10 minutes)
      if (Date.now() - timestamp > 10 * 60 * 1000) {
        setError("OTP has expired. Please try again.")
        localStorage.removeItem("pending_signup")
        setIsLoading(false)
        return
      }

      // Verify OTP
      if (verificationCode !== otp) {
        setError("Invalid verification code")
        setIsLoading(false)
        return
      }

      // OTP is valid, create the account
      await signupWithEmail(email, password)

      // Auto login after successful verification
      await loginWithEmail(email, password)

      // Clear pending signup data
      localStorage.removeItem("pending_signup")

      toast({
        title: "Account Created",
        description: "Your account has been created successfully!",
      })

      onSuccess()
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const resendOTP = () => {
    if (otpTimer > 0) return
    generateOTP()
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-[#193552] rounded-lg shadow-lg">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">Welcome to Euphony</h2>
        <p className="text-gray-400">Sign in to access your music</p>
      </div>

      <Button
        className="w-full mb-4 bg-[#1DB954] hover:bg-[#1ed760] text-white flex items-center justify-center gap-2"
        onClick={handleSpotifyLogin}
      >
        <Spotify className="h-5 w-5" />
        Continue with Spotify
      </Button>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-600"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-[#193552] text-gray-400">Or continue with</span>
        </div>
      </div>

      {showVerification ? (
        <form onSubmit={handleVerification} className="space-y-4">
          <div>
            <Label htmlFor="verification-code">Verification Code</Label>
            <Input
              id="verification-code"
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="Enter 6-digit code"
              className="bg-[#0a1929] border-[#1e3a5f] text-white"
              required
            />
            <div className="flex justify-between items-center mt-1">
              <p className="text-xs text-gray-400">Enter the verification code sent to your email</p>
              {otpTimer > 0 ? (
                <p className="text-xs text-gray-400">Resend in {otpTimer}s</p>
              ) : (
                <button type="button" onClick={resendOTP} className="text-xs text-blue-400 hover:text-blue-300">
                  Resend Code
                </button>
              )}
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button type="submit" className="w-full bg-white text-[#0a1929] hover:bg-gray-200" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify & Create Account"
            )}
          </Button>
        </form>
      ) : (
        <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-[#0a1929]">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="bg-[#0a1929] border-[#1e3a5f] text-white"
                  required
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-[#0a1929] border-[#1e3a5f] text-white"
                  required
                />
              </div>

              {otpSent && (
                <div>
                  <Label htmlFor="login-otp">One-Time Password (OTP)</Label>
                  <Input
                    id="login-otp"
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="Enter 6-digit code"
                    className="bg-[#0a1929] border-[#1e3a5f] text-white"
                    required
                  />
                  <div className="flex justify-between items-center mt-1">
                    {otpTimer > 0 ? (
                      <p className="text-xs text-gray-400">Resend in {otpTimer}s</p>
                    ) : (
                      <button type="button" onClick={resendOTP} className="text-xs text-blue-400 hover:text-blue-300">
                        Resend Code
                      </button>
                    )}
                  </div>
                </div>
              )}

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <Button type="submit" className="w-full bg-white text-[#0a1929] hover:bg-gray-200" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {otpSent ? "Verifying..." : "Sending OTP..."}
                  </>
                ) : otpSent ? (
                  "Verify & Login"
                ) : (
                  "Send OTP"
                )}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="bg-[#0a1929] border-[#1e3a5f] text-white"
                  required
                />
              </div>

              <div>
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-[#0a1929] border-[#1e3a5f] text-white"
                  required
                  minLength={8}
                />
                <p className="text-xs text-gray-400 mt-1">Password must be at least 8 characters</p>
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <Button type="submit" className="w-full bg-white text-[#0a1929] hover:bg-gray-200" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Sign Up"
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}

