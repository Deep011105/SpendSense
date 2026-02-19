import React, { useState } from "react";
import {
  ArrowRight,
  Wallet,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Loader2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import ThemeToggle from "./ThemeToggle";

const Hero = () => {
  const navigate = useNavigate();
  const [isDemoLoading, setIsDemoLoading] = useState(false);

  const handleDemoLogin = async () => {
    setIsDemoLoading(true);
    const toastId = toast.loading("Preparing your demo environment...");

    try {
      // This sends the hardcoded credentials to your backend
      const response = await axios.post(
        "http://localhost:8080/api/auth/login",
        {
          email: "demo@spendsense.com",
          password: "demopassword",
        },
      );

      // Save the token just like a real login
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      toast.success("Welcome to SpendSense!", { id: toastId });
      navigate("/dashboard"); // Zoom straight to the dashboard
    } catch (error) {
      console.error("Demo login failed:", error);
      // Fallback message just in case the backend isn't running yet
      toast.error("Demo account is currently offline. Try signing up!", {
        id: toastId,
      });
    } finally {
      setIsDemoLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative bg-[#fafafa] dark:bg-black text-gray-900 dark:text-white overflow-hidden font-sans selection:bg-brand-500/30 transition-colors duration-300">
      {/* --- FIXED GLOWING BACKGROUND --- */}
      {/* Removed the inner max-w constraints and overflow-hidden so the glow spans the entire screen seamlessly */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <div className="absolute -top[10%] -left-[5%] w-[40rem] h-[40rem] bg-brand-500/30 dark:bg-brand-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute top-[10%] -right-[5%] w-[45rem] h-[45rem] bg-purple-500/30 dark:bg-purple-600/20 rounded-full blur-[150px]"></div>
      </div>

      {/* --- UPDATED NAVBAR --- */}
      {/* Lowered the opacity (bg-white/30 and bg-black/30) so the gradient bleeds through the frosted glass better */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-black/5 dark:border-white/5 bg-white/30 dark:bg-black/30 backdrop-blur-md transition-colors duration-300">
        {" "}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-gradient-to-tr from-brand-600 to-purple-500 p-2 rounded-xl shadow-lg group-hover:shadow-brand-500/25 transition-all">
                <Wallet className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight">
                SpendSense
              </span>
            </Link>

            <div className="flex items-center gap-6">
              <ThemeToggle />
              <div className="h-4 w-px bg-gray-300 dark:bg-gray-800 hidden sm:block"></div>
              <div className="hidden sm:flex items-center gap-6">
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  to="/signup"
                  className="text-sm font-semibold bg-black dark:bg-white text-white dark:text-black px-5 py-2.5 rounded-full hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(0,0,0,0.1)] dark:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* --- MAIN HERO CONTENT --- */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32 lg:pt-32">
        <div className="lg:grid lg:grid-cols-12 gap-16 items-center">
          {/* LEFT CONTENT (Text & CTA) */}
          <div className="lg:col-span-6 text-center lg:text-left">
            {/* Pulsing Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 dark:bg-brand-500/10 border border-brand-200 dark:border-brand-500/20 text-brand-600 dark:text-brand-400 text-xs font-semibold uppercase tracking-wider mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-600"></span>
              </span>
              SpendSense 1.0 is Live
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6">
              Master your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-purple-500 dark:from-brand-400 dark:to-purple-400">
                financial future.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Stop wondering where your money went. Experience real-time
              insights, effortless tracking, and beautiful charts designed to
              help you hit your goals.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                to="/signup"
                className="group flex items-center justify-center gap-2 bg-brand-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-brand-700 hover:shadow-lg hover:shadow-brand-500/30 transition-all active:scale-95"
              >
                Go to Dashboard
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button
                onClick={handleDemoLogin}
                disabled={isDemoLoading}
                className="flex items-center justify-center px-8 py-4 rounded-full text-lg font-medium border border-gray-300 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-white/5 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isDemoLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin text-gray-500 dark:text-gray-400" />
                    Loading Demo...
                  </>
                ) : (
                  "View Live Demo"
                )}
              </button>
            </div>
          </div>

          {/* RIGHT CONTENT (Floating UI Cards Mockup) */}
          <div className="lg:col-span-6 mt-20 lg:mt-0 relative hidden md:block">
            {/* The structural base to hold the absolute items */}
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              {/* Main Balance Card */}
              <div className="absolute top-10 left-10 right-10 z-20 bg-white/70 dark:bg-[#121212]/80 backdrop-blur-2xl border border-white/20 dark:border-white/10 p-6 rounded-3xl shadow-2xl transition-transform duration-500 hover:-translate-y-2">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">
                      Total Balance
                    </p>
                    <h3 className="text-3xl font-bold font-mono tracking-tight">
                      $24,562.00
                    </h3>
                  </div>
                  <div className="bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 p-2 rounded-xl">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                </div>
                {/* Mock Chart Line */}
                <div className="h-16 w-full bg-gradient-to-t from-brand-100 to-transparent dark:from-brand-900/30 rounded-lg border-b-2 border-brand-500 mt-4"></div>
              </div>

              {/* Income Floating Card */}
              <div className="absolute top-48 -left-4 z-30 bg-white/90 dark:bg-[#18181b]/90 backdrop-blur-xl border border-black/5 dark:border-white/10 p-4 rounded-2xl shadow-xl w-48 transition-transform duration-500 hover:-translate-y-1">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 dark:bg-green-500/20 p-2 rounded-full text-green-600 dark:text-green-400">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                      Income
                    </p>
                    <p className="text-sm font-bold">+$4,200.00</p>
                  </div>
                </div>
              </div>

              {/* Expense Floating Card */}
              <div className="absolute top-64 -right-4 z-30 bg-white/90 dark:bg-[#18181b]/90 backdrop-blur-xl border border-black/5 dark:border-white/10 p-4 rounded-2xl shadow-xl w-48 transition-transform duration-500 hover:-translate-y-1">
                <div className="flex items-center gap-3">
                  <div className="bg-red-100 dark:bg-red-500/20 p-2 rounded-full text-red-600 dark:text-red-400">
                    <ArrowDownRight className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                      Expenses
                    </p>
                    <p className="text-sm font-bold">-$1,840.50</p>
                  </div>
                </div>
              </div>

              {/* Decorative Floating Element */}
              <div
                className="absolute -bottom-4 left-24 z-10 bg-brand-600 dark:bg-brand-500 text-white p-4 rounded-2xl shadow-xl shadow-brand-500/30 animate-bounce"
                style={{ animationDuration: "3s" }}
              >
                <Activity className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
