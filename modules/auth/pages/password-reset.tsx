"use client";

import api from "@/lib/api";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "sonner";

// ─── Types ───────────────────────────────────────────────────────────────────

interface StepIndicatorProps {
  currentStep: number;
}

interface InputProps {
  label: string;
  id: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: React.ReactNode;
}

interface PrimaryButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
}

interface PasswordStrengthProps {
  password?: string;
}

interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
}

interface StepProps {
  onNext: () => void;
  email?: string;
  setEmail?: any;
  otp?: string;
}

interface StepOTPProps extends StepProps {
  onBack: () => void;
  otp?: any;
  setOtp?: any;
  email?: string;
}

// ─── Components ──────────────────────────────────────────────────────────────

// Step indicator component
function StepIndicator({ currentStep }: StepIndicatorProps) {
  const steps = [
    { id: 1, label: "Email" },
    { id: 2, label: "Verify" },
    { id: 3, label: "Reset" },
  ];

  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          {/* Circle */}
          <div className="flex flex-col items-center">
            <div
              className={`
                w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-500
                ${
                  currentStep > step.id
                    ? "bg-violet-600 border-violet-600 text-white shadow-lg shadow-violet-500/40"
                    : currentStep === step.id
                      ? "bg-gradient-to-br from-violet-600 to-fuchsia-600 border-transparent text-white shadow-lg shadow-fuchsia-500/40 scale-110"
                      : "bg-transparent border-violet-300 text-violet-300"
                }
              `}
            >
              {currentStep > step.id ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                step.id
              )}
            </div>
            <span
              className={`mt-1.5 text-xs font-medium transition-colors duration-300 ${
                currentStep === step.id ? "text-fuchsia-600" : currentStep > step.id ? "text-violet-600" : "text-violet-300"
              }`}
            >
              {step.label}
            </span>
          </div>

          {/* Connector line */}
          {index < steps.length - 1 && (
            <div className="w-16 sm:w-24 h-0.5 mx-2 mb-5 rounded-full overflow-hidden bg-violet-100">
              <div
                className="h-full bg-gradient-to-r from-violet-600 to-fuchsia-500 transition-all duration-700 ease-in-out"
                style={{ width: currentStep > step.id ? "100%" : "0%" }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// Input component
function Input({ label, id, type = "text", placeholder, value, onChange, icon }: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-semibold text-violet-900">
        {label}
      </label>
      <div className="relative">
        {icon && <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-violet-400">{icon}</span>}
        <input
          id={id}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`
            w-full rounded-xl border-2 border-violet-100 bg-violet-50/60 py-3 pr-4 text-violet-900 placeholder-violet-300
            text-sm font-medium outline-none transition-all duration-200
            focus:border-fuchsia-400 focus:bg-white focus:shadow-md focus:shadow-fuchsia-100
            hover:border-violet-200
            ${icon ? "pl-10" : "pl-4"}
            ${isPassword ? "pr-11" : ""}
          `}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-violet-400 hover:text-fuchsia-500 transition-colors"
          >
            {showPassword ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

// Primary button
function PrimaryButton({ children, onClick, disabled, loading }: PrimaryButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className="
        w-full py-3.5 rounded-xl font-bold text-sm text-white tracking-wide
        bg-gradient-to-r from-violet-600 via-fuchsia-600 to-violet-600
        bg-size-200 bg-pos-0 hover:bg-pos-100
        transition-all duration-500 ease-out
        shadow-lg shadow-violet-500/30 hover:shadow-xl hover:shadow-fuchsia-500/40
        hover:-translate-y-0.5 active:translate-y-0
        disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-lg
        flex items-center justify-center gap-2
      "
      style={{
        backgroundSize: "200% auto",
      }}
    >
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

// Password strength indicator
function PasswordStrength({ password }: PasswordStrengthProps) {
  const getStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  const strength = getStrength(password || "");
  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  const colors = ["", "bg-red-400", "bg-orange-400", "bg-violet-500", "bg-fuchsia-500"];
  const textColors = ["", "text-red-500", "text-orange-500", "text-violet-600", "text-fuchsia-600"];

  if (!password) return null;

  return (
    <div className="space-y-1.5">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength ? colors[strength] : "bg-violet-100"}`} />
        ))}
      </div>
      <p className={`text-xs font-semibold ${textColors[strength]}`}>{labels[strength]}</p>
    </div>
  );
}

// OTP Input component
function OTPInput({ value, onChange }: OTPInputProps) {
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
          className={`
            w-11 h-13 sm:w-13 sm:h-14 rounded-xl border-2 text-center text-lg font-bold text-violet-900
            outline-none transition-all duration-200
            ${digits[i] ? "border-fuchsia-400 bg-fuchsia-50 shadow-md shadow-fuchsia-100" : "border-violet-100 bg-violet-50/60 hover:border-violet-200"}
            focus:border-fuchsia-500 focus:bg-white focus:shadow-lg focus:shadow-fuchsia-100 focus:scale-105
          `}
          style={{ width: "2.75rem", height: "3.25rem" }}
        />
      ))}
    </div>
  );
}

// ─── Steps ───────────────────────────────────────────────────────────────────

function StepEmail({ onNext, email, setEmail }: StepProps) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email) return;

    setLoading(true);
    const query = `?email=${email}`;
    let url = "v1/auth/password/reset/send-otp" + query;
    await api
      .get(url)
      .then((res) => {
        setLoading(false);
        setLoading(false);
        onNext();
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err?.response?.data?.message);
        toast.error("Your Email Address Maybe not found. Re-Check your email address.");
      });
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-100 to-fuchsia-100 flex items-center justify-center mb-4 shadow-inner">
          <svg className="w-7 h-7 text-fuchsia-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="text-2xl font-extrabold text-violet-950 tracking-tight">Forgot Password?</h2>
        <p className="text-sm text-violet-400 leading-relaxed max-w-xs mx-auto">Enter your email and we'll send a one-time code to reset your password.</p>
      </div>

      <Input
        label="Email Address"
        id="email"
        type="email"
        placeholder="you@example.com"
        value={email ?? ""}
        onChange={(e) => setEmail(e.target.value)}
        icon={
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
            />
          </svg>
        }
      />

      <PrimaryButton onClick={handleSubmit} loading={loading} disabled={!email}>
        Send OTP Code
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </PrimaryButton>

      <p className="text-center text-xs text-violet-400">
        Remembered it?{" "}
        <Link href="/login" className="font-semibold text-fuchsia-600 hover:text-violet-700 transition-colors">
          Back to Login
        </Link>
      </p>
    </div>
  );
}

function StepOTP({ onNext, onBack, email, otp, setOtp }: StepOTPProps) {
  const [loading, setLoading] = useState(false);
  const [resent, setResent] = useState(false);

  const handleSubmit = async () => {
    if (otp.length < 6) return;

    setLoading(true);
    const query = `?email=${email}&otp=${otp}`;
    let url = "v1/auth/password/reset/check-otp" + query;
    await api
      .get(url)
      .then((res) => {
        setLoading(false);
        setLoading(false);
        onNext();
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err?.response?.data?.message);
      });
  };

  const handleResend = () => {
    setResent(true);
    setTimeout(() => setResent(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-100 to-fuchsia-100 flex items-center justify-center mb-4 shadow-inner">
          <svg className="w-7 h-7 text-fuchsia-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-extrabold text-violet-950 tracking-tight">Check Your Email</h2>
        <p className="text-sm text-violet-400 leading-relaxed max-w-xs mx-auto">We sent a 6-digit code to your email. Enter it below to continue.</p>
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-semibold text-violet-900 text-center">OTP Code</label>
        <OTPInput value={otp} onChange={setOtp} />
      </div>

      <PrimaryButton onClick={handleSubmit} loading={loading} disabled={otp.length < 6}>
        Verify Code
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </PrimaryButton>

      <div className="flex items-center justify-between text-xs">
        <button onClick={onBack} className="text-violet-400 hover:text-violet-700 font-medium flex items-center gap-1 transition-colors">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
          </svg>
          Back
        </button>
        <button
          onClick={handleResend}
          className={`font-semibold transition-colors ${resent ? "text-fuchsia-500 cursor-default" : "text-fuchsia-600 hover:text-violet-700"}`}
        >
          {resent ? "✓ Code Resent!" : "Resend Code"}
        </button>
      </div>
    </div>
  );
}

function StepPassword({ onNext, email, otp }: StepProps) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const match = password && confirm && password === confirm;
  const mismatch = password && confirm && password !== confirm;
  const canSubmit = match && password.length >= 8;

  const handleSubmit = async () => {
    if (!canSubmit) return;

    setLoading(true);
    const query = `?email=${email}&otp=${otp}&password=${password}`;
    let url = "v1/auth/password/reset" + query;
    await api
      .get(url)
      .then((res) => {
        setLoading(false);
        setLoading(false);
        onNext();
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err?.response?.data?.message);
      });
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-100 to-fuchsia-100 flex items-center justify-center mb-4 shadow-inner">
          <svg className="w-7 h-7 text-fuchsia-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 className="text-2xl font-extrabold text-violet-950 tracking-tight">New Password</h2>
        <p className="text-sm text-violet-400 leading-relaxed max-w-xs mx-auto">Create a strong password for your account. Min. 8 characters.</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-3">
          <Input
            label="New Password"
            id="password"
            type="password"
            placeholder="Min. 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            }
          />
          <PasswordStrength password={password} />
        </div>

        <div className="space-y-1.5">
          <Input
            label="Confirm Password"
            id="confirm"
            type="password"
            placeholder="Repeat your password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            }
          />
          {mismatch && (
            <p className="text-xs font-medium text-red-500 flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Passwords do not match
            </p>
          )}
          {match && (
            <p className="text-xs font-medium text-fuchsia-600 flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Passwords match!
            </p>
          )}
        </div>
      </div>

      <PrimaryButton onClick={handleSubmit} loading={loading} disabled={!canSubmit}>
        Reset Password
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </PrimaryButton>
    </div>
  );
}

function StepSuccess() {
  return (
    <div className="text-center space-y-6 py-4">
      <div className="relative mx-auto w-20 h-20">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-500 opacity-20 animate-ping" />
        <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-xl shadow-fuchsia-500/40">
          <svg className="w-9 h-9 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-extrabold text-violet-950 tracking-tight">All Done!</h2>
        <p className="text-sm text-violet-400 leading-relaxed max-w-xs mx-auto">Your password has been reset successfully. You can now log in with your new password.</p>
      </div>

      <Link
        href="/login"
        className="
          inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm text-white tracking-wide
          bg-gradient-to-r from-violet-600 to-fuchsia-600
          shadow-lg shadow-violet-500/30 hover:shadow-xl hover:shadow-fuchsia-500/40
          hover:-translate-y-0.5 transition-all duration-300
        "
      >
        Back to Login
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </Link>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function PasswordResetPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  return (
    <div className="-mt-10 md:-mt-20 lg:-mt-20 min-h-screen bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-violet-200/40 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-fuchsia-200/40 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" />
      <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-violet-300/20 rounded-full blur-2xl pointer-events-none" />

      {/* Card */}
      <div className="relative w-full max-w-md">
        {/* Glow border effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-br from-violet-400 to-fuchsia-400 rounded-3xl opacity-20 blur-sm" />

        <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl shadow-violet-200/60 border border-violet-100/80 p-8 sm:p-10">
          {/* Logo / Brand */}
          <div className="hidden items-center justify-center gap-2 mb-8">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-md shadow-fuchsia-300/50">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                  stroke="white"
                  strokeWidth="1.5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="font-black text-lg bg-gradient-to-r from-violet-700 to-fuchsia-600 bg-clip-text text-transparent tracking-tight">YourBrand</span>
          </div>

          {/* Step Indicator (only for steps 1-3) */}
          {step <= 3 && <StepIndicator currentStep={step} />}

          {/* Step Content with slide animation */}
          <div key={step} className="animate-fadeIn">
            {step === 1 && <StepEmail onNext={() => setStep(2)} email={email} setEmail={setEmail} />}
            {step === 2 && <StepOTP onNext={() => setStep(3)} onBack={() => setStep(1)} email={email} otp={otp} setOtp={setOtp} />}
            {step === 3 && <StepPassword onNext={() => setStep(4)} email={email} otp={otp} />}
            {step === 4 && <StepSuccess />}
          </div>
        </div>
      </div>

      {/* Fade-in animation style */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.35s ease-out both;
        }
      `}</style>
    </div>
  );
}
