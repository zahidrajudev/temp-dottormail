import MainLayout from "@/layouts/MainLayout";
import SvgIcon from "@/modules/global/icons/svg_icons";
import Section from "@/modules/global/elements/section";
import AnimationDiv from "@/modules/global/animations/animate_div";
import RouterLink from "@/modules/global/elements/router_link";
import { Accordion, AccordionItem } from "@/modules/global/elements/accordion";
import { ReactElement, useState, useEffect, useRef } from "react";
import Head from "next/head";
import Link from "next/link";

// ──────────────────────────────────────────────
// Data
// ──────────────────────────────────────────────

const contactMethods = [
  {
    icon: "mail",
    label: "Email Us",
    value: "hello@dottormail.com",
    description: "We respond within 24 hours.",
    href: "mailto:hello@dottormail.com",
    color: "emerald",
  },
  {
    icon: "call",
    label: "Phone",
    value: "+39 345 443 0397",
    description: "Mon–Fri, 9AM–6PM EST.",
    href: "tel:+393454430397",
    color: "amber",
  },
  {
    icon: "chat_bubble",
    label: "Live Chat",
    value: "Start a conversation",
    description: "Average response time: 2 minutes.",
    href: "#",
    color: "cyan",
    chat: true,
  },
  {
    icon: "support_agent",
    label: "Help Center",
    value: "Browse knowledge base",
    description: "Self-serve answers, 24/7.",
    href: "/docs",
    color: "violet",
  },
];

const supportChannels = [
  {
    icon: "mail",
    title: "Sales Inquiries",
    description: "Questions about plans, pricing, or enterprise needs? Our sales team is ready to help.",
    email: "sales@dottormail.com",
    responseTime: "Responds within 4 hours",
  },
  {
    icon: "support_agent",
    title: "Technical Support",
    description: "Having trouble with integration, API, or account issues? Our engineers are here.",
    email: "support@dottormail.com",
    responseTime: "Responds within 1 hour (priority)",
    priority: true,
  },
  {
    icon: "handshake",
    title: "Partnerships",
    description: "Interested in partnering with us? Let's explore how we can work together.",
    email: "partners@dottormail.com",
    responseTime: "Responds within 48 hours",
  },
  {
    icon: "campaign",
    title: "Media & PR",
    description: "For press inquiries, media assets, or interview requests with our team.",
    email: "press@dottormail.com",
    responseTime: "Responds within 24 hours",
  },
];

const officeLocations = [
  {
    city: "Turin, Italy",
    address: "Strada Val S. Martino, 111",
    region: "10131 Turin, Italy",
    flag: "🇮🇹",
  },
  {
    city: "San Francisco, USA",
    address: "548 Market Street, Suite 200",
    region: "San Francisco, CA 94104",
    flag: "🇺🇸",
  },
];

const faqs = [
  {
    id: "faq-contact-1",
    question: "How quickly do you respond to inquiries?",
    answer: "Most inquiries receive a response within 24 hours. Technical support tickets are prioritized and typically answered within 1 hour during business hours. Live chat offers the fastest response at an average of 2 minutes.",
  },
  {
    id: "faq-contact-2",
    question: "Do you offer phone support?",
    answer: "Yes, phone support is available Monday through Friday, 9:00 AM to 6:00 PM EST. For the fastest resolution, we recommend starting with live chat or submitting a support ticket so our team can prepare before your call.",
  },
  {
    id: "faq-contact-3",
    question: "What information should I include in my support request?",
    answer: "To help us resolve your issue quickly, please include: your account email, a detailed description of the issue, any relevant error messages or screenshots, and steps to reproduce the problem. For API issues, include your request/response logs.",
  },
  {
    id: "faq-contact-4",
    question: "Is there a support SLA for Enterprise plans?",
    answer: "Yes, Enterprise plans include a guaranteed support SLA with priority phone and chat support, a dedicated solutions engineer, and guaranteed response times of under 30 minutes for critical issues during business hours.",
  },
  {
    id: "faq-contact-5",
    question: "Can I schedule a demo before purchasing?",
    answer: "Absolutely! You can book a personalized demo through our sales team. Email sales@dottormail.com or use the live chat to schedule a demo at your convenience. Demos typically run 20–30 minutes and include a Q&A session.",
  },
  {
    id: "faq-contact-6",
    question: "What is your office address?",
    answer: "Our headquarters are located in Turin, Italy at Strada Val S. Martino, 111, 10131 Turin. We also have a satellite office in San Francisco. Check our office locations section for full details and Google Maps integration.",
  },
];

