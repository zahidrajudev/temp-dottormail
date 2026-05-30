"use client";

import api from "@/lib/api";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuthStore } from "../store/useAuthStore";

// ─── Types ───────────────────────────────────────────────────────────────────

interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

interface PrimaryButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  type?: "button" | "submit";
  variant?: "primary" | "secondary";
}

// ─── Components ──────────────────────────────────────────────────────────────

// OTP Input component
function OTPInput({ value, onChange, disabled = false }: OTPInputProps) {
  const length = 6;
  const digits = value.padEnd(length, "").split("").slice(0, length);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const val = e.target.value.replace(/\D/g, "").slice(-1);
    const newDigits = [...digits];
    newDigits[index] = val;
    onChange(newDigits.join(""));

    if (val && index < length - 1) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    onChange(pasted);
    const focusIndex = Math.min(pasted.length, length - 1);
    document.getElementById(`otp-${focusIndex}`)?.focus();
  };

  return (
    <div className="flex gap-2 sm:gap-3 justify-center" onPaste={handlePaste}>
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          id={`otp-${i}`}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digits[i] || ""}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          disabled={disabled}
          className={`
            w-11 h-13 sm:w-13 sm:h-14 rounded-xl border-2 text-center text-lg font-bold text-violet-900
            outline-none transition-all duration-200
            ${digits[i] ? "border-fuchsia-400 bg-fuchsia-50 shadow-md shadow-fuchsia-100" : "border-violet-100 bg-violet-50/60 hover:border-violet-200"}
            focus:border-fuchsia-500 focus:bg-white focus:shadow-lg focus:shadow-fuchsia-100 focus:scale-105
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
          style={{ width: "2.75rem", height: "3.25rem" }}
        />
      ))}
    </div>
  );
}

// Primary button
function PrimaryButton({ children, onClick, disabled, loading, type = "button", variant = "primary" }: PrimaryButtonProps) {
  const baseStyles = `
    w-full py-3.5 rounded-xl font-bold text-sm text-white tracking-wide
    transition-all duration-500 ease-out
    shadow-lg hover:shadow-xl
    hover:-translate-y-0.5 active:translate-y-0
    disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0
    flex items-center justify-center gap-2
  `;

  const variants = {
    primary: "bg-gradient-to-r from-violet-600 via-fuchsia-600 to-violet-600 shadow-violet-500/30 hover:shadow-fuchsia-500/40 bg-size-200 bg-pos-0 hover:bg-pos-100",
    secondary: "bg-gradient-to-r from-gray-600 via-gray-700 to-gray-600 shadow-gray-500/30 hover:shadow-gray-500/40",
  };

  return (
    <button type={type} onClick={onClick} disabled={disabled || loading} className={`${baseStyles} ${variants[variant]}`} style={{ backgroundSize: "200% auto" }}>
      {loading ? (
        <>
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Processing...
        </>
      ) : (
        children
      )}
    </button>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function EmailVerifyPage() {
  const { refreshAuthUser } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [verificationError, setVerificationError] = useState("");

  // Check email verification status on mount
  useEffect(() => {
    checkVerificationStatus();
  }, []);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [countdown]);

  const checkVerificationStatus = async () => {
    setLoading(true);
    try {
      const res = await api.post("v1/auth/email/verify/status");
      setEmail(res?.data?.email);
      setIsVerified(res?.data?.is_verified);
      setMessage("Email already verified");
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (err: any) {
      setEmail(err?.response?.data?.email || "");
      setIsVerified(err?.response?.data?.is_verified);
      setMessage(err?.response?.data?.message || "Email verification required");
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async () => {
    if (!email) return;

    setChecking(true);
    try {
      await api.get("v1/auth/password/reset/send-otp", {
        params: { email },
      });
      setCountdown(60); // Start 60 second countdown
      toast.success("Verification code sent to your email");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to send code");
    } finally {
      setChecking(false);
    }
  };

  const handleResendCode = async () => {
    if (countdown > 0) return;

    setResending(true);
    try {
      await api.post("v1/auth/email/verify/send-otp");
      setCountdown(60); // Reset countdown
      toast.success("New verification code sent!");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to resend code");
    } finally {
      setResending(false);
    }
  };

  const handleSubmitOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) return;

    setSubmitting(true);
    setVerificationError("");

    try {
      await api.post("v1/auth/email/verify", { otp });
      refreshAuthUser();
      // OTP verified successfully
      setVerificationSuccess(true);

      // Redirect to dashboard after showing success
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (err: any) {
      setVerificationError(err?.response?.data?.message || "Invalid verification code. Please try again.");
      toast.error(err?.response?.data?.message || "Invalid code");
    } finally {
      setSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 animate-spin mx-auto" style={{ borderTopColor: "transparent" }} />
          <p className="text-violet-600 font-semibold">Checking verification status...</p>
        </div>
      </div>
    );
  }

  // Already verified - redirecting
  if (isVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center mx-auto animate-bounce">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-green-600 font-semibold text-lg">Email already verified!</p>
          <p className="text-gray-500 text-sm">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  // Verification success state
  if (verificationSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 flex items-center justify-center p-4">
        <div className="relative w-full max-w-md">
          <div className="absolute -inset-0.5 bg-gradient-to-br from-violet-400 to-fuchsia-400 rounded-3xl opacity-20 blur-sm" />
          <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl shadow-violet-200/60 border border-violet-100/80 p-10 text-center space-y-6">
            <div className="relative mx-auto w-20 h-20">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 opacity-20 animate-ping" />
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-xl shadow-green-500/40">
                <svg className="w-9 h-9 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-gray-900">Email Verified!</h2>
              <p className="text-gray-500 leading-relaxed">Your email has been verified successfully. Redirecting you to the dashboard...</p>
            </div>

            <div className="flex justify-center">
              <div className="w-8 h-8 rounded-full border-2 border-violet-200 border-t-violet-600 animate-spin" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main verification form
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-violet-200/40 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-fuchsia-200/40 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" />
      <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-violet-300/20 rounded-full blur-2xl pointer-events-none" />

      {/* Card */}
      <div className="relative w-full max-w-md">
        {/* Glow border effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-br from-violet-400 to-fuchsia-400 rounded-3xl opacity-20 blur-sm" />

        <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl shadow-violet-200/60 border border-violet-100/80 p-8 sm:p-10">
          {/* Header Icon */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-100 to-fuchsia-100 flex items-center justify-center mb-4 shadow-inner">
              <svg className="w-8 h-8 text-fuchsia-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Verify Your Email</h2>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">Enter the 6-digit code sent to your email</p>
          </div>

          {/* Email Display */}
          <div className="mb-6">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-violet-50 border border-violet-100">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                  />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 font-medium">Email Address</p>
                <p className="text-sm font-semibold text-gray-900 truncate">{email || "Not provided"}</p>
              </div>
            </div>
          </div>

          {/* OTP Input Form */}
          <form onSubmit={handleSubmitOTP} className="space-y-6">
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-violet-900 text-center">Enter Verification Code</label>
              <OTPInput value={otp} onChange={setOtp} disabled={submitting} />
            </div>

            {/* Error Message */}
            {verificationError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3">
                <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-red-600">{verificationError}</p>
              </div>
            )}

            {/* Submit Button */}
            <PrimaryButton type="submit" loading={submitting} disabled={otp.length < 6}>
              Verify Email
            </PrimaryButton>
          </form>

          {/* Resend Code Section */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="text-center space-y-3">
              <p className="text-sm text-gray-500">Didn't receive the code?</p>
              <button
                onClick={handleResendCode}
                disabled={countdown > 0 || resending}
                className={`
                  inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold
                  transition-all duration-300
                  ${
                    countdown > 0
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-violet-100 to-fuchsia-100 text-violet-700 hover:shadow-md hover:scale-105 cursor-pointer"
                  }
                `}
              >
                {resending ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Sending...
                  </>
                ) : countdown > 0 ? (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Resend in {countdown}s
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    Resend Code
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Back to Login Link */}
          <div className="mt-4 text-center">
            <a href="/login" className="text-sm text-gray-500 hover:text-violet-600 transition-colors inline-flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
              </svg>
              Back to Login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
