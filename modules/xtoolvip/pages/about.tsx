import AnimationDiv from "@/modules/global/animations/animate_div";
import Button from "@/modules/global/elements/button";
import ImageBox from "@/modules/global/elements/image_box";
import Section from "@/modules/global/elements/section";
import SvgIcon from "@/modules/global/icons/svg_icons";
import { describe } from "node:test";

function AboutPage() {
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

  return (
    <Section fullWidth className="space-y-10 -mt-20">
      <Section
        fullWidth
        className="relative overflow-hidden rounded-b-[25px] sm:rounded-b-[50px] lg:rounded-b-[100px] bg-linear-to-r from-fuchsia-600 to-violet-600 pt-30 lg:pt-50 pb-10 md:pb-40 px-6 md:px-10 shadow-2xl space-y-6"
      >
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <AnimationDiv className="text-center text-white text-3xl xs:text-4xl md:text-5xl font-bold">Our Mission: Make Premium Tools Affordable</AnimationDiv>
        </div>
        <AnimationDiv delay="delay-500" className="text-center mx-auto max-w-xl text-gray-200">
          Reach out to our support team for assistance, guidance, or partnership inquiries.
        </AnimationDiv>
      </Section>

      <Section className="grid grid-cols-1 lg:grid-cols-2 gap-10 relative z-1 py-10 md:py-20 px-6">
        <div className="md:px-2 space-y-8">
          <div className="flex">
            <div className="px-4 py-2 rounded-full bg-violet-950/10 text-black text-xl font-semibold">Who we are?</div>
          </div>

          <AnimationDiv className="text-[28px] xs:text-3xl xl:text-4xl 2xl:text-5xl font-semibold text-black">Making Premium Tools Accessible for Everyone</AnimationDiv>
          <AnimationDiv delay="delay-1000" className="text-gray-500">
            We are a team of digital marketers, developers, and entrepreneurs who understand one major challenge — premium software is expensive. Freelancers, startups,
            and growing agencies often need multiple tools to compete, but paying for each subscription separately can cost thousands every month. That’s why we built a
            smarter solution. Our platform brings together high-demand premium tools into one affordable membership — helping professionals work smarter, scale faster,
            and reduce operational costs.
          </AnimationDiv>
          <AnimationDiv delay="delay-1000">
            <div className="flex items-center">
              <SvgIcon name="check" className="size-5 p-0.5 bg-violet-500 rounded-full text-white" filled />
              <h3 className="ml-2 text-gray-800 text-xl font-semibold">Our Vision</h3>
            </div>
            <p className="text-gray-500">To remove financial barriers and give ambitious creators access to the same powerful tools used by top companies.</p>
          </AnimationDiv>
          <AnimationDiv delay="delay-1500">
            <div className="flex items-center">
              <SvgIcon name="check" className="size-5 p-0.5 bg-violet-500 rounded-full text-white" filled />
              <h3 className="ml-2 text-gray-800 text-xl font-semibold">Smart Tool Access</h3>
            </div>
            <p className="text-gray-500">Access multiple premium tools from one centralized dashboard — no juggling logins, no managing dozens of subscriptions.</p>
          </AnimationDiv>
          <AnimationDiv delay="delay-2000">
            <Button url="/register" showIcon>
              Get Start Now
            </Button>
          </AnimationDiv>
        </div>

        <div className="overflow-hidden">
          <ImageBox
            src="/images/img5.jpg"
            source_type="frontend"
            alt="ecommerce"
            className="h-165 rounded-lg"
            image_className="h-full w-full object-cover"
            zoom_on_hover={false}
          />
        </div>
      </Section>

      <Section fullWidth className="py-10 lg:py-30 px-6">
        <Section className="space-y-8">
          <div className="flex justify-center">
            <AnimationDiv className="px-4 py-1.5 bg-violet-800/5 text-black border border-gray-200 font-semibold rounded-full">How does it work?</AnimationDiv>
          </div>
          <AnimationDiv className="text-center font-black text-2xl xs:text-3xl md:text-4xl lg:text-6xl text-black">Get Started in 3 Simple Steps</AnimationDiv>
          <AnimationDiv delay="delay-500" className="text-center text-gray-500">
            From subscription to access, we've made it incredibly easy
          </AnimationDiv>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <AnimationDiv>
              <div className="p-8 rounded-3xl bg-white space-y-8 border-4 border-violet-500/10 shadow hover:shadow-lg">
                <div className="flex">
                  <div className="p-4 bg-linear-to-r from-fuchsia-500 to-violet-500 text-white rounded-2xl text-7xl font-bold">01</div>
                </div>
                <div>
                  <h1 className="text-xl xs:text-3xl font-semibold text-black">Take your subscription</h1>
                  <p className="text-gray-500">Choose between the Monthly or Annual plan</p>
                </div>

                <Button url="/pricing" showIcon>
                  View Pricing Plans
                </Button>
              </div>
            </AnimationDiv>
            <AnimationDiv delay="delay-800">
              <div className="p-8 rounded-3xl bg-white space-y-8 border-4 border-violet-500/10 shadow hover:shadow-lg">
                <div className="flex">
                  <div className="p-4 bg-linear-to-r from-fuchsia-500 to-violet-500 text-white rounded-2xl text-7xl font-bold">02</div>
                </div>
                <div>
                  <h1 className="text-xl xs:text-3xl font-semibold text-black">Install xToolVip App</h1>
                  <p className="text-gray-500">Install XToolVip software on your Windows.</p>
                </div>

                <Button url="/register" showIcon>
                  Get Start Now
                </Button>
              </div>
            </AnimationDiv>
            <AnimationDiv delay="delay-1200">
              <div className="p-8 rounded-3xl bg-white space-y-8 border-4 border-violet-500/10 shadow hover:shadow-lg">
                <div className="flex">
                  <div className="p-4 bg-linear-to-r from-fuchsia-500 to-violet-500 text-white rounded-2xl text-7xl font-bold">03</div>
                </div>
                <div>
                  <h1 className="text-xl xs:text-3xl font-semibold text-black">Get Instant Access</h1>
                  <p className="text-gray-500">Start using all the tools!</p>
                </div>

                <Button url="/tools" showIcon>
                  Discover More
                </Button>
              </div>
            </AnimationDiv>
          </div>
        </Section>
      </Section>

      <Section fullWidth className="-mb-25 relative z-5 md:pt-30">
        <Section className="bg-linear-to-r from-fuchsia-500 to-violet-500 py-10 md:py-20 px-6 md:px-20 rounded-2xl space-y-8 shadow-2xl grid grid-cols-2 gap-6">
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

export default AboutPage;
