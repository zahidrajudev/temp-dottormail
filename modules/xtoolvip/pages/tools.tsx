import api from "@/lib/api";
import AnimationDiv from "@/modules/global/animations/animate_div";
import AnimationOverlay from "@/modules/global/animations/animation_overlay";
import Button from "@/modules/global/elements/button";
import ImageBox from "@/modules/global/elements/image_box";
import Section from "@/modules/global/elements/section";
import SvgIcon from "@/modules/global/icons/svg_icons";
import { useEffect, useState } from "react";

function ToolsPage() {
  const tools = [
    {
      name: "ChatGPT",
      description: "Advanced AI assistant for writing and reasoning",
      features: ["AI content generation", "Code writing assistance", "Problem solving support"],
      category: "AI Tools – Text",
      logo: "/tool/chatgpt.png",
    },
    {
      name: "Claude AI",
      description: "Long-context AI assistant for analysis and writing",
      features: ["Long document understanding", "High quality text generation", "Safe reasoning assistance"],
      category: "AI Tools – Text",
      logo: "/tool/claude.jpg",
    },
    {
      name: "Perplexity AI",
      description: "AI search engine with real-time answers",
      features: ["Real time web search", "Source cited answers", "Research focused responses"],
      category: "AI Tools – Text",
      logo: "/tool/perplexity.jpg",
    },
    {
      name: "Canva Pro",
      description: "All-in-one design platform with AI tools",
      features: ["Professional design templates", "Brand kit management", "AI image generation"],
      category: "AI Tools – Image & Design",
      logo: "/tool/canva.png",
    },
    {
      name: "Midjourney",
      description: "High-quality AI image generation platform",
      features: ["Text to image generation", "Artistic style variations", "High resolution outputs"],
      category: "AI Tools – Image & Design",
      logo: "/tool/midjourney.jpg",
    },
    {
      name: "Niche Scraper",
      description: "Winning product research for dropshipping businesses",
      features: ["Product trend analysis", "Winning product discovery", "Store performance insights"],
      category: "Product Research Tools",
      logo: "/tool/niche.png",
    },
    {
      name: "Dropship.io",
      description: "Dropshipping product discovery and analytics platform",
      features: ["Trending product discovery", "Sales data tracking", "Competition level analysis"],
      category: "Product Research Tools",
      logo: "/tool/dropship.png",
    },
    {
      name: "PPSPY",
      description: "Shopify store spying and product research",
      features: ["Shopify store tracking", "Product sales estimation", "Competitor store insights"],
      category: "Ad Spy Tools",
      logo: "/tool/ppspy.png",
    },
    {
      name: "PipiAds",
      description: "TikTok and Facebook ads intelligence platform",
      features: ["TikTok ads library", "Creative performance analytics", "Winning product discovery"],
      category: "Ad Spy Tools",
      logo: "/tool/pipidds.png",
    },
    {
      name: "HeyGen",
      description: "AI avatar video creation and translation tool",
      features: ["AI avatar videos", "Text to video creation", "Multi language voiceovers"],
      category: "AI Tools – Video",
      logo: "/tool/heygen.jpg",
    },
    {
      name: "Krea AI",
      description: "Real-time AI image generation and editing",
      features: ["Live image generation", "Style controlled outputs", "Creative image editing"],
      category: "AI Tools – Image & Design",
      logo: "/tool/kera.svg",
    },
    {
      name: "Flux AI",
      description: "Fast AI image generation with modern styles",
      features: ["High speed image generation", "Multiple artistic styles", "High resolution images"],
      category: "AI Tools – Image & Design",
      logo: "/tool/flux.svg",
    },
    {
      name: "Grok",
      description: "Real-time AI chatbot with social data",
      features: ["Realtime information access", "Conversational AI responses", "Humorous personality replies"],
      category: "AI Tools – Text",
      logo: "/tool/grok.png",
    },
    {
      name: "Dropispy",
      description: "Social media ad spy for dropshipping",
      features: ["Facebook ad monitoring", "Winning product detection", "Ad engagement analysis"],
      category: "Ad Spy Tools",
      logo: "/tool/dropispy.png",
    },
    {
      name: "Notion AI",
      description: "AI productivity assistant inside Notion workspace",
      features: ["AI writing assistance", "Document summarization tools", "Task and note automation"],
      category: "AI Tools – Productivity",
      logo: "/tool/notion.svg",
    },
    {
      name: "CapCut Pro",
      description: "Easy video editing for short-form content",
      features: ["Auto captions generation", "Social media video templates", "Fast video editing"],
      category: "AI Tools – Video",
      logo: "/tool/capcut.webp",
    },
    {
      name: "Copy.ai",
      description: "AI copywriting tool for marketing teams",
      features: ["Marketing copy generation", "Ad copy writing", "Brand tone customization"],
      category: "AI Tools – Text",
      logo: "/tool/copy.svg",
    },
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

  const [mainData, setMainData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const getInitialData = async () => {
    setLoading(true);
    let url = "v1/tools";
    await api
      .get(url)
      .then((res) => {
        setLoading(false);
        setMainData(res.data.data);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getInitialData();
  }, []);

  const stats = [
    { value: "10,000+", label: "Active Users", sub: "Growing daily" },
    { value: "20+", label: "Premium Tools", sub: "All in one place" },
    { value: "$8,000+", label: "Yearly Savings", sub: "Per user average" },
    { value: "99.9%", label: "Uptime", sub: "Guaranteed" },
  ];

  return (
    <Section fullWidth className="space-y-10 -mt-20">
      <Section
        fullWidth
        className="relative overflow-hidden rounded-b-[25px] sm:rounded-b-[50px] lg:rounded-b-[100px] bg-linear-to-r from-fuchsia-900 to-violet-900 pt-30 lg:pt-50 pb-40  px-6 md:px-10 shadow-2xl space-y-6"
      >
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <SvgIcon name="crown" className="text-white size-10 md:size-20" filled />
          <AnimationDiv className="text-center text-white text-xl xs:text-2xl md:text-5xl font-bold"> 15+ Premium Tools</AnimationDiv>
          <SvgIcon name="crown" className="text-white size-10 md:size-20" filled />
        </div>
        <AnimationDiv delay="delay-500" className="text-center mx-auto max-w-xl text-gray-200">
          Access the best ecommerce and AI tools in one subscription. Save $8,000+ per month compared to individual subscriptions.
        </AnimationDiv>
      </Section>

      <Section className="bg-linear-to-tr from-fuchsia-500 to-violet-500 p-2 md:p-5 sm:p-10 rounded-3xl -mt-30 mb-2">
        <div className="bg-linear-to-tr from-fuchsia-300 to-violet-200 p-2 md:p-10 sm:p-20 rounded-3xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-col xl:grid-cols-4 gap-4">
            {Array.isArray(mainData) &&
              mainData.map((tool, index) => (
                <div key={index} className="p-5 bg-white rounded-lg shadow-xl hover:shadow-2xl space-y-6 group border border-fuchsia-200 flex flex-col justify-between">
                  <AnimationDiv>
                    <ImageBox src={tool?.media?.path} alt={tool.name} className="h-10 group-hover:rotate-5 duration-500" image_className="" />
                  </AnimationDiv>

                  <div className="space-y-2">
                    <AnimationDiv delay="delay-500" className="font-bold text-xl">
                      {tool.name}
                    </AnimationDiv>
                    <AnimationDiv delay="delay-500" className="text-gray-600">
                      {tool?.des}
                    </AnimationDiv>
                  </div>
                  <AnimationDiv delay="delay-500">
                    <ul className="space-y-3">
                      {Array.isArray(tool?.features) &&
                        tool?.features?.map((feature: any, index: number) => (
                          <li key={index} className="flex items-center gap-2">
                            <SvgIcon name="check" className="text-violet-800 size-4" filled />
                            <span className="text-gray-600 text-xs">{feature?.name}</span>
                          </li>
                        ))}
                    </ul>
                  </AnimationDiv>
                  <AnimationDiv delay="delay-500">
                    <Button url="/register" showIcon>
                      Get Access Now
                    </Button>
                  </AnimationDiv>
                </div>
              ))}
          </div>
        </div>
      </Section>

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

      <Section fullWidth className="relative pt-32 pb-24 px-6 md:px-10 lg:pt-40 lg:pb-32">
        <div className="max-w-7xl mx-auto">
          {/* Badge */}
          <AnimationDiv className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-100 to-fuchsia-100 border border-violet-200 rounded-full shadow-sm">
              <SvgIcon name="favorite" className="text-fuchsia-600 size-5" />
              <span className="text-sm font-semibold text-violet-800">Trusted by 10,000+ Businesses Worldwide</span>
            </div>
          </AnimationDiv>

          {/* Main Heading */}
          <AnimationDiv delay="delay-200" className="text-center mb-6">
            <h1 className="text-4xl xs:text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 leading-tight">
              Our Mission:
              <br />
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-violet-600 via-fuchsia-600 to-violet-600 bg-clip-text text-transparent">Make Premium Tools Affordable</span>
              </span>
            </h1>
          </AnimationDiv>

          {/* Subheading */}
          <AnimationDiv delay="delay-400" className="text-center max-w-3xl mx-auto mb-12">
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
              We believe everyone deserves access to the same powerful tools used by top companies.
              <br className="hidden md:block" />
              <span className="font-semibold text-gray-800">One subscription, endless possibilities.</span>
            </p>
          </AnimationDiv>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {stats.map((stat, idx) => (
              <div key={idx} className="flex flex-col items-center text-center p-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-white shadow-lg">
                <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent mb-2">{stat.value}</div>
                <div className="font-bold text-gray-900 text-sm">{stat.label}</div>
                <div className="text-xs text-gray-500">{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </Section>

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
    </Section>
  );
}

export default ToolsPage;
