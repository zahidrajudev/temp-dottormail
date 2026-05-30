import { AppLink } from "@/lib/AppLink";
import AnimationDiv from "@/modules/global/animations/animate_div";
import AnimationOverlay from "@/modules/global/animations/animation_overlay";
import Button from "@/modules/global/elements/button";
import ImageBox from "@/modules/global/elements/image_box";
import Section from "@/modules/global/elements/section";
import SvgIcon from "@/modules/global/icons/svg_icons";
import Review from "@/modules/global/widget/review";
import Marquee from "react-fast-marquee";
import { SmartTicker } from "react-smart-ticker";

function HomePage() {
  const steps = [
    {
      title: "Step 1",
    },
  ];

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
    { name: "Product Research", total: 7, icon: "house", description: "lorem lorem lorem lorem lorem lorem lorem lorem lorem loren loir" },
    { name: "Ad Spy Tools", total: 10, icon: "house", description: "lorem lorem lorem lorem lorem lorem lorem lorem lorem loren loir" },
    { name: "AI Image & Design", total: 5, icon: "house", description: "lorem lorem lorem lorem lorem lorem lorem lorem lorem loren loir" },
    { name: "AI Text", total: 4, icon: "house", description: "lorem lorem lorem lorem lorem lorem lorem lorem lorem loren loir" },
    { name: "AI Video", total: 7, icon: "house", description: "lorem lorem lorem lorem lorem lorem lorem lorem lorem loren loir" },
    { name: "AI Voice", total: 6, icon: "house", description: "lorem lorem lorem lorem lorem lorem lorem lorem lorem loren loir" },
    { name: "Analytics", total: 2, icon: "house", description: "lorem lorem lorem lorem lorem lorem lorem lorem lorem loren loir" },
    { name: "More Tools", total: 1, icon: "house", description: "lorem lorem lorem lorem lorem lorem lorem lorem lorem loren loir" },
  ];

  const whyUs = [
    {
      icon: "attach_money",
      name: "Save $8,000+ Monthly",
      description: "Get access to 40+ premium tools for a fraction of their combined cost. One subscription replaces dozens of expensive individual tools.",
    },
    {
      icon: "all_inclusive",
      name: "All-In-One Access",
      description: "Everything you need in one dashboard — no juggling multiple subscriptions, logins, or payment methods.",
    },
    {
      icon: "bolt",
      name: "Instant Activation",
      description: "Get immediate access after subscribing. No waiting, no complicated setup process.",
    },
    {
      icon: "security",
      name: "Secure & Managed System",
      description: "We maintain secure access environments and monitor tool stability to ensure smooth performance.",
    },
    {
      icon: "sync",
      name: "Regular Tool Updates",
      description: "We continuously update and maintain access to ensure tools remain functional and reliable.",
    },
    {
      icon: "support_agent",
      name: "Dedicated Support",
      description: "Our support team is ready to assist you whenever you face issues or need guidance.",
    },
    {
      icon: "trending_up",
      name: "Scale Faster",
      description: "Access premium resources that help you grow your business, improve marketing, and boost productivity.",
    },
    {
      icon: "groups",
      name: "Perfect for Teams",
      description: "Ideal for freelancers, agencies, startups, and small teams looking to reduce software expenses.",
    },
    {
      icon: "crown",
      name: "Premium Tools Only",
      description: "We carefully select high-demand, industry-leading tools to maximize your value.",
    },
    {
      icon: "public",
      name: "Global Accessibility",
      description: "Access your tools from anywhere in the world with a stable internet connection.",
    },
    {
      icon: "bar_chart",
      name: "Boost ROI",
      description: "Spend less on software and reinvest savings into marketing, growth, and business expansion.",
    },
    {
      icon: "cancel",
      name: "Cancel Anytime",
      description: "No long-term contracts. Upgrade, downgrade, or cancel whenever you want.",
    },
  ];

  const review1 = [
    {
      photo: "/review/img1.png",
      name: "Mariya",
      profession: "Freelance Marketer",
      date: "02/09/2025",
      description:
        "This platform completely changed how I manage my marketing tools. Instead of paying for multiple subscriptions, I now get everything in one place. It has saved me hundreds every month!",
    },
    {
      photo: "/review/img2.png",
      name: "Ayesha Khan",
      profession: "SEO Specialist",
      date: "05/16/2025",
      description: "Having access to premium SEO and keyword tools under one subscription is a game changer. My research process is now faster and much more efficient.",
    },
    {
      photo: "/review/img3.png",
      name: "Daniel Richter",
      profession: "Content Strategist",
      date: "03/18/2025",
      description: "The AI writing and content tools alone are worth the subscription. It streamlined my workflow and improved my productivity dramatically.",
    },
    {
      photo: "/review/img4.png",
      name: "Luis Mendoza",
      profession: "Digital Agency Owner",
      date: "04/16/2025",
      description:
        "As an agency owner, this platform significantly reduced our software expenses. We now access multiple premium tools without separate billing headaches.",
    },
    {
      photo: "/review/img5.png",
      name: "John Doe",
      profession: "Freelance Blogger",
      date: "05/06/2025",
      description: "I finally have access to premium tools that were previously too expensive for me. It helped me grow my blog and improve my content quality.",
    },
    {
      photo: "/review/img6.png",
      name: "Samuel Osei",
      profession: "YouTube Content Creator",
      date: "01/19/2025",
      description: "The video and thumbnail tools saved me both time and money. My production quality improved without increasing my monthly costs.",
    },
    {
      photo: "/review/img7.png",
      name: "Tomoki Sato",
      profession: "Startup Founder",
      date: "05/02/2024",
      description:
        "For startups on a tight budget, this is a lifesaver. We get access to essential business, marketing, and productivity tools at a fraction of the price.",
    },
  ];

  const review2 = [
    {
      photo: "/review/img8.png",
      name: "Chloe Bennett",
      profession: "Tech Blogger",
      date: "05/10/2025",
      description: "I finally have access to premium tech and SEO tools without paying hundreds every month. It helped me scale my content across multiple platforms.",
    },
    {
      photo: "/review/img9.png",
      name: "Raj Patel",
      profession: "Financial Consultant",
      date: "05/07/2025",
      description: "The analytics and research tools alone justify the subscription. I use them daily for market research and client reporting.",
    },
    {
      photo: "/review/img10.png",
      name: "Jasmine Lee",
      profession: "Health & Wellness Creator",
      date: "03/10/2024",
      description: "The AI writing and design tools have improved my content quality significantly. It saves me time while keeping my workflow smooth.",
    },
    {
      photo: "/review/img11.png",
      name: "Miguel Alvarez",
      profession: "Digital Marketing Specialist",
      date: "02/02/2025",
      description: "Instead of managing multiple subscriptions, I now handle everything from one dashboard. It’s efficient, affordable, and reliable.",
    },
    {
      photo: "/review/img12.png",
      name: "Emily Waters",
      profession: "Freelance Blogger",
      date: "01/16/2025",
      description: "As a solo creator, this platform gives me access to tools I couldn’t afford individually. It helped me grow faster without increasing costs.",
    },
    {
      photo: "/review/img13.png",
      name: "Nicolas",
      profession: "Content Creator",
      date: "05/17/2023",
      description: "The combination of SEO, AI, and design tools in one place is incredibly powerful. It streamlined my entire content production process.",
    },
    {
      photo: "/review/img14.png",
      name: "Gauri Sinha",
      profession: "Startup Founder",
      date: "05/16/2022",
      description: "For startups on a tight budget, this is a smart solution. We reduced our software expenses dramatically while keeping access to essential tools.",
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
        className="relative overflow-hidden rounded-b-[25px] sm:rounded-b-[50px] lg:rounded-b-[100px] bg-violet-500/30 pt-30 lg:pt-50 pb-40 lg:pb-80 px-6 md:px-10 shadow-2xl"
      >
        <div className="absolute inset-0 bg-linear-to-l from-fuchsia-600 to-violet-600 blur-3xl z-1" />
        <div className="relative z-2 w-full space-y-8">
          <AnimationDiv
            initial="opacity-0"
            visible="opacity-100"
            duration="duration-1000"
            className="mx-auto sm:text-center text-3xl xs:text-4xl sm:text-4xl lg:text-5xl xl:text-7xl font-extrabold text-white max-w-6xl xs:leading-12 sm:leading-16 xl:leading-26"
          >
            Stop Overpaying for Softwares. Get Them All in One Place.
          </AnimationDiv>
          <AnimationDiv
            initial="translate-y-[100%] opacity-0 overflow-hidden"
            visible="translate-y-0 opacity-100"
            delay="delay-500"
            className="sm:text-center max-w-5xl mx-auto text-gray-200"
          >
            XToolVIP lets you access premium tools through a single shared subscription — legally, securely, and affordably. With XToolVIP, you get 40+ AI and Ecom tools,
            combined in one subscription. Join us now and save up to $8,000+ per month!
          </AnimationDiv>
          <div className="flex flex-wrap xs:justify-center gap-2 sm:gap-10">
            <AnimationDiv initial="translate-y-[100%] opacity-0 overflow-hidden" visible="translate-y-0 opacity-100" delay="delay-1000">
              <Button
                url="/register"
                className="text-white font-semibold hover:bg-white hover:text-violet-600 w-full xs:w-auto"
                border="border border-white rounded-full"
                showIcon
                px="px-3 sm:px-6"
                py="py-3"
              >
                Get Started Now
              </Button>
            </AnimationDiv>
            <AnimationDiv initial="translate-y-[100%] opacity-0 overflow-hidden" visible="translate-y-0 opacity-100" delay="delay-1000">
              <Button
                url="/tools"
                className="text-white font-semibold hover:bg-white hover:text-violet-600 w-full xs:w-auto"
                border="border border-white rounded-full"
                showIcon
                px="px-3 sm:px-6"
                py="py-3"
              >
                Browse Our Tools
              </Button>
            </AnimationDiv>
          </div>
        </div>
      </Section>

      <Section className="-mt-30 lg:-mt-65 relative z-3 max-w-2xl lg:max-w-3xl xl:max-w-5xl mx-auto">
        <AnimationDiv initial="translate-y-[100%] opacity-0 overflow-hidden" visible="translate-y-0 opacity-100" delay="delay-1000">
          <ImageBox src="/images/hero-1.jpg" source_type="frontend" className="rounded-xl sm:rounded-4xl bg-transparent" image_className="max-w-full max-h-full" />
        </AnimationDiv>
      </Section>

      <Section fullWidth className="px-6 py-10 lg:py-40 relative z-1">
        <Section className="grid grid-cols-1 lg:grid-cols-2 gap-10 relative z-1">
          <AnimationOverlay overlayBg="bg-violet-500/20 rounded-lg">
            <ImageBox
              src="/images/imag1.jpg"
              source_type="frontend"
              alt="ecommerce"
              className="h-[350px] lg:h-[430px] rounded-lg"
              image_className="h-full w-full object-cover"
              zoom_on_hover={false}
            />
          </AnimationOverlay>
          <div className="md:px-2 space-y-8">
            <AnimationDiv className="text-[28px] xs:text-3xl xl:text-4xl 2xl:text-5xl font-semibold text-black">
              20+ Premium Tools. One Powerful Subscription.
            </AnimationDiv>
            <AnimationDiv delay="delay-500" className="text-gray-500">
              From freelancers to agencies, our all-in-one platform gives you instant access to essential premium tools for marketing, SEO, AI, design, content creation,
              and productivity. Work smarter, save money, and scale faster — without paying for multiple expensive subscriptions. Access everything from one simple
              dashboard. No complicated setup. No steep learning curve.
            </AnimationDiv>
            <div className="flex flex-wrap justify-between gap-4">
              <AnimationDiv delay="delay-500">
                <h1 className="text-5xl font-bold">$300+</h1>
                <p className="text-gray-500 ">Monthly savings</p>
              </AnimationDiv>
              <AnimationDiv delay="delay-1000">
                <h1 className="text-5xl font-bold">20+</h1>
                <p className="text-gray-500 ">Premium tools</p>
              </AnimationDiv>
              <AnimationDiv delay="delay-1500">
                <h1 className="text-5xl font-bold">24/7</h1>
                <p className="text-gray-500 ">Access & support</p>
              </AnimationDiv>
            </div>
            <AnimationOverlay delay="delay-2000" duration="duration-4000" overlayBg="bg-gray-50">
              <Button url="/tools" showIcon>
                Discover More
              </Button>
            </AnimationOverlay>
          </div>
        </Section>
      </Section>

      <Section fullWidth className="px-0">
        <Section className="bg-linear-to-r from-fuchsia-500 to-violet-500 py-20 md:py-40 px-6 md:px-20 rounded-2xl space-y-6">
          <div className="flex justify-center">
            <AnimationOverlay overlayBg="bg-violet-800" className="px-4 py-1.5 bg-violet-800/40 text-white font-semibold rounded-full text-center">
              Trusted by 15,000+ Digital Professionals Worldwide
            </AnimationOverlay>
          </div>
          <AnimationDiv className="text-center font-semibold text-3xl md:text-6xl text-white">Premium Tools. Verified Access. Real Savings.</AnimationDiv>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-20">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <AnimationDiv delay="delay-500">
                <div className="p-4 bg-violet-950/50 rounded-lg shadow-2xl space-y-5">
                  <div>
                    <h1 className="text-5xl font-bold text-white">15,000+</h1>
                    <p className="text-gray-200">Active Members</p>
                  </div>
                  <p className="text-gray-300">
                    Freelancers, agencies, startups, and marketers trust our platform to streamline their workflow and reduce operational costs.
                  </p>
                </div>
              </AnimationDiv>
              <AnimationDiv delay="delay-500">
                <div className="p-4 bg-violet-950/50 rounded-lg shadow-lg space-y-5 h-full">
                  <div>
                    <h1 className="text-5xl font-bold text-white">120+</h1>
                    <p className="text-gray-200">Countries Served</p>
                  </div>
                  <p className="text-gray-300">
                    Our global community accesses premium tools from anywhere in the world — without paying for multiple expensive subscriptions
                  </p>
                </div>
              </AnimationDiv>
              <AnimationDiv delay="delay-1000">
                <div className="p-4 bg-violet-950/50 rounded-lg shadow-lg space-y-5">
                  <div>
                    <h1 className="text-5xl font-bold text-white">99%</h1>
                    <p className="text-gray-200">Platform Uptime</p>
                  </div>
                  <p className="text-gray-300">Our system is monitored and maintained regularly to ensure stable, reliable access to your essential tools.</p>
                </div>
              </AnimationDiv>
              <AnimationDiv delay="delay-1000">
                <div className="p-4 bg-violet-950/50 rounded-lg shadow-lg space-y-5">
                  <div>
                    <h1 className="text-5xl font-bold text-white">3x</h1>
                    <p className="text-gray-200">Faster Workflow</p>
                  </div>
                  <p className="text-gray-300">By centralizing tools in one dashboard, members eliminate switching costs and save hours every week.</p>
                </div>
              </AnimationDiv>
            </div>

            <div className="bg-fuchsia-950/50 rounded-lg flex flex-col">
              <div className="p-7 bg-violet-950/50 shadow-2xl text-white font-semibold text-center text-xs xs:text-sm md:text-2xl xl:text-3xl">
                Sales Teams Winning with Prospeo’s Data
              </div>
              <div className="flex-1 flex flex-col justify-around gap-8 py-4 lg:py-0">
                <SmartTicker smart isText={false} speed={30} pauseOnHover>
                  <div className="gap-12 flex px-2">
                    {toolList.map((tool, indx) => (
                      <div key={indx} className="relative rounded-xl size-20 overflow-hidden">
                        <div className="absolute top-0 left-0 h-full w-full bg-violet-600/40 z-5"></div>
                        <ImageBox src={tool} className="size-20 flex items-center justify-center" image_className="max-w-full max-h-full" />
                      </div>
                    ))}
                  </div>
                </SmartTicker>
                <SmartTicker smart isText={false} speed={30} direction="right">
                  <div className="gap-12 flex px-2">
                    {toolList.map((tool, indx) => (
                      <div key={indx} className="relative rounded-xl size-20 overflow-hidden">
                        <div className="absolute top-0 left-0 h-full w-full bg-violet-600/40 z-5"></div>
                        <ImageBox src={tool} className="size-20 flex items-center justify-center bg-white rounded opacity-80" image_className="max-w-full max-h-full" />
                      </div>
                    ))}
                  </div>
                </SmartTicker>
                <SmartTicker smart isText={false} speed={30}>
                  <div className="gap-12 flex px-2">
                    {toolList.map((tool, indx) => (
                      <div key={indx} className="relative rounded-xl size-20 overflow-hidden">
                        <div className="absolute top-0 left-0 h-full w-full bg-violet-600/40 z-5"></div>
                        <ImageBox src={tool} className="size-20 flex items-center justify-center bg-white rounded opacity-80" image_className="max-w-full max-h-full" />
                      </div>
                    ))}
                  </div>
                </SmartTicker>
              </div>
            </div>
          </div>
        </Section>
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

      <Section fullWidth className="">
        <Section className="bg-linear-to-r from-fuchsia-500 to-violet-500 py-20 md:py-40 px-10 md:px-20 rounded-2xl space-y-8">
          <div className="flex justify-center">
            <AnimationDiv className="px-4 py-1.5 bg-violet-800/40 text-white font-semibold rounded-full">Our Tools Collection</AnimationDiv>
          </div>
          <AnimationDiv className="text-center font-semibold text-3xl md:text-6xl text-white">20+ Premium Tools All in One Place</AnimationDiv>
          <AnimationDiv delay="delay-500" className="text-gray-200 max-w-2xl mx-auto text-center">
            From product research to AI-powered content creation, access the entire suite of e-commerce and marketing tools you need to succeed.
          </AnimationDiv>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {appsCategory.map((item, index) => (
              <AnimationDiv>
                <div key={index} className="p-4 bg-violet-950/50 rounded-lg shadow-2xl space-y-8">
                  <div>
                    <h1 className="text-7xl font-bold text-white">{item?.total}</h1>
                    <p className="text-gray-100 text-lg bg-fuchsia-500/30 px-4 rounded">{item?.name}</p>
                  </div>
                  <p className="text-gray-300">{item?.description}</p>
                </div>
              </AnimationDiv>
            ))}
          </div>
        </Section>
      </Section>

      <Section fullWidth className="py-10 lg:py-30 px-6">
        <Section className="space-y-8">
          <div className="flex justify-center">
            <AnimationDiv className="px-4 py-1.5 bg-violet-800/5 text-black border border-gray-200 font-semibold rounded-full">why us?</AnimationDiv>
          </div>
          <AnimationDiv className="text-center font-black text-2xl xs:text-3xl md:text-6xl text-black">Why Choose XToolVip?</AnimationDiv>
          <AnimationDiv delay="delay-500" className="text-center text-gray-500">
            Everything you need to dominate e-commerce, all in one powerful platform
          </AnimationDiv>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {whyUs.map((item, index) => (
              <div key={index} className="p-8 rounded-lg bg-violet-50 shadow-custom-5 space-y-5 hover:shadow-custom-6">
                <AnimationDiv className="flex justify-center">
                  <SvgIcon name={item?.icon} className="size-16 text-violet-500 p-4 bg-white rounded-full border border-fuchsia-500" />
                </AnimationDiv>
                <AnimationDiv className="text-xl font-semibold text-violet-800 text-center">{item?.name}</AnimationDiv>
                <AnimationDiv className="text-gray-500 text-center">{item?.description}</AnimationDiv>
              </div>
            ))}
          </div>
        </Section>
      </Section>

      <Section fullWidth className="py-10 lg:py-20">
        <Section fullWidth className="grid grid-cols-1 lg:grid-cols-3">
          <div className="col-span-2 space-y-4 border-x-10 border-fuchsia-500 lg:rounded-l-lg border-y">
            <Marquee speed={50} direction="right" pauseOnHover>
              <Review data={review1} root_className="flex gap-8 py-1 px-4" className="bg-white p-5 rounded-lg shadow-custom-5 space-y-4 w-lg" />
            </Marquee>
            <Marquee speed={50} direction="left" pauseOnHover>
              <Review data={review2} root_className="flex gap-8 py-1 px-4" className="bg-white p-5 rounded-lg shadow-custom-5 space-y-4 w-lg" />
            </Marquee>
          </div>
          <div className="bg-linear-to-r from-fuchsia-500 to-violet-500 flex items-center px-6 md:px-10 lg:rounded-r-2xl pb-10 lg:pb-0">
            <div className="space-y-4">
              <div className="flex lg:justify-center">
                <SvgIcon name="groups" className="size-40 text-white" filled />
              </div>
              <h1 className="text-4xl font-semibold text-white">Success Stories from Our Users</h1>
              <p className="text-gray-200">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto pariatur veritatis fugiat est nesciunt eaque assumenda inventore, dolore qui.
                Reprehenderit!
              </p>
            </div>
          </div>
        </Section>
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

export default HomePage;