// ──────────────────────────────────────────────
// Contact Page Component
// ──────────────────────────────────────────────

function DottormailContactV2() {
  const [formState, setFormState] = useState({ name: "", email: "", subject: "", message: "" });
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("sending");
    // Simulate submission — replace with actual API call
    setTimeout(() => {
      setFormStatus("success");
      setFormState({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setFormStatus("idle"), 4000);
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <>
      <Head>
        <title>Contact Us — Dottor Mail | We&rsquo;re Here to Help</title>
        <meta
          name="description"
          content="Get in touch with Dottor Mail. Our team is ready to help with sales, support, partnerships, and any questions about email verification."
        />
      </Head>

      {/* ════════════════════════════════════════ */}
      {/* HERO                                       */}
      {/* ════════════════════════════════════════ */}
      <Section fullWidth className="relative min-h-[90vh] overflow-hidden bg-[#0b1120]">
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-5%] w-[55%] h-[55%] bg-emerald-500/[0.03] rounded-full blur-[150px]" />
          <div className="absolute bottom-[-10%] right-[-5%] w-[45%] h-[45%] bg-cyan-500/[0.03] rounded-full blur-[150px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-teal-500/[0.015] rounded-full blur-[180px]" />
        </div>
        <div
          className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)", backgroundSize: "48px 48px" }}
        />
        {/* <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 z-20" /> */}

        <div className="relative z-10 container mx-auto px-5 sm:px-8 pt-32 sm:pt-40 pb-20 min-h-[90vh] flex flex-col items-center justify-center text-center">
          {/* Pill badge */}
          <AnimationDiv initial="opacity-0 translate-y-5" visible="opacity-100 translate-y-0" duration="duration-700">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/15 text-emerald-400 text-xs sm:text-sm font-semibold tracking-wide mb-8 shadow-lg shadow-emerald-500/5">
              <SvgIcon name="chat_bubble" className="size-4" />
              Get in Touch
            </div>
          </AnimationDiv>

          {/* Headline */}
          <AnimationDiv initial="opacity-0 translate-y-7" visible="opacity-100 translate-y-0" duration="duration-700" delay="delay-100">
            <h1 className="text-[clamp(2.5rem,6.5vw,4.5rem)] font-extrabold text-white leading-[1.05] tracking-[-0.03em] mb-6 max-w-4xl mx-auto">
              We&rsquo;d love to{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">hear from you</span>
                <span className="absolute -bottom-1 left-0 right-0 h-3 bg-emerald-400/20 -rotate-1 rounded-full" />
              </span>
              .
            </h1>
          </AnimationDiv>

          <AnimationDiv initial="opacity-0 translate-y-6" visible="opacity-100 translate-y-0" duration="duration-700" delay="delay-200">
            <p className="text-[#94a3b8] text-base sm:text-lg lg:text-xl leading-relaxed max-w-2xl mx-auto mb-14">
              Whether you have a question about our platform, need technical support, or want to explore enterprise plans — our team is ready to help.
            </p>
          </AnimationDiv>

          {/* Contact method cards */}
          <AnimationDiv initial="opacity-0 translate-y-8" visible="opacity-100 translate-y-0" duration="duration-800" delay="delay-300">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto w-full">
              {contactMethods.map((method, idx) => {
                const colorStyles: Record<string, string> = {
                  emerald: "border-emerald-500/20 hover:border-emerald-500/40 bg-emerald-500/[0.03] hover:bg-emerald-500/[0.06] text-emerald-400 group-hover:text-emerald-300",
                  amber: "border-amber-500/20 hover:border-amber-500/40 bg-amber-500/[0.03] hover:bg-amber-500/[0.06] text-amber-400 group-hover:text-amber-300",
                  cyan: "border-cyan-500/20 hover:border-cyan-500/40 bg-cyan-500/[0.03] hover:bg-cyan-500/[0.06] text-cyan-400 group-hover:text-cyan-300",
                  violet: "border-violet-500/20 hover:border-violet-500/40 bg-violet-500/[0.03] hover:bg-violet-500/[0.06] text-violet-400 group-hover:text-violet-300",
                };
                const iconColors: Record<string, string> = {
                  emerald: "bg-emerald-500/10 text-emerald-400",
                  amber: "bg-amber-500/10 text-amber-400",
                  cyan: "bg-cyan-500/10 text-cyan-400",
                  violet: "bg-violet-500/10 text-violet-400",
                };

                const Wrapper = method.chat ? "button" : "a";
                const wrapperProps = method.chat
                  ? { onClick: () => { if ((window as any).Tawk_API) (window as any).Tawk_API.maximize(); } }
                  : { href: method.href };

                return (
                  <Wrapper
                    key={idx}
                    {...wrapperProps}
                    className={`group relative p-5 sm:p-6 rounded-2xl border backdrop-blur-sm transition-all duration-500 text-left flex flex-col items-start ${colorStyles[method.color]}`}
                  >
                    <div className={`size-10 rounded-xl flex items-center justify-center mb-4 transition-colors ${iconColors[method.color]}`}>
                      <SvgIcon name={method.icon} className="size-5" />
                    </div>
                    <div className="text-xs font-semibold text-[#64748b] mb-1">{method.label}</div>
                    <div className="text-sm sm:text-base font-bold text-white mb-1.5 leading-tight">{method.value}</div>
                    <div className="text-[10px] sm:text-xs text-[#475569]">{method.description}</div>
                  </Wrapper>
                );
              })}
            </div>
          </AnimationDiv>
        </div>
      </Section>

      {/* ════════════════════════════════════════ */}
      {/* CONTACT FORM + INFO                        */}
      {/* ════════════════════════════════════════ */}
      <Section fullWidth className="relative py-24 sm:py-32 bg-[#f8fafc] overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-[400px] h-[400px] bg-emerald-400/[0.03] rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-amber-400/[0.02] rounded-full blur-[120px] pointer-events-none" />
        <div
          className="absolute inset-0 opacity-[0.015] pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #000 1px, transparent 0)", backgroundSize: "48px 48px" }}
        />

        <div className="container mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 max-w-6xl mx-auto">
            {/* ── Form ── */}
            <div className="lg:col-span-3 order-2 lg:order-1">
              <AnimationDiv initial="opacity-0 translate-y-6" visible="opacity-100 translate-y-0" duration="duration-700">
                <div className="p-6 sm:p-8 lg:p-10 rounded-3xl bg-white border border-[#e5e7eb] shadow-xl shadow-[#0b1120]/5">
                  <h3 className="text-xl sm:text-2xl font-extrabold text-[#0b1120] mb-2">Send us a message</h3>
                  <p className="text-sm text-[#6b7280] mb-8">Fill out the form below and we&rsquo;ll get back to you within 24 hours.</p>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Name + Email row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="name" className="block text-xs font-semibold text-[#4b5563] mb-1.5 tracking-wide uppercase">
                          Full Name
                        </label>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          required
                          value={formState.name}
                          onChange={handleChange}
                          placeholder="John Doe"
                          className="w-full px-4 py-3 rounded-xl bg-[#f9fafb] border border-[#e5e7eb] text-sm text-[#111827] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all duration-200"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-xs font-semibold text-[#4b5563] mb-1.5 tracking-wide uppercase">
                          Email Address
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formState.email}
                          onChange={handleChange}
                          placeholder="john@example.com"
                          className="w-full px-4 py-3 rounded-xl bg-[#f9fafb] border border-[#e5e7eb] text-sm text-[#111827] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all duration-200"
                        />
                      </div>
                    </div>

                    {/* Subject */}
                    <div>
                      <label htmlFor="subject" className="block text-xs font-semibold text-[#4b5563] mb-1.5 tracking-wide uppercase">
                        Subject
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        required
                        value={formState.subject}
                        onChange={handleChange as any}
                        className="w-full px-4 py-3 rounded-xl bg-[#f9fafb] border border-[#e5e7eb] text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all duration-200 appearance-none"
                      >
                        <option value="" disabled>Select a topic</option>
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Sales & Pricing">Sales &amp; Pricing</option>
                        <option value="Technical Support">Technical Support</option>
                        <option value="Partnerships">Partnerships</option>
                        <option value="Media & PR">Media &amp; PR</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    {/* Message */}
                    <div>
                      <label htmlFor="message" className="block text-xs font-semibold text-[#4b5563] mb-1.5 tracking-wide uppercase">
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={5}
                        value={formState.message}
                        onChange={handleChange}
                        placeholder="Tell us how we can help..."
                        className="w-full px-4 py-3 rounded-xl bg-[#f9fafb] border border-[#e5e7eb] text-sm text-[#111827] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all duration-200 resize-none"
                      />
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={formStatus === "sending" || formStatus === "success"}
                      className="w-full py-3.5 rounded-2xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-400 hover:to-teal-400 shadow-lg shadow-emerald-500/20 transition-all duration-300 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {formStatus === "sending" ? (
                        <>
                          <span className="size-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                          Sending...
                        </>
                      ) : formStatus === "success" ? (
                        <>
                          <SvgIcon name="check_circle" className="size-5" filled />
                          Message Sent!
                        </>
                      ) : (
                        <>
                          Send Message
                          <SvgIcon name="arrow_right_alt" className="size-4" />
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </AnimationDiv>
            </div>

            {/* ── Sidebar Info ── */}
            <div className="lg:col-span-2 order-1 lg:order-2">
              <AnimationDiv initial="opacity-0 translate-y-6" visible="opacity-100 translate-y-0" duration="duration-700" delay="delay-100">
                <div className="space-y-8 lg:sticky lg:top-32">
                  {/* Section header */}
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold mb-4 tracking-widest uppercase">
                      <SvgIcon name="contact_support" className="size-3" />
                      Contact Info
                    </div>
                    <h2 className="text-[clamp(1.5rem,3.5vw,2.2rem)] font-extrabold text-[#0b1120] leading-[1.1] tracking-[-0.02em]">
                      Other ways to reach us
                    </h2>
                    <p className="text-sm text-[#6b7280] mt-3 leading-relaxed">
                      Prefer a different channel? Here are all the ways you can connect with our team.
                    </p>
                  </div>

                  {/* Quick info cards */}
                  <div className="space-y-3">
                    {[
                      { icon: "mail", label: "Email", value: "hello@dottormail.com", href: "mailto:hello@dottormail.com" },
                      { icon: "call", label: "Phone", value: "+39 345 443 0397", href: "tel:+393454430397" },
                      { icon: "schedule", label: "Hours", value: "Mon–Fri, 9AM–6PM EST" },
                      { icon: "location_on", label: "Location", value: "Turin, Italy & San Francisco" },
                    ].map((item, idx) => {
                      const Wrapper = item.href ? "a" : "div";
                      const wrapperProps = item.href ? { href: item.href, className: "group flex items-center gap-4 p-4 rounded-2xl bg-white border border-[#e5e7eb] hover:border-emerald-200/50 hover:shadow-md hover:shadow-emerald-200/10 transition-all duration-300 cursor-pointer" } : { className: "flex items-center gap-4 p-4 rounded-2xl bg-white border border-[#e5e7eb]" };

                      return (
                        <Wrapper key={idx} {...wrapperProps}>
                          <div className="size-11 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0 group-hover:bg-emerald-100 transition-colors">
                            <SvgIcon name={item.icon} className="size-5 text-emerald-600" />
                          </div>
                          <div>
                            <div className="text-[11px] font-semibold text-[#6b7280] uppercase tracking-wide">{item.label}</div>
                            <div className="text-sm font-bold text-[#111827] group-hover:text-emerald-700 transition-colors">{item.value}</div>
                          </div>
                        </Wrapper>
                      );
                    })}
                  </div>

                  {/* Response time guarantee */}
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100/60">
                    <div className="flex items-start gap-3">
                      <div className="size-9 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                        <SvgIcon name="verified" className="size-5 text-emerald-600" filled />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-[#065f46] mb-1">Fast Response Guarantee</div>
                        <p className="text-xs text-[#047857] leading-relaxed">
                          We aim to respond to all inquiries within 24 hours. Enterprise customers receive priority support with sub-30 minute response times for critical issues.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimationDiv>
            </div>
          </div>
        </div>
      </Section>

      {/* ════════════════════════════════════════ */}
      {/* SUPPORT CHANNELS                          */}
      {/* ════════════════════════════════════════ */}
      <Section fullWidth className="relative py-24 sm:py-32 bg-white overflow-hidden">
        <div className="absolute top-1/2 right-[-10%] w-[500px] h-[500px] bg-teal-400/[0.02] rounded-full blur-[120px] pointer-events-none" />

        <div className="container mx-auto px-5 sm:px-8">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <AnimationDiv initial="opacity-0 translate-y-6" visible="opacity-100 translate-y-0" duration="duration-700">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 text-amber-700 text-[11px] sm:text-xs font-bold mb-5 tracking-widest uppercase">
                <SvgIcon name="support_agent" className="size-3.5" />
                Choose a Channel
              </div>
              <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-extrabold text-[#0b1120] leading-[1.1] tracking-[-0.02em]">
                The right support for{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">every need</span>.
              </h2>
              <p className="text-[#6b7280] text-base sm:text-lg mt-5 max-w-lg mx-auto leading-relaxed">
                Different questions deserve different experts. Reach the right team directly.
              </p>
            </AnimationDiv>
          </div>

          {/* Channel cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-4xl mx-auto">
            {supportChannels.map((channel, idx) => (
              <AnimationDiv
                key={idx}
                initial="opacity-0 translate-y-6"
                visible="opacity-100 translate-y-0"
                duration="duration-700"
                delay={`delay-${idx * 100}`}
              >
                <div className="group relative p-6 sm:p-8 rounded-2xl border border-[#e5e7eb] bg-white hover:border-emerald-200/50 hover:shadow-xl hover:shadow-emerald-200/10 transition-all duration-500 h-full">
                  {channel.priority && (
                    <div className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[10px] font-bold tracking-wide shadow-lg shadow-emerald-500/20">
                      Priority Support
                    </div>
                  )}

                  <div className="size-12 rounded-2xl bg-emerald-50 flex items-center justify-center mb-5 group-hover:bg-emerald-100 transition-colors">
                    <SvgIcon name={channel.icon} className="size-6 text-emerald-600" />
                  </div>

                  <h3 className="text-lg font-bold text-[#111827] mb-2">{channel.title}</h3>
                  <p className="text-sm text-[#6b7280] mb-5 leading-relaxed">{channel.description}</p>

                  <div className="flex items-center justify-between pt-4 border-t border-[#f1f5f9]">
                    <a
                      href={`mailto:${channel.email}`}
                      className="flex items-center gap-1.5 text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                    >
                      <SvgIcon name="mail" className="size-4" />
                      {channel.email}
                    </a>
                    <span className="text-[10px] sm:text-xs text-[#9ca3af] flex items-center gap-1">
                      <SvgIcon name="schedule" className="size-3" />
                      {channel.responseTime}
                    </span>
                  </div>
                </div>
              </AnimationDiv>
            ))}
          </div>
        </div>
      </Section>

      {/* ════════════════════════════════════════ */}
      {/* OFFICE LOCATIONS + MAP                    */}
      {/* ════════════════════════════════════════ */}
      <Section fullWidth className="relative py-24 sm:py-32 bg-[#fafafa] overflow-hidden">
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-cyan-400/[0.02] rounded-full blur-[120px] pointer-events-none" />
        <div
          className="absolute inset-0 opacity-[0.015] pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #000 1px, transparent 0)", backgroundSize: "48px 48px" }}
        />

        <div className="container mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 max-w-5xl mx-auto">
            {/* Left: Locations */}
            <div className="flex flex-col justify-center">
              <AnimationDiv initial="opacity-0 translate-y-6" visible="opacity-100 translate-y-0" duration="duration-700">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 text-cyan-700 text-[10px] font-bold mb-4 tracking-widest uppercase">
                  <SvgIcon name="location_on" className="size-3" />
                  Our Offices
                </div>
                <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] font-extrabold text-[#0b1120] leading-[1.1] tracking-[-0.02em] mb-6">
                  Visit us at one of our global offices.
                </h2>
                <p className="text-sm sm:text-base text-[#6b7280] leading-relaxed mb-10 max-w-md">
                  Our team works across two continents. Drop by, schedule a meeting, or send us mail — we&rsquo;d love to connect in person.
                </p>
              </AnimationDiv>

              {/* Location cards */}
              <div className="space-y-4">
                {officeLocations.map((loc, idx) => (
                  <AnimationDiv
                    key={idx}
                    initial="opacity-0 translate-x-6"
                    visible="opacity-100 translate-x-0"
                    duration="duration-700"
                    delay={`delay-${idx * 150}`}
                  >
                    <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-[#e5e7eb] hover:border-cyan-200/50 hover:shadow-lg transition-all duration-300">
                      <div className="text-2xl leading-none mt-0.5">{loc.flag}</div>
                      <div>
                        <div className="text-base font-bold text-[#111827] mb-1">{loc.city}</div>
                        <div className="text-sm text-[#6b7280]">{loc.address}</div>
                        <div className="text-sm text-[#6b7280]">{loc.region}</div>
                      </div>
                    </div>
                  </AnimationDiv>
                ))}
              </div>
            </div>

            {/* Right: Map */}
            <AnimationDiv initial="opacity-0 translate-y-8" visible="opacity-100 translate-y-0" duration="duration-800" delay="delay-200">
              <div className="relative h-[320px] sm:h-[400px] lg:h-[480px] rounded-2xl overflow-hidden border border-[#e5e7eb] shadow-xl shadow-[#0b1120]/5">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2818.4981910297074!2d7.7195421122101475!3d45.0554040709495!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x478872c186267ec3%3A0xdb1f5f5559a4d48b!2sStrada%20Val%20S.%20Martino%2C%20111%2C%2010131%20Torino%20TO%2C%20Italy!5e0!3m2!1sen!2sbd!4v1767605431359!5m2!1sen!2sbd"
                  width="100%"
                  height="100%"
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0"
                  title="Dottor Mail Turin Office"
                />
              </div>
            </AnimationDiv>
          </div>
        </div>
      </Section>

      {/* ════════════════════════════════════════ */}
      {/* FAQ                                          */}
      {/* ════════════════════════════════════════ */}
      <Section fullWidth className="relative py-24 sm:py-32 bg-white overflow-hidden">
        <div className="absolute top-1/3 left-[-10%] w-[400px] h-[400px] bg-emerald-400/[0.02] rounded-full blur-[100px] pointer-events-none" />

        <div className="container mx-auto px-5 sm:px-8">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <AnimationDiv initial="opacity-0 translate-y-6" visible="opacity-100 translate-y-0" duration="duration-700">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] sm:text-xs font-bold mb-5 tracking-widest uppercase">
                <SvgIcon name="chat_bubble" className="size-3.5" />
                Quick Answers
              </div>
              <h2 className="text-[clamp(1.8rem,4.5vw,3rem)] font-extrabold text-[#0b1120] leading-[1.1] tracking-[-0.02em]">
                Frequently asked{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">questions</span>.
              </h2>
              <p className="text-[#6b7280] text-base sm:text-lg mt-5 max-w-lg mx-auto leading-relaxed">
                Find quick answers to common questions about contacting us and getting support.
              </p>
            </AnimationDiv>
          </div>

          {/* Accordion */}
          <AnimationDiv initial="opacity-0 translate-y-6" visible="opacity-100 translate-y-0" duration="duration-700" delay="delay-200">
            <div className="max-w-2xl mx-auto">
              <Accordion>
                {faqs.map((faq, idx) => (
                  <AccordionItem
                    key={faq.id}
                    id={faq.id}
                    title={{
                      icon: (
                        <div className={`size-8 rounded-lg flex items-center justify-center transition-colors ${
                          idx % 2 === 0 ? "bg-emerald-50" : "bg-cyan-50"
                        }`}>
                          <SvgIcon name={idx % 2 === 0 ? "contact_support" : "support_agent"} className={`size-4 ${idx % 2 === 0 ? "text-emerald-600" : "text-cyan-600"}`} filled />
                        </div>
                      ),
                      label: faq.question,
                    }}
                  >
                    <p className="text-sm text-[#6b7280] leading-relaxed px-4 py-3">{faq.answer}</p>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </AnimationDiv>

          {/* Still have questions */}
          <AnimationDiv initial="opacity-0" visible="opacity-100" duration="duration-700" delay="delay-400">
            <div className="text-center mt-12">
              <p className="text-sm text-[#6b7280]">
                Still have questions?{" "}
                <button
                  onClick={() => { if ((window as any).Tawk_API) (window as any).Tawk_API.maximize(); }}
                  className="text-emerald-600 font-semibold hover:text-emerald-700 underline underline-offset-2 transition-colors"
                >
                  Chat with us live
                </button>
              </p>
            </div>
          </AnimationDiv>
        </div>
      </Section>

      {/* ════════════════════════════════════════ */}
      {/* FINAL CTA                                  */}
      {/* ════════════════════════════════════════ */}
      <Section fullWidth className="relative py-24 sm:py-32 bg-[#f8fafc] overflow-hidden">
        <div className="container mx-auto px-5 sm:px-8">
          <AnimationDiv initial="opacity-0 translate-y-8" visible="opacity-100 translate-y-0" duration="duration-700">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0b1120] via-[#111d33] to-[#0b1120] p-10 sm:p-16 lg:p-20 text-center shadow-2xl shadow-[#0b1120]/30">
              <div className="absolute top-[-30%] left-[-15%] w-[400px] h-[400px] bg-emerald-500/[0.04] rounded-full blur-[120px] pointer-events-none" />
              <div className="absolute bottom-[-30%] right-[-15%] w-[400px] h-[400px] bg-teal-500/[0.04] rounded-full blur-[120px] pointer-events-none" />
              <div
                className="absolute inset-0 opacity-[0.015] pointer-events-none"
                style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)", backgroundSize: "32px 32px" }}
              />

              <div className="relative z-10 max-w-2xl mx-auto">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[11px] sm:text-xs font-bold mb-6 tracking-widest uppercase border border-emerald-500/10">
                  <SvgIcon name="rocket_launch" className="size-3.5" />
                  Start Free Today
                </div>
                <h2 className="text-[clamp(1.8rem,4.5vw,3.2rem)] font-extrabold text-white leading-[1.1] tracking-[-0.02em] mb-5">
                  Ready to clean your email list?
                </h2>
                <p className="text-[#94a3b8] text-base sm:text-lg mb-10 max-w-md mx-auto leading-relaxed">
                  Join 10,000+ businesses that trust Dottor Mail. No credit card required. Cancel anytime.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <RouterLink href="/register">
                    <div className="group inline-flex items-center gap-2.5 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold rounded-2xl transition-all duration-300 shadow-xl shadow-emerald-500/25 active:scale-[0.97]">
                      <span className="text-sm sm:text-base">Get Started Free</span>
                      <SvgIcon name="arrow_right_alt" className="size-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </RouterLink>
                  <Link
                    href="/pricing"
                    className="inline-flex items-center gap-2 px-8 py-4 text-[#94a3b8] hover:text-white text-sm font-semibold rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300"
                  >
                    View Pricing
                    <SvgIcon name="arrow_right_alt" className="size-4" />
                  </Link>
                </div>
              </div>
            </div>
          </AnimationDiv>
        </div>
      </Section>
    </>
  );
}

// ──────────────────────────────────────────────
// Layout
// ──────────────────────────────────────────────

export default DottormailContactV2;