import api from "@/lib/api";
import AnimationDiv from "@/modules/global/animations/animate_div";
import Button from "@/modules/global/elements/button";
import ImageBox from "@/modules/global/elements/image_box";
import Section from "@/modules/global/elements/section";
import SvgIcon from "@/modules/global/icons/svg_icons";
import { useEffect, useState } from "react";

function AboutPageV2() {
  const tools = [
    { name: "ChatGPT", description: "Advanced AI assistant for writing and reasoning", category: "AI Tools – Text", logo: "/tool/chatgpt.png" },
    { name: "Claude AI", description: "Long-context AI assistant for analysis and writing", category: "AI Tools – Text", logo: "/tool/claude.jpg" },
    { name: "Perplexity AI", description: "AI search engine with real-time answers", category: "AI Tools – Text", logo: "/tool/perplexity.jpg" },
    { name: "Canva Pro", description: "All-in-one design platform with AI tools", category: "AI Tools – Image & Design", logo: "/tool/canva.png" },
    { name: "Midjourney", description: "High-quality AI image generation platform", category: "AI Tools – Image & Design", logo: "/tool/midjourney.jpg" },
    { name: "Niche Scraper", description: "Winning product research for dropshipping businesses", category: "Product Research Tools", logo: "/tool/niche.png" },
    { name: "Dropship.io", description: "Dropshipping product discovery and analytics platform", category: "Product Research Tools", logo: "/tool/dropship.png" },
    { name: "PPSPY", description: "Shopify store spying and product research", category: "Ad Spy Tools", logo: "/tool/ppspy.png" },
    { name: "PipiAds", description: "TikTok and Facebook ads intelligence platform", category: "Ad Spy Tools", logo: "/tool/pipidds.png" },
    { name: "HeyGen", description: "AI avatar video creation and translation tool", category: "AI Tools – Video", logo: "/tool/heygen.jpg" },
    { name: "Krea AI", description: "Real-time AI image generation and editing", category: "AI Tools – Image & Design", logo: "/tool/kera.svg" },
    { name: "Flux AI", description: "Fast AI image generation with modern styles", category: "AI Tools – Image & Design", logo: "/tool/flux.svg" },
    { name: "Grok", description: "Real-time AI chatbot with social data", category: "AI Tools – Text", logo: "/tool/grok.png" },
    { name: "Dropispy", description: "Social media ad spy for dropshipping", category: "Ad Spy Tools", logo: "/tool/dropispy.png" },
    { name: "Notion AI", description: "AI productivity assistant inside Notion workspace", category: "AI Tools – Productivity", logo: "/tool/notion.svg" },
    { name: "CapCut Pro", description: "Easy video editing for short-form content", category: "AI Tools – Video", logo: "/tool/capcut.webp" },
    { name: "Copy.ai", description: "AI copywriting tool for marketing teams", category: "AI Tools – Text", logo: "/tool/copy.svg" },
  ];

  const values = [
    { icon: "volunteer_activism", title: "Our Mission", desc: "Make premium tools affordable for everyone" },
    { icon: "visibility", title: "Our Vision", desc: "Remove financial barriers for ambitious creators" },
    { icon: "handshake", title: "Our Promise", desc: "Continuous updates and reliable access" },
    { icon: "support_agent", title: "Our Support", desc: "24/7 assistance whenever you need" },
  ];

  const stats = [
    { value: "10,000+", label: "Active Users", sub: "Growing daily" },
    { value: "20+", label: "Premium Tools", sub: "All in one place" },
    { value: "$8,000+", label: "Yearly Savings", sub: "Per user average" },
    { value: "99.9%", label: "Uptime", sub: "Guaranteed" },
  ];

  const steps = [
    { number: "01", title: "Choose Your Plan", desc: "Select Monthly or Annual subscription", icon: "shopping_cart" },
    { number: "02", title: "Install xToolVip", desc: "Download and install on your Windows", icon: "download" },
    { number: "03", title: "Start Using Tools", desc: "Access all premium tools instantly", icon: "rocket_launch" },
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

  return (
    <>
      {/* Hero Section */}
      <Section fullWidth className="-mt-30 pt-30 bg-linear-to-br from-violet-950 via-fuchsia-950 to-violet-900">
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
              <h1 className="text-4xl xs:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight">
                Our Mission:
                <br />
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-violet-400 bg-clip-text text-transparent">Make Premium Tools Affordable</span>
                </span>
              </h1>
            </AnimationDiv>

            {/* Subheading */}
            <AnimationDiv delay="delay-400" className="text-center max-w-3xl mx-auto mb-12">
              <p className="text-lg md:text-xl text-gray-200 leading-relaxed">
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
      </Section>

      {/* Who We Are Section */}
      <Section className="my-10 md:my-30 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Image Side */}
            <AnimationDiv className="order-2 lg:order-1">
              <div className="relative">
                {/* Decorative Frame */}
                <div className="absolute -inset-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-3xl opacity-20 blur-xl" />
                <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                  <ImageBox
                    src="/images/img5.jpg"
                    source_type="frontend"
                    alt="About us"
                    className="h-96 lg:h-[500px]"
                    image_className="h-full w-full object-cover"
                    zoom_on_hover={true}
                  />
                </div>

                {/* Floating Badge */}
                <div className="absolute -bottom-6 -right-6 p-6 bg-white rounded-2xl shadow-2xl border border-gray-100 animate-float">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 flex items-center justify-center">
                      <SvgIcon name="verified" className="text-white size-6" />
                    </div>
                    <div>
                      <div className="text-2xl font-black text-gray-900">10K+</div>
                      <div className="text-xs text-gray-500">Happy Users</div>
                    </div>
                  </div>
                </div>
              </div>
            </AnimationDiv>

            {/* Content Side */}
            <div className="order-1 lg:order-2 space-y-8">
              <AnimationDiv>
                <div className="inline-flex px-4 py-2 bg-gradient-to-r from-violet-100 to-fuchsia-100 text-violet-700 rounded-full text-sm font-bold mb-4">
                  Who We Are
                </div>
                <h2 className="text-2xl xs:text-3xl xl:text-4xl font-bold text-gray-900 leading-tight">
                  Making Premium Tools <span className="bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">Accessible for Everyone</span>
                </h2>
              </AnimationDiv>

              <AnimationDiv delay="delay-300" className="text-gray-600 leading-relaxed">
                We are a team of digital marketers, developers, and entrepreneurs who understand one major challenge — premium software is expensive. Freelancers,
                startups, and growing agencies often need multiple tools to compete, but paying for each subscription separately can cost thousands every month.
              </AnimationDiv>

              <AnimationDiv delay="delay-500" className="text-gray-600 leading-relaxed">
                That's why we built a smarter solution. Our platform brings together high-demand premium tools into one affordable membership — helping professionals work
                smarter, scale faster, and reduce operational costs.
              </AnimationDiv>

              {/* Values */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                {values.map((value, idx) => (
                  <AnimationDiv key={idx} delay={`delay-${(idx + 3) * 100}`}>
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-slate-50 to-white border border-gray-100 hover:border-violet-200 transition-colors">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 flex items-center justify-center">
                        <SvgIcon name={value.icon} className="text-white size-5" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 text-sm">{value.title}</div>
                        <div className="text-xs text-gray-500">{value.desc}</div>
                      </div>
                    </div>
                  </AnimationDiv>
                ))}
              </div>

              <AnimationDiv delay="delay-700">
                <Button
                  url="/register"
                  showIcon
                  className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white font-bold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  Get Started Now
                </Button>
              </AnimationDiv>
            </div>
          </div>
        </div>
      </Section>

      {/* Tools Showcase Section */}
      <Section fullWidth className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex px-4 py-2 bg-gradient-to-r from-violet-100 to-fuchsia-100 text-violet-700 rounded-full text-sm font-bold">
              Premium Tools Collection
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900">
              20+ <span className="bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">World-Class Tools</span>
            </h2>
            <p className="max-w-2xl mx-auto text-gray-500 text-lg">From AI assistants to design platforms, get everything you need to succeed.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array.isArray(mainData) &&
              mainData.map((tool, idx) => (
                <AnimationDiv key={idx} delay={`delay-${idx * 50}`}>
                  <div className="group p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-white border border-gray-100 hover:border-violet-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="aspect-square rounded-xl bg-white shadow-sm mb-3 overflow-hidden flex items-center justify-center p-2">
                      <ImageBox
                        src={tool?.media?.path}
                        alt={tool.name}
                        className="w-full h-full"
                        image_className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm text-center truncate">{tool.name}</h3>
                    <p className="text-xs text-gray-500 text-center mt-1 line-clamp-2">{tool.description}</p>
                  </div>
                </AnimationDiv>
              ))}
          </div>
        </div>
      </Section>

      {/* How It Works Section */}
      <Section fullWidth className="py-24 px-6 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex px-4 py-2 bg-gradient-to-r from-violet-100 to-fuchsia-100 text-violet-700 rounded-full text-sm font-bold">Simple Process</div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900">
              Get Started in <span className="bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">3 Easy Steps</span>
            </h2>
            <p className="max-w-2xl mx-auto text-gray-500 text-lg">From subscription to access, we've made it incredibly easy</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {steps.map((step, idx) => (
              <AnimationDiv key={idx} delay={`delay-${idx * 200}`}>
                <div className="group h-full p-8 rounded-3xl bg-white border-2 border-violet-100 hover:border-violet-300 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
                  {/* Background Number */}
                  <div className="absolute -top-4 right-4 text-[120px] font-black text-violet-50 opacity-50 group-hover:opacity-100 transition-opacity">
                    {step.number}
                  </div>

                  {/* Step Icon */}
                  <div className="relative mb-6">
                    <div className="inline-flex p-5 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <SvgIcon name={step.icon} className="size-8" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="relative space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-violet-600 bg-violet-100 px-3 py-1 rounded-full">STEP {step.number}</span>
                    </div>
                    <h3 className="text-xl xs:text-2xl font-bold text-gray-900">{step.title}</h3>
                    <p className="text-gray-500 leading-relaxed">{step.desc}</p>
                  </div>

                  {/* Connector Line */}
                  {idx < steps.length - 1 && <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-violet-300 to-fuchsia-300" />}
                </div>
              </AnimationDiv>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mt-12">
            <Button
              url="/pricing"
              showIcon
              className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white font-bold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <SvgIcon name="shopping_bag" className="size-5" />
              View Pricing Plans
            </Button>
            <Button
              url="/tools"
              showIcon
              className="bg-white hover:bg-gray-50 text-gray-900 font-bold px-8 py-4 rounded-full border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <SvgIcon name="explore" className="size-5" />
              Discover All Tools
            </Button>
          </div>
        </div>
      </Section>

      {/* Final CTA Section */}
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
    </>
  );
}

export default AboutPageV2;
