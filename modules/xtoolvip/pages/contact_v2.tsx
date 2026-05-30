import AnimationDiv from "@/modules/global/animations/animate_div";
import Button from "@/modules/global/elements/button";
import ImageBox from "@/modules/global/elements/image_box";
import Section from "@/modules/global/elements/section";
import SvgIcon from "@/modules/global/icons/svg_icons";
import Input from "@/modules/global/input/input";
import TextArea from "@/modules/global/input/textarea";
import { useState } from "react";

function ContactPageV2() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState("");

  const contactInfo = [
    {
      icon: "location_on",
      title: "Our Address",
      details: "2464 Royal Ln. Mesa, New Jersey 45463.",
      bg: "from-violet-500 to-purple-500",
    },
    {
      icon: "call",
      title: "Contact Number",
      details: "+6246 1598596969, 035 6666 3951",
      bg: "from-fuchsia-500 to-pink-500",
    },
    {
      icon: "mail",
      title: "Email Us",
      details: "info@exmple.com",
      bg: "from-violet-600 to-fuchsia-600",
    },
    {
      icon: "schedule",
      title: "Business Hours",
      details: "24/7 Online Support Available",
      bg: "from-purple-500 to-fuchsia-500",
    },
  ];

  const faqs = [
    {
      q: "How quickly will I receive a response?",
      a: "We typically respond within 2-4 hours during business hours. For urgent matters, use our live chat for instant support.",
    },
    { q: "Can I schedule a demo call?", a: "Absolutely! Our team offers personalized demos. Just mention it in your message and we'll coordinate a convenient time." },
    { q: "Do you offer enterprise support?", a: "Yes, we provide dedicated account managers and priority support for enterprise customers. Contact us for details." },
  ];

  const socialLinks = [
    { icon: "facebook", url: "#", label: "Facebook" },
    { icon: "twitter", url: "#", label: "Twitter" },
    { icon: "linkedin", url: "#", label: "LinkedIn" },
    { icon: "instagram", url: "#", label: "Instagram" },
  ];

  const steps = [
    { number: "01", title: "Choose Your Plan", desc: "Select Monthly or Annual subscription", icon: "shopping_cart" },
    { number: "02", title: "Install xToolVip", desc: "Download and install on your Windows", icon: "download" },
    { number: "03", title: "Start Using Tools", desc: "Access all premium tools instantly", icon: "rocket_launch" },
  ];

  return (
    <>
      {/* Hero Section */}
      <Section fullWidth className="-mt-30 pt-30 bg-linear-to-br from-violet-950 via-fuchsia-950 to-violet-900">
        <Section fullWidth className="relative pt-32 pb-24 px-6 md:px-10 lg:pt-40 lg:pb-32 ">
          <div className="max-w-5xl mx-auto text-center">
            {/* Badge */}
            <AnimationDiv className="flex justify-center mb-8">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-100 to-fuchsia-100 border border-violet-200 rounded-full shadow-sm">
                <div className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-500 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-violet-600" />
                </div>
                <span className="text-sm font-semibold text-violet-800">We're Online & Ready to Help</span>
              </div>
            </AnimationDiv>

            {/* Main Heading */}
            <AnimationDiv delay="delay-200" className="mb-6">
              <h1 className="text-4xl xs:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight">
                Need Help?
                <br />
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-violet-400 bg-clip-text text-transparent">We're Here for You</span>
                </span>
              </h1>
            </AnimationDiv>

            {/* Subheading */}
            <AnimationDiv delay="delay-400" className="max-w-2xl mx-auto mb-12">
              <p className="text-lg md:text-xl text-gray-200 leading-relaxed">
                Helping freelancers, startups, and agencies grow without software limitations.
                <br className="hidden md:block" />
                <span className="font-semibold text-gray-800">Your success is our mission.</span>
              </p>
            </AnimationDiv>

            {/* Quick Contact Options */}
            <AnimationDiv delay="delay-600">
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="tel:+62461598596969"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-full border border-gray-200 shadow-md hover:shadow-lg hover:border-violet-300 transition-all duration-300 group"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <SvgIcon name="call" className="text-white size-4" />
                  </div>
                  <span className="font-semibold text-gray-700">Call Now</span>
                </a>
                <a
                  href="mailto:info@exmple.com"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-full border border-gray-200 shadow-md hover:shadow-lg hover:border-violet-300 transition-all duration-300 group"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <SvgIcon name="mail" className="text-white size-4" />
                  </div>
                  <span className="font-semibold text-gray-700">Email Us</span>
                </a>
                <a
                  href="#contact-form"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group hover:scale-105"
                >
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <SvgIcon name="edit" className="text-white size-4" />
                  </div>
                  <span className="font-semibold">Send Message</span>
                </a>
              </div>
            </AnimationDiv>
          </div>
        </Section>
      </Section>

      {/* Contact Info Cards Section */}
      <Section className="my-10 md:my-30 py-12 px-6 -mt-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((item, idx) => (
              <div key={idx}>
                <div className="group h-full p-6 rounded-3xl bg-white border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                  {/* Icon */}
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${item.bg} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <SvgIcon name={item.icon} className="size-7" />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.details}</p>

                  {/* Action Link */}
                  <a href="#" className="inline-flex items-center gap-1 mt-4 text-sm font-semibold text-violet-600 hover:text-fuchsia-600 transition-colors group/link">
                    Get in touch
                    <SvgIcon name="arrow_forward" className="size-4 group-hover/link:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Main Contact Section */}
      <Section fullWidth className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <AnimationDiv id="contact-form">
              <div className="p-8 md:p-10 rounded-[2rem] bg-white border border-gray-100 shadow-2xl">
                <div className="mb-8">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Send Us a Message</h2>
                  <p className="text-gray-500">Fill out the form below and we'll get back to you within 2-4 hours.</p>
                </div>

                <form className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Input label="Your Name" iconName="person" value={name} setValue={setName} id="contact-name" placeholder="John Doe" required />
                    <Input label="Email Address" iconName="mail" value={email} setValue={setEmail} id="contact-email" placeholder="john@example.com" required />
                  </div>

                  <Input label="Subject" iconName="topic" value={subject} setValue={setSubject} id="contact-subject" placeholder="How can we help?" required />

                  <TextArea
                    label="Your Message"
                    value={message}
                    setValue={setMessage}
                    id="contact-message"
                    placeholder="Tell us how we can assist you..."
                    required
                    rows={5}
                  />

                  <Button
                    type="submit"
                    showIcon
                    className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white font-bold py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                  >
                    <SvgIcon name="send" className="size-5" />
                    Send Message
                  </Button>

                  <p className="text-center text-xs text-gray-400">
                    <SvgIcon name="shield" className="size-3 inline mr-1" />
                    Your information is secure and will never be shared.
                  </p>
                </form>
              </div>
            </AnimationDiv>

            {/* Right Side - Map & Info */}
            <div className="space-y-8">
              {/* Map */}
              <AnimationDiv delay="delay-200">
                <div className="p-3 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-3xl shadow-xl">
                  <div className="rounded-2xl overflow-hidden">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2818.4981910297074!2d7.7195421122101475!3d45.0554040709495!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x478872c186267ec3%3A0xdb1f5f5559a4d48b!2sStrada%20Val%20S.%20Martino%2C%20111%2C%2010131%20Torino%20TO%2C%20Italy!5e0!3m2!1sen!2sbd!4v1767605431359!5m2!1sen!2sbd"
                      width="100%"
                      height="430"
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="w-full"
                    />
                  </div>
                </div>
              </AnimationDiv>

              {/* Social Links */}
              <AnimationDiv delay="delay-600">
                <div className="p-8 rounded-3xl bg-gradient-to-r from-violet-600 to-fuchsia-600 shadow-xl">
                  <h3 className="text-xl font-bold text-white mb-4">Connect With Us</h3>
                  <p className="text-white/80 text-sm mb-6">Follow us on social media for updates and community discussions.</p>
                  <div className="flex gap-3">
                    {socialLinks.map((social, idx) => (
                      <a
                        key={idx}
                        href={social.url}
                        className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center backdrop-blur-sm transition-all duration-300 hover:scale-110 group"
                      >
                        <SvgIcon name={social.icon} className="text-white size-5 group-hover:scale-110 transition-transform" />
                      </a>
                    ))}
                  </div>
                </div>
              </AnimationDiv>
            </div>
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

export default ContactPageV2;
