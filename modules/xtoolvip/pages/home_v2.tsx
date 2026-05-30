import { AppLink } from "@/lib/AppLink";
import AnimationDiv from "@/modules/global/animations/animate_div";
import Button from "@/modules/global/elements/button";
import ImageBox from "@/modules/global/elements/image_box";
import Section from "@/modules/global/elements/section";
import SvgIcon from "@/modules/global/icons/svg_icons";
import Review from "@/modules/global/widget/review";
import Link from "next/link";
import Marquee from "react-fast-marquee";
import { SmartTicker } from "react-smart-ticker";

function HomePageV2() {
  const toolList = [
    "/tool/chatgpt.png",
    "/tool/claude.jpg",
    "/tool/perplexity.jpg",
    "/tool/canva.png",
    "/tool/midjourney.jpg",
    "/tool/niche.png",
    "/tool/dropship.png",
    "/tool/ppspy.png",
    "/tool/pipidds.png",
    "/tool/heygen.jpg",
    "/tool/kera.svg",
    "/tool/flux.svg",
    "/tool/grok.png",
    "/tool/dropispy.png",
    "/tool/notion.svg",
    "/tool/capcut.webp",
    "/tool/copy.svg",
  ];

  const appsCategory = [
    {
      name: "Product Research",
      total: 7,
      icon: "search_insights",
      description: "Find winning products with advanced analytics and real-time data",
      color: "from-violet-500 to-purple-600",
    },
    { name: "Ad Spy Tools", total: 10, icon: "ads_click", description: "Discover top-performing ads across all platforms", color: "from-fuchsia-500 to-pink-600" },
    { name: "AI Image & Design", total: 5, icon: "palette", description: "Create stunning visuals with AI-powered tools", color: "from-cyan-500 to-blue-600" },
    { name: "AI Text", total: 4, icon: "article", description: "Generate high-converting copy in seconds", color: "from-emerald-500 to-teal-600" },
    { name: "AI Video", total: 7, icon: "videocam", description: "Produce professional videos instantly", color: "from-orange-500 to-red-600" },
    { name: "AI Voice", total: 6, icon: "record_voice_over", description: "Create natural voiceovers instantly", color: "from-amber-500 to-yellow-600" },
    { name: "Analytics", total: 2, icon: "analytics", description: "Track performance and optimize strategies", color: "from-indigo-500 to-violet-600" },
    { name: "More Tools", total: 1, icon: "apps", description: "Explore additional premium tools", color: "from-rose-500 to-pink-600" },
  ];

  const whyUs = [
    {
      icon: "attach_money",
      name: "Save $8,000+ Monthly",
      description: "Get 40+ premium tools for a fraction of the cost",
      gradient: "from-emerald-500 to-teal-600",
      bgGradient: "from-emerald-500/10 to-teal-500/10",
    },
    {
      icon: "all_inclusive",
      name: "All-In-One Access",
      description: "Everything in one dashboard, no juggling",
      gradient: "from-violet-500 to-fuchsia-600",
      bgGradient: "from-violet-500/10 to-fuchsia-500/10",
    },
    {
      icon: "bolt",
      name: "Instant Activation",
      description: "Get immediate access, no waiting",
      gradient: "from-amber-500 to-orange-600",
      bgGradient: "from-amber-500/10 to-orange-500/10",
    },
    {
      icon: "security",
      name: "Secure & Managed",
      description: "99% uptime with enterprise security",
      gradient: "from-blue-500 to-cyan-600",
      bgGradient: "from-blue-500/10 to-cyan-500/10",
    },
    {
      icon: "sync",
      name: "Regular Updates",
      description: "Always fresh, always functional",
      gradient: "from-pink-500 to-rose-600",
      bgGradient: "from-pink-500/10 to-rose-500/10",
    },
    {
      icon: "support_agent",
      name: "24/7 Support",
      description: "Expert help whenever you need",
      gradient: "from-purple-500 to-violet-600",
      bgGradient: "from-purple-500/10 to-violet-500/10",
    },
    {
      icon: "trending_up",
      name: "Scale Faster",
      description: "Premium resources for growth",
      gradient: "from-green-500 to-emerald-600",
      bgGradient: "from-green-500/10 to-emerald-500/10",
    },
    {
      icon: "groups",
      name: "Team Ready",
      description: "Perfect for agencies & startups",
      gradient: "from-indigo-500 to-blue-600",
      bgGradient: "from-indigo-500/10 to-blue-500/10",
    },
  ];

  const review1 = [
    {
      photo: "/review/img1.png",
      name: "Mariya",
      profession: "Freelance Marketer",
      date: "02/09/2025",
      description: "This platform completely changed how I manage my marketing tools. Saved me hundreds every month!",
    },
    {
      photo: "/review/img2.png",
      name: "Ayesha Khan",
      profession: "SEO Specialist",
      date: "05/16/2025",
      description: "Having access to premium SEO tools under one subscription is a game changer.",
    },
    {
      photo: "/review/img3.png",
      name: "Daniel Richter",
      profession: "Content Strategist",
      date: "03/18/2025",
      description: "The AI writing tools alone are worth the subscription. Streamlined my workflow!",
    },
    {
      photo: "/review/img4.png",
      name: "Luis Mendoza",
      profession: "Digital Agency Owner",
      date: "04/16/2025",
      description: "Significantly reduced our software expenses. No more separate billing headaches.",
    },
    {
      photo: "/review/img5.png",
      name: "John Doe",
      profession: "Freelance Blogger",
      date: "05/06/2025",
      description: "Finally have access to premium tools that were previously too expensive.",
    },
    {
      photo: "/review/img6.png",
      name: "Samuel Osei",
      profession: "YouTube Creator",
      date: "01/19/2025",
      description: "The video tools saved me time and money. My production quality improved!",
    },
    {
      photo: "/review/img7.png",
      name: "Tomoki Sato",
      profession: "Startup Founder",
      date: "05/02/2024",
      description: "For startups on a tight budget, this is a lifesaver. Essential tools at fraction of cost.",
    },
  ];

  const review2 = [
    {
      photo: "/review/img8.png",
      name: "Chloe Bennett",
      profession: "Tech Blogger",
      date: "05/10/2025",
      description: "I finally have access to premium tech and SEO tools without paying hundreds every month.",
    },
    {
      photo: "/review/img9.png",
      name: "Raj Patel",
      profession: "Financial Consultant",
      date: "05/07/2025",
      description: "The analytics and research tools alone justify the subscription. I use them daily.",
    },
    {
      photo: "/review/img10.png",
      name: "Jasmine Lee",
      profession: "Health Creator",
      date: "03/10/2024",
      description: "The AI writing and design tools improved my content quality significantly.",
    },
    {
      photo: "/review/img11.png",
      name: "Miguel Alvarez",
      profession: "Marketing Specialist",
      date: "02/02/2025",
      description: "Instead of managing multiple subscriptions, I now handle everything from one dashboard.",
    },
    {
      photo: "/review/img12.png",
      name: "Emily Waters",
      profession: "Freelance Blogger",
      date: "01/16/2025",
      description: "As a solo creator, this platform gives me access to tools I couldn't afford individually.",
    },
    {
      photo: "/review/img13.png",
      name: "Nicolas",
      profession: "Content Creator",
      date: "05/17/2023",
      description: "The combination of SEO, AI, and design tools is incredibly powerful.",
    },
    {
      photo: "/review/img14.png",
      name: "Gauri Sinha",
      profession: "Startup Founder",
      date: "05/16/2022",
      description: "We reduced our software expenses dramatically while keeping essential tools.",
    },
  ];

  const stats = [
    { value: "15,000+", label: "Active Members", icon: "groups", gradient: "from-violet-500 to-fuchsia-600" },
    { value: "40+", label: "Premium Tools", icon: "apps", gradient: "from-fuchsia-500 to-pink-600" },
    { value: "$8K+", label: "Monthly Savings", icon: "savings", gradient: "from-emerald-500 to-teal-600" },
    { value: "120+", label: "Countries Served", icon: "public", gradient: "from-blue-500 to-cyan-600" },
    { value: "99%", label: "Platform Uptime", icon: "cloud_done", gradient: "from-amber-500 to-orange-600" },
    { value: "24/7", label: "Expert Support", icon: "support_agent", gradient: "from-purple-500 to-violet-600" },
  ];

  const steps = [
    {
      number: "01",
      title: "Choose Your Plan",
      description: "Select Monthly or Annual subscription",
      icon: "shopping_cart",
      gradient: "from-violet-500 to-fuchsia-600",
      accent: "bg-fuchsia-500/20",
    },
    {
      number: "02",
      title: "Create Account",
      description: "Register and set up your dashboard",
      icon: "person_add",
      gradient: "from-fuchsia-500 to-pink-600",
      accent: "bg-pink-500/20",
    },
    {
      number: "03",
      title: "Get Instant Access",
      description: "Start using all 40+ tools immediately",
      icon: "rocket_launch",
      gradient: "from-emerald-500 to-teal-600",
      accent: "bg-teal-500/20",
    },
  ];

  const features = [
    {
      category: "AI Writing",
      items: ["AI writing assistants", "Long-form generators", "Copywriting tools", "Blog creation", "Grammar checkers"],
      icon: "edit_note",
      gradient: "from-violet-500 to-purple-600",
    },
    {
      category: "SEO Tools",
      items: ["Keyword research", "Competitor analysis", "Backlink tools", "Rank tracking", "Site audits"],
      icon: "search",
      gradient: "from-fuchsia-500 to-pink-600",
    },
    {
      category: "Design",
      items: ["Graphic design", "Social media creator", "Presentation builders", "Image enhancement", "Branding tools"],
      icon: "palette",
      gradient: "from-cyan-500 to-blue-600",
    },
    {
      category: "Marketing",
      items: ["Campaign planning", "Traffic analysis", "Ad spy tools", "Email marketing", "Funnel optimization"],
      icon: "campaign",
      gradient: "from-orange-500 to-red-600",
    },
    {
      category: "Video",
      items: ["Video editing", "Thumbnail creators", "Caption generators", "Content repurposing"],
      icon: "play_arrow",
      gradient: "from-emerald-500 to-teal-600",
    },
    {
      category: "Productivity",
      items: ["Project management", "Automation tools", "Document collaboration", "Workflow systems"],
      icon: "check",
      gradient: "from-indigo-500 to-violet-600",
    },
  ];

  const pricingHighlights = [
    { icon: "check_circle", text: "Access to all 20+ premium tools", gradient: "from-emerald-500 to-teal-600" },
    { icon: "check_circle", text: "Unlimited usage & downloads", gradient: "from-violet-500 to-fuchsia-600" },
    { icon: "check_circle", text: "Priority 24/7 customer support", gradient: "from-blue-500 to-cyan-600" },
    { icon: "check_circle", text: "Regular tool updates included", gradient: "from-amber-500 to-orange-600" },
    { icon: "check_circle", text: "Secure managed access", gradient: "from-pink-500 to-rose-600" },
    { icon: "check_circle", text: "Cancel anytime, no contracts", gradient: "from-purple-500 to-violet-600" },
  ];

  return (
    <>
      {/* ==================== HERO SECTION ==================== */}
      <Section fullWidth className="relative overflow-hidden min-h-screen flex items-center -mt-20 pt-20">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-linear-to-br from-violet-950 via-fuchsia-950 to-slate-950"></div>

        {/* Animated Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.1)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]"></div>

        {/* Floating Orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-fuchsia-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-violet-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-fuchsia-600/15 to-violet-600/15 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-7xl mx-auto">
            {/* Hero Content - Centered Layout */}
            <div className="text-center space-y-8 mb-16">
              <AnimationDiv>
                <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 shadow-2xl shadow-fuchsia-500/20">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fuchsia-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-fuchsia-500"></span>
                  </span>
                  <span className="text-sm font-semibold text-white">20+ Premium Tools in One Platform</span>
                  <SvgIcon name="arrow_right_alt" className="w-4 h-4 text-fuchsia-300" />
                </div>
              </AnimationDiv>

              <AnimationDiv delay="delay-100">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-tight">
                  Stop Overpaying for
                  <span className="block bg-linear-to-r from-fuchsia-400 via-pink-400 to-violet-400 bg-clip-text text-transparent animate-gradient">
                    Software Subscriptions
                  </span>
                </h1>
              </AnimationDiv>

              <AnimationDiv delay="delay-200">
                <p className="text-lg sm:text-xl text-violet-200/80 max-w-3xl mx-auto leading-relaxed">
                  Get access to <span className="text-fuchsia-400 font-bold">premium tools</span> through a single shared subscription — legally, securely, and
                  affordably.
                  <br className="hidden sm:block" />
                  Save up to{" "}
                  <span className="inline-flex items-center gap-1 text-emerald-400 font-bold text-2xl">
                    $8,000+
                    <SvgIcon name="trending_up" className="w-5 h-5" />
                  </span>{" "}
                  per month with XToolVIP.
                </p>
              </AnimationDiv>

              <AnimationDiv delay="delay-300">
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    url="/register"
                    className="group w-full sm:w-auto bg-linear-to-r from-fuchsia-600 to-violet-600 text-white font-bold text-lg hover:from-fuchsia-500 hover:to-violet-500 shadow-2xl shadow-fuchsia-500/40 hover:shadow-fuchsia-500/60 transition-all duration-300 hover:scale-105"
                    border="rounded-full"
                    px="px-10"
                    py="py-5"
                  >
                    Get Started Free &nbsp; &nbsp;
                    <SvgIcon name="arrow_right_alt" className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Button
                    url="/tools"
                    className="group w-full sm:w-auto bg-white/10 backdrop-blur-xl text-white font-bold text-lg hover:bg-white/20 border border-white/30 shadow-xl hover:scale-105 transition-all duration-300"
                    border="rounded-full"
                    px="px-10"
                    py="py-5"
                  >
                    <SvgIcon name="dashboard" className="w-5 h-5" />
                    &nbsp; &nbsp; Browse Tools
                  </Button>
                </div>
              </AnimationDiv>

              {/* Trust Indicators */}
              <AnimationDiv delay="delay-400">
                <div className="flex flex-wrap items-center justify-center gap-6 pt-8">
                  {[
                    { icon: "security", text: "SSL Secure", color: "text-emerald-400" },
                    { icon: "verified", text: "Verified Access", color: "text-violet-400" },
                    { icon: "credit_card", text: "Cancel Anytime", color: "text-fuchsia-400" },
                    { icon: "star", text: "4.9/5 Rating", color: "text-amber-400" },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
                      <SvgIcon name={item.icon} filled className={`w-5 h-5 ${item.color}`} />
                      <span className="text-sm text-violet-200/80 font-medium">{item.text}</span>
                    </div>
                  ))}
                </div>
              </AnimationDiv>
            </div>

            {/* Hero Stats Cards */}
            <AnimationDiv delay="delay-500">
              <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="group relative bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-violet-500/20"
                  >
                    <div
                      className={`w-14 h-14 mx-auto mb-4 bg-linear-to-br ${stat.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      <SvgIcon name={stat.icon} filled className="w-7 h-7 text-white" />
                    </div>
                    <div className="text-center">
                      <div className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</div>
                      <div className="text-sm text-violet-200/70 mt-1">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </AnimationDiv>
          </div>
        </div>

        {/* Scroll Indicator */}
        {/* <AnimationDiv delay="delay-600" className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="flex flex-col items-center gap-3 text-violet-300/70 animate-bounce">
            <span className="text-xs font-medium uppercase tracking-wider">Scroll to explore</span>
            <div className="w-7 h-12 border-2 border-violet-400/50 rounded-full flex justify-center">
              <div className="w-1.5 h-3 bg-violet-400 rounded-full mt-2"></div>
            </div>
          </div>
        </AnimationDiv> */}
      </Section>

      {/* ==================== TOOLS MARQUEE SECTION ==================== */}
      <Section fullWidth className="py-12 bg-white border-b border-gray-100 overflow-hidden">
        <div className="text-center mb-8">
          <AnimationDiv>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Popular Tools Available</p>
          </AnimationDiv>
        </div>
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10"></div>
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10"></div>
          <SmartTicker smart isText={false} speed={30} pauseOnHover>
            <div className="gap-12 flex px-2">
              {toolList.map((tool, indx) => (
                <div key={indx} className="relative rounded-xl size-20 overflow-hidden">
                  <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-br from-violet-600/10 to-fuchsia-600/40 from-[60%] z-5 p-2"></div>
                  <ImageBox src={tool} className="size-20 flex items-center justify-center p-1" image_className="max-w-full max-h-full" />
                </div>
              ))}
            </div>
          </SmartTicker>
        </div>
      </Section>

      {/* ==================== ABOUT SECTION ==================== */}
      <Section fullWidth className="py-20 lg:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-violet-50 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Image Side */}
            <AnimationDiv>
              <div className="relative group">
                {/* Glow Effect */}
                <div className="absolute -inset-2 bg-linear-to-r from-violet-500 to-fuchsia-500 rounded-3xl blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>

                {/* Main Image Container */}
                <div className="relative bg-white rounded-3xl p-3 shadow-2xl">
                  <ImageBox
                    src="/images/imag1.jpg"
                    source_type="frontend"
                    alt="dashboard preview"
                    className="rounded-2xl overflow-hidden"
                    image_className="w-full h-auto"
                  />

                  {/* Floating Badge */}
                  <div className="absolute -bottom-8 -right-8 bg-white rounded-2xl shadow-2xl p-6 border-4 border-violet-100 group-hover:scale-110 transition-transform duration-300 animate-float">
                    <div className="text-4xl font-black bg-linear-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">$300+</div>
                    <div className="text-sm text-gray-500 font-medium mt-1">Monthly savings</div>
                  </div>
                </div>

                {/* Top Left Badge */}
                <div className="absolute -top-4 -left-4 bg-linear-to-br from-emerald-500 to-teal-500 text-white rounded-2xl px-6 py-3 shadow-xl animate-float delay-500">
                  <div className="text-2xl font-bold">20+</div>
                  <div className="text-xs font-medium opacity-90">Premium Tools</div>
                </div>
              </div>
            </AnimationDiv>

            {/* Content Side */}
            <div className="space-y-8">
              <AnimationDiv>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r from-violet-100 to-fuchsia-100 rounded-full mb-4">
                  <SvgIcon name="stars" className="w-5 h-5 text-violet-600" />
                  <span className="text-sm font-bold text-violet-700 uppercase tracking-wider">Premium Access</span>
                </div>
              </AnimationDiv>

              <AnimationDiv delay="delay-100">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-800 leading-tight">
                  20+ Premium Tools.
                  <span className="block bg-linear-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">One Powerful Subscription</span>
                </h2>
              </AnimationDiv>

              <AnimationDiv delay="delay-200">
                <p className="text-gray-600 text-lg leading-relaxed">
                  From freelancers to agencies, our all-in-one platform gives you instant access to essential premium tools for marketing, SEO, AI, design, content
                  creation, and productivity. Work smarter, save money, and scale faster — without paying for multiple expensive subscriptions.
                </p>
              </AnimationDiv>

              {/* Stats Grid */}
              <AnimationDiv delay="delay-300">
                <div className="grid grid-cols-3 gap-6">
                  {[
                    { value: "99%", label: "Platform Uptime", color: "text-violet-600" },
                    { value: "20+", label: "Premium tools", color: "text-fuchsia-600" },
                    { value: "24/7", label: "Access & support", color: "text-emerald-600" },
                  ].map((stat, idx) => (
                    <div key={idx} className="text-center p-4 bg-white rounded-2xl shadow-lg border border-gray-100">
                      <div className={`text-3xl sm:text-4xl font-black ${stat.color}`}>{stat.value}</div>
                      <div className="text-sm text-gray-500 font-medium mt-2">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </AnimationDiv>

              <AnimationDiv delay="delay-400">
                <Button
                  url="/tools"
                  className="group bg-linear-to-r from-violet-600 to-fuchsia-600 text-white font-bold text-lg shadow-xl shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-105 transition-all duration-300"
                  border="rounded-full"
                  px="px-10"
                  py="py-4"
                >
                  Discover All Tools &nbsp; &nbsp;
                  <SvgIcon name="arrow_right_alt" className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </Button>
              </AnimationDiv>
            </div>
          </div>
        </div>
      </Section>

      {/* ==================== HOW IT WORKS ==================== */}
      <Section fullWidth className="py-20 lg:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-linear-to-br from-violet-950 via-fuchsia-950 to-slate-950"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-fuchsia-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-violet-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center space-y-4 mb-16">
            <AnimationDiv>
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-xl rounded-full border border-white/20">
                <SvgIcon name="rocket_launch" className="w-5 h-5 text-fuchsia-300" />
                <span className="text-sm font-bold text-white uppercase tracking-wider">How It Works</span>
              </div>
            </AnimationDiv>
            <AnimationDiv delay="delay-100">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white">
                Get Started in
                <span className="bg-linear-to-r from-fuchsia-400 to-violet-400 bg-clip-text text-transparent"> 3 Simple Steps</span>
              </h2>
            </AnimationDiv>
            <AnimationDiv delay="delay-200">
              <p className="text-violet-200/80 text-lg max-w-2xl mx-auto">From subscription to access, we've made it incredibly easy to get started</p>
            </AnimationDiv>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <AnimationDiv key={index} delay={`delay-${index * 150}`}>
                <div className="group relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:border-white/40 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-fuchsia-500/20 h-full">
                  {/* Connection Line */}
                  {index < steps.length - 1 && <div className="hidden md:block absolute top-16 -right-4 w-8 h-0.5 bg-linear-to-r from-white/20 to-white/0"></div>}

                  {/* Number Badge */}
                  <div
                    className={`absolute -top-8 left-8 w-16 h-16 bg-linear-to-br ${step.gradient} rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300 border-4 border-slate-900`}
                  >
                    <span className="text-3xl font-black text-white">{step.number}</span>
                  </div>

                  <div className="pt-12 space-y-4">
                    <div className={`w-16 h-16 ${step.accent} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <SvgIcon name={step.icon} className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">{step.title}</h3>
                    <p className="text-violet-200/70">{step.description}</p>
                  </div>

                  {/* CTA */}
                  <div className="pt-6">
                    <Button
                      url={index === 0 ? "/pricing" : index === 1 ? "/register" : "/tools"}
                      variant="link"
                      className={`font-bold bg-linear-to-r ${step.gradient} bg-clip-text text-transparent`}
                    >
                      {index === 0 ? "View Pricing Plans" : index === 1 ? "Get Started Now" : "Discover Tools"}
                      <SvgIcon name="arrow_right_alt" className="w-5 h-5 inline group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </AnimationDiv>
            ))}
          </div>
        </div>
      </Section>

      {/* ==================== TOOL CATEGORIES ==================== */}
      <Section fullWidth className="bg-white py-20 md:py-40 px-10 md:px-20 rounded-2xl space-y-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex justify-center">
            <AnimationDiv>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r from-violet-100 to-fuchsia-100 rounded-full mb-4">
                <SvgIcon name="dashboard" className="w-5 h-5 text-violet-600" />
                <span className="text-sm font-bold text-violet-700 uppercase tracking-wider">Our Tools Collection</span>
              </div>
            </AnimationDiv>
          </div>
          <AnimationDiv className="text-center font-semibold text-3xl md:text-6xl block bg-linear-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
            20+ Premium Tools All in One Place
          </AnimationDiv>
          <AnimationDiv delay="delay-500" className="text-gray-400 max-w-2xl mx-auto text-center">
            From product research to AI-powered content creation, access the entire suite of e-commerce and marketing tools you need to succeed.
          </AnimationDiv>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {appsCategory.map((item, index) => (
              <div key={index} className="p-4 bg-violet-950/70 rounded-lg shadow-2xl space-y-8">
                <div className="space-y-4">
                  <h1 className="text-7xl font-bold text-white">{item?.total}</h1>
                  <p className="text-gray-100 text-lg bg-fuchsia-500/40 px-4 rounded">{item?.name}</p>
                </div>
                <p className="text-gray-300 text-sm">{item?.description}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ==================== WHY CHOOSE US ==================== */}
      <Section fullWidth className="py-20 lg:py-32 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center space-y-4 mb-16">
            <AnimationDiv>
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-fuchsia-100 rounded-full">
                <SvgIcon name="favorite" className="w-5 h-5 text-fuchsia-600" />
                <span className="text-sm font-bold text-fuchsia-700 uppercase tracking-wider">Why Choose Us</span>
              </div>
            </AnimationDiv>
            <AnimationDiv delay="delay-100">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-800">
                Why Thousands Choose
                <span className="block bg-linear-to-r from-fuchsia-600 to-violet-600 bg-clip-text text-transparent"> XToolVip</span>
              </h2>
            </AnimationDiv>
            <AnimationDiv delay="delay-200">
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">Everything you need to dominate your industry, all in one powerful platform</p>
            </AnimationDiv>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyUs.map((item, index) => (
              <AnimationDiv key={index} delay={`delay-${index * 75}`}>
                <div className="group relative bg-white rounded-3xl p-6 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 h-full overflow-hidden">
                  {/* Background Gradient */}
                  <div className={`absolute inset-0 bg-linear-to-br ${item.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>

                  {/* Content */}
                  <div className="relative z-10 text-center">
                    <div
                      className={`w-20 h-20 mx-auto mb-4 bg-linear-to-br ${item.gradient} rounded-3xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}
                    >
                      <SvgIcon name={item.icon} filled className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-3 group-hover:text-gray-900 transition-colors">{item.name}</h3>
                    <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors">{item.description}</p>
                  </div>
                </div>
              </AnimationDiv>
            ))}
          </div>
        </div>
      </Section>

      {/* ==================== FEATURES LIST ==================== */}
      <Section fullWidth className="py-20 lg:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center space-y-4 mb-16">
            <AnimationDiv>
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-linear-to-r from-violet-100 to-fuchsia-100 rounded-full">
                <SvgIcon name="check" className="w-5 h-5 text-violet-600" />
                <span className="text-sm font-bold text-violet-700 uppercase tracking-wider">What You Get</span>
              </div>
            </AnimationDiv>
            <AnimationDiv delay="delay-100">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-800">
                Everything Included in
                <span className="block bg-linear-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent"> Your Membership</span>
              </h2>
            </AnimationDiv>
            <AnimationDiv delay="delay-200">
              <p className="text-gray-600 text-lg max-w-3xl mx-auto">Our subscription gives you access to powerful premium tools across multiple categories</p>
            </AnimationDiv>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 h-full">
                <div className="flex items-center gap-4 mb-6">
                  <div
                    className={`w-14 h-14 bg-linear-to-br ${feature.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <SvgIcon name={feature.icon} filled className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">{feature.category}</h3>
                </div>
                <ul className="space-y-3">
                  {feature.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded-full bg-linear-to-br ${feature.gradient} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                        <SvgIcon name="check" filled className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ==================== PRICING HIGHLIGHTS ==================== */}
      <Section fullWidth className="py-20 lg:py-32 px-4 sm:px-6 lg:px-8 bg-linear-to-br from-violet-950 via-fuchsia-950 to-slate-950 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.05)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>

        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <AnimationDiv>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white">
                One Subscription,
                <span className="block bg-linear-to-r from-fuchsia-400 to-violet-400 bg-clip-text text-transparent">Unlimited Possibilities</span>
              </h2>
            </AnimationDiv>
            <AnimationDiv delay="delay-100">
              <p className="text-violet-200/80 text-lg">Everything you need to succeed, all in one place</p>
            </AnimationDiv>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pricingHighlights.map((item, index) => (
              <AnimationDiv key={index} delay={`delay-${index * 100}`}>
                <div className="group bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300 hover:-translate-y-2">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 bg-linear-to-br ${item.gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      <SvgIcon name={item.icon} filled className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-white font-medium">{item.text}</span>
                  </div>
                </div>
              </AnimationDiv>
            ))}
          </div>

          {/* CTA */}
          <AnimationDiv delay="delay-600">
            <div className="text-center mt-12">
              <Button
                url="/pricing"
                className="group bg-white text-violet-900 font-bold text-lg shadow-2xl hover:shadow-white/40 hover:scale-105 transition-all duration-300"
                border="rounded-full"
                showIcon
                px="px-12"
                py="py-5"
              >
                View Pricing Plans
                <SvgIcon name="arrow_right_alt" className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </AnimationDiv>
        </div>
      </Section>

      {/* ==================== TESTIMONIALS ==================== */}

      <Section fullWidth className="py-10 lg:py-20">
        <Section fullWidth className="grid grid-cols-1 lg:grid-cols-3">
          <div className="col-span-2 space-y-4 border-x-10 border-fuchsia-900 lg:rounded-l-lg border-y">
            <Marquee speed={50} direction="right" pauseOnHover>
              <Review data={review1} root_className="flex gap-8 py-1 px-4" className="bg-white p-5 rounded-lg shadow-custom-5 space-y-4 w-lg" />
            </Marquee>
            <Marquee speed={50} direction="left" pauseOnHover>
              <Review data={review2} root_className="flex gap-8 py-1 px-4" className="bg-white p-5 rounded-lg shadow-custom-5 space-y-4 w-lg" />
            </Marquee>
          </div>
          <div className="bg-linear-to-r from-fuchsia-900 to-violet-900 flex items-center px-6 md:px-10 lg:rounded-r-2xl pb-10 lg:pb-0">
            <div className="space-y-4">
              <div className="flex lg:justify-center">
                <SvgIcon name="groups" className="size-40 text-white" filled />
              </div>
              <h1 className="text-4xl font-semibold text-white">Success Stories from Our Users</h1>
              <p className="text-gray-200">Join thousands of successful entrepreneurs who transformed their workflow with XToolVip.</p>
            </div>
          </div>
        </Section>
      </Section>

      {/* ==================== FINAL CTA SECTION ==================== */}
      <Section fullWidth className="-mb-25 relative z-5 md:pt-30">
        <Section className="bg-linear-to-r from-fuchsia-900 to-violet-900 py-10 md:py-20 px-6 md:px-20 rounded-2xl space-y-8 shadow-2xl grid grid-cols-2 gap-6">
          <AnimationDiv duration="duration-4000" className="hidden lg:flex items-center">
            <ImageBox
              src="/images/img2.jpg"
              source_type="frontend"
              alt="cta"
              className="h-60 lg:h-70 xl:h-100 rounded-lg opacity-50"
              image_className="w-full h-full object-cover"
            />
          </AnimationDiv>
          <div className="flex items-center col-span-2 lg:col-span-1">
            <div className="space-y-6">
              <AnimationDiv className="text-2xl lg:text-5xl font-semibold text-white">Ready to Access All These Tools?</AnimationDiv>
              <AnimationDiv delay="delay-1000" className="text-gray-300">
                Join thousands of successful e-commerce entrepreneurs who are already saving time and money with xToolVip.
              </AnimationDiv>
              <AnimationDiv delay="delay-1500">
                <Button url="/register" showIcon className="bg-white hover:bg-violet-600 hover:text-white">
                  Get Access Now
                </Button>
              </AnimationDiv>
            </div>
          </div>
        </Section>
      </Section>

      {/* Custom Styles */}
      <style jsx global>{`
        @keyframes gradient {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}

export default HomePageV2;
