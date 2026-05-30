import api from "@/lib/api";
import { useCurrencyStore } from "@/modules/currency/store/useCurrencyStore";
import AnimationDiv from "@/modules/global/animations/animate_div";
import AnimationOverlay from "@/modules/global/animations/animation_overlay";
import Button from "@/modules/global/elements/button";
import ImageBox from "@/modules/global/elements/image_box";
import Section from "@/modules/global/elements/section";
import SvgIcon from "@/modules/global/icons/svg_icons";
import { getCookie, setCookie } from "cookies-next";
import { useRouter } from "next/router";
import { describe } from "node:test";
import { useEffect, useState } from "react";

function PricingPage() {
  const router = useRouter();
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

  const plans = [
    {
      name: "Premium Subscription",
      description: "Flexible month-to-month access with no long-term commitment.",
      period: "Monthly",
      price: "$30.99",
      features: [
        "Unlimited access to 40+ premium Ecom tools",
        "Save €8,000+ per month on subscriptions",
        "Multiple accounts where available",
        "Regular tool updates & additions",
        "24/7 access with no downtime",
        "Cancel anytime",
      ],
    },
    {
      name: "Premium Subscription",
      description: "Get the most value with our annual plan, plus exclusive bonuses!",
      period: "Yearly",
      price: "$20.99",
      features: [
        "30% discount vs monthly plan",
        "Unlimited access to 40+ premium Ecom tools",
        "Save €8,000+ per month on subscriptions",
        "Multiple accounts where available",
        "Regular tool updates & additions",
        "24/7 access with no downtime",
        "Cancel anytime",
        "Priority Premium Customer Support",
        "Early access to new tools",
      ],
    },
  ];

  const weOffer = [
    { icon: "edit_note", name: "AI writing assistants" },
    { icon: "news", name: "Long-form content generators" },
    { icon: "campaign", name: "Copywriting tools" },
    { icon: "rss_feed", name: "Blog & article creation tools" },
    { icon: "spellcheck", name: "Grammar & rewriting assistants" },

    { icon: "search", name: "Keyword research platforms" },
    { icon: "bar_chart", name: "Competitor analysis tools" },
    { icon: "link", name: "Backlink research tools" },
    { icon: "show_chart", name: "Rank tracking systems" },
    { icon: "check", name: "Site audit tools" },

    { icon: "palette", name: "Graphic design platforms" },
    { icon: "add", name: "Social media post creators" },
    { icon: "play_arrow", name: "Presentation builders" },
    { icon: "image", name: "Image enhancement tools" },
    { icon: "dashboard", name: "Branding & mockup tools" },

    { icon: "event_list", name: "Campaign planning tools" },
    { icon: "bar_chart", name: "Traffic analysis tools" },
    { icon: "visibility", name: "Ad spy tools" },
    { icon: "mail", name: "Email marketing assistants" },
    { icon: "search", name: "Funnel optimization tools" },

    { icon: "play_arrow", name: "Video editing platforms" },
    { icon: "image", name: "Thumbnail creators" },
    { icon: "short_text", name: "Caption generators" },
    { icon: "news", name: "Content repurposing tools" },

    { icon: "check", name: "Project management tools" },
    { icon: "settings", name: "Automation utilities" },
    { icon: "docs", name: "Document collaboration tools" },
    { icon: "sync_alt", name: "Workflow optimization systems" },
  ];
  const { formatPrice } = useCurrencyStore();
  const [mainData, setMainData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const getInitialData = async () => {
    setLoading(true);
    let url = "v1/packages";
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

  const printRecurring = (value: string) => {
    if (value == "day") {
      return "Daily";
    }
    if (value == "week") {
      return "Weekly";
    }
    if (value == "month") {
      return "Monthly";
    }
    if (value == "year") {
      return "Yearly";
    }
  };

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

  const handleAddToCart = (id: any) => {
    if (!id) return;

    const cookieValue: any = getCookie("cart");
    let itemsToArray: any[] = [];

    // if (cookieValue) {
    //   try {
    //     const parsed = JSON.parse(cookieValue);
    //     if (Array.isArray(parsed)) {
    //       itemsToArray = parsed;
    //     } else {
    //       itemsToArray = [];
    //     }
    //   } catch (error) {
    //     // Invalid JSON – start with fresh array
    //     itemsToArray = [];
    //   }
    // }

    itemsToArray.push(id);
    setCookie("cart", JSON.stringify(itemsToArray));
    router.push("/checkout");
  };

  return (
    <Section fullWidth className=" space-y-10 -mt-20">
      <Section
        fullWidth
        className="relative overflow-hidden rounded-b-[25px] sm:rounded-b-[50px] lg:rounded-b-[100px] inset-0 bg-linear-to-br from-violet-900 to-fuchsia-900  lg:pt-50 pb-40 px-6 md:px-10 shadow-2xl space-y-6"
      >
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <AnimationDiv className="text-center text-white text-4xl md:text-5xl font-bold">Pricing That Fits Your Needs</AnimationDiv>
        </div>
        <AnimationDiv delay="delay-500" className="text-center mx-auto max-w-xl text-gray-200">
          Access the best ecommerce and AI tools in one subscription. Save $8,000+ per month compared to individual subscriptions.
        </AnimationDiv>
      </Section>

      <Section className="bg-linear-to-tr from-fuchsia-500 to-violet-500 p-2 md:p-5 sm:p-10 rounded-3xl mb-2 -mt-30">
        <div className="bg-linear-to-tr from-fuchsia-300 to-violet-200 p-2 md:p-10 sm:p-20 rounded-3xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 relative z-2">
            {Array.isArray(mainData) &&
              mainData.map((plan, index) => (
                <div key={index} className="flex justify-center rounded-xl shadow-custom-5">
                  <div className="h-full bg-white p-4 md:p-10 rounded-3xl space-y-6">
                    <div className="w-full flex justify-start">
                      <AnimationDiv className="px-4 py-2 rounded-full bg-violet-600 text-white font-bold">{printRecurring(plan?.recurring)}</AnimationDiv>
                    </div>

                    <div className="space-y-1">
                      <AnimationDiv className="text-start font-semibold text-3xl">{plan?.name}</AnimationDiv>
                      <AnimationDiv className="text-start">{plan?.des}</AnimationDiv>
                    </div>

                    <div className="w-full flex justify-start">
                      <AnimationDiv className="px-4 py-2 rounded-full bg-fuchsia-600 text-white font-bold text-5xl">{formatPrice(plan?.price)}</AnimationDiv>
                    </div>
                    <hr className="border-gray-600/30" />
                    <AnimationDiv>
                      <div className="space-y-4">
                        {Array.isArray(plan?.features) &&
                          plan?.features.map((feature: any, indexf: any) => (
                            <div key={indexf} className="flex items-center gap-1">
                              <SvgIcon name={feature?.icon} className="text-green-800 size-6" />
                              <p className="text-gray-700">{feature?.name}</p>
                            </div>
                          ))}
                      </div>
                    </AnimationDiv>
                    <Button onClick={() => handleAddToCart(plan?.id)} border="rounded-full" showIcon>
                      Subscribe Now
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </Section>

      <Section fullWidth className="my-10 md:my-30 py-20 lg:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
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

      <Section fullWidth className="px-6 py-10 md:py-30 relative z-1">
        <Section className="space-y-8">
          <div className="space-y-2">
            <h1 className="text-center font-semibold text-3xl xs:text-4xl md:text-6xl text-black">What Do You Get With Your Membership?</h1>
            <p className="text-center text-gray-500 max-w-3xl mx-auto">
              Our subscription gives you access to powerful premium tools across multiple categories — all inside one secure dashboard.
            </p>
          </div>
          <div className="flex flex-wrap gap-8">
            {weOffer.map((offer, index) => (
              <div className="p-2 rounded-xl bg-linear-to-tl from-violet-50 to-fuchsia-50 relative overflow-hidden shadow">
                <div className="h-full w-2 absolute bg-linear-to-tr from-violet-500 to-fuchsia-400 top-0 left-0 animate-pulse"></div>
                <div key={index} className="bg-linear-to-tr from-violet-50 to-fuchsia-50 p-5 rounded-xl flex flex-wrap gap-4 items-center ">
                  <AnimationDiv>
                    <SvgIcon name={offer?.icon} className="text-violet-600 size-10 p-2 bg-violet-200 rounded-lg" />
                  </AnimationDiv>
                  <AnimationDiv className="text-black md:text-xl font-semibold">{offer?.name}</AnimationDiv>
                </div>
              </div>
            ))}
          </div>
        </Section>
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

export default PricingPage;
