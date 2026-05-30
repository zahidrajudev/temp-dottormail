import SvgIcon from "@/modules/global/icons/svg_icons";
import { motion, Variants } from "framer-motion";

export default function EmailFinderPage() {
  // Animation variants
  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      {/* =========================================
          SECTION 1: HERO (Dark gradient style)
      ========================================= */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-slate-950">
        {/* Glowing Background Orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full overflow-hidden pointer-events-none">
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-500/30 blur-[120px]"
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.4, 0.3] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/30 blur-[120px]"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 mb-8 font-medium text-sm"
          >
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            New Feature: Bulk Email Finder is now live
          </motion.div>

          <motion.h1 variants={fadeUp} initial="hidden" animate="visible" className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6">
            Find anyone's email address <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400">in milliseconds.</span>
          </motion.h1>

          <motion.p variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.1 }} className="mt-4 text-xl text-slate-300 max-w-2xl mx-auto mb-10">
            Connect with decision-makers instantly. Our verified B2B database gives you direct access to the people who matter most to your business.
          </motion.p>

          {/* Interactive Search Mockup */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
            className="max-w-3xl mx-auto bg-white/10 backdrop-blur-xl p-2 rounded-2xl border border-white/20 shadow-2xl flex flex-col md:flex-row gap-2"
          >
            <div className="flex-1 flex items-center bg-white/5 rounded-xl px-4 py-3">
              <SvgIcon name="person" className="size-5 text-cyan-400 mr-3" />
              <input type="text" placeholder="First & Last Name" className="bg-transparent w-full text-white placeholder-slate-400 focus:outline-none" />
            </div>
            <div className="flex-1 flex items-center bg-white/5 rounded-xl px-4 py-3">
              <SvgIcon name="language" className="size-5 text-emerald-400 mr-3" />
              <input type="text" placeholder="Company Domain" className="bg-transparent w-full text-white placeholder-slate-400 focus:outline-none" />
            </div>
            <button className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white px-8 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25">
              <SvgIcon name="search" className="size-5" />
              Find Email
            </button>
          </motion.div>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
            className="mt-6 text-sm text-slate-400 flex items-center justify-center gap-6"
          >
            <span className="flex items-center gap-2">
              <SvgIcon name="check_circle" className="size-4 text-emerald-400" /> 99% Deliverability
            </span>
            <span className="flex items-center gap-2">
              <SvgIcon name="verified" className="size-4 text-emerald-400" /> Real-time Verification
            </span>
          </motion.p>
        </div>
      </section>

      {/* =========================================
          SECTION 2: SOCIAL PROOF / TRUSTED BY
      ========================================= */}
      <section className="py-10 border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-6">Trusted by modern sales teams at</p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale">
            {/* Replace with actual client logos */}
            <h3 className="text-xl font-bold">Acme Corp</h3>
            <h3 className="text-xl font-bold">GlobalTech</h3>
            <h3 className="text-xl font-bold">Innovate.io</h3>
            <h3 className="text-xl font-bold">Nexus</h3>
            <h3 className="text-xl font-bold">Stark Ind.</h3>
          </div>
        </div>
      </section>

      {/* =========================================
          SECTION 3: FEATURES GRID
      ========================================= */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Everything you need to build your pipeline</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Stop guessing email addresses. Use our proprietary algorithm to find and verify professional contact information instantly.
            </p>
          </div>

          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <motion.div variants={fadeUp} className="p-8 rounded-3xl bg-white border border-slate-200 hover:shadow-xl hover:border-cyan-200 transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-cyan-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <SvgIcon name="search" className="size-7 text-cyan-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Domain & Name Search</h3>
              <p className="text-slate-600 leading-relaxed">Enter a name and a company website to instantly reveal their exact, verified corporate email address.</p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div variants={fadeUp} className="p-8 rounded-3xl bg-white border border-slate-200 hover:shadow-xl hover:border-teal-200 transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <SvgIcon name="check" className="size-7 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Real-time Verification</h3>
              <p className="text-slate-600 leading-relaxed">We perform live SMTP checks to guarantee the email won't bounce, protecting your sender reputation.</p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div variants={fadeUp} className="p-8 rounded-3xl bg-white border border-slate-200 hover:shadow-xl hover:border-emerald-200 transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <SvgIcon name="folder" className="size-7 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Bulk Enrichment</h3>
              <p className="text-slate-600 leading-relaxed">Upload a CSV of thousands of leads and let our engine find all their email addresses in the background.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* =========================================
          SECTION 4: HOW IT WORKS (Visual Mockup)
      ========================================= */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:w-1/2 space-y-6"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Find prospects directly from their domain.</h2>
            <p className="text-lg text-slate-600">
              Just type in a company's website, and we'll provide a list of all public email addresses associated with that domain, categorized by department.
            </p>
            <ul className="space-y-4 pt-4">
              {["Find decision makers by job title", "Export lists directly to CSV or CRM", "Filter by department (Sales, HR, Tech)"].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                  <div className="flex-shrink-0 size-6 rounded-full bg-teal-100 flex items-center justify-center">
                    <SvgIcon name="check" className="size-4 text-teal-600" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:w-1/2 w-full"
          >
            {/* Fake Browser Window */}
            <div className="bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-800">
              <div className="flex items-center px-4 py-3 bg-slate-800/50 border-b border-slate-700/50 gap-2">
                <div className="size-3 rounded-full bg-red-500"></div>
                <div className="size-3 rounded-full bg-yellow-500"></div>
                <div className="size-3 rounded-full bg-green-500"></div>
              </div>
              <div className="p-6">
                <div className="flex bg-slate-800 rounded-lg p-2 mb-6">
                  <span className="text-slate-400 px-3 py-2">microsoft.com</span>
                  <button className="ml-auto bg-teal-500 text-white px-4 py-2 rounded-md text-sm font-semibold">Search</button>
                </div>
                <div className="space-y-4">
                  {[
                    { name: "Satya Nadella", role: "CEO", email: "satya@microsoft.com" },
                    { name: "Amy Hood", role: "CFO", email: "amy.hood@microsoft.com" },
                    { name: "Brad Smith", role: "President", email: "brad.smith@microsoft.com" },
                  ].map((person, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                      <div>
                        <div className="text-white font-medium">{person.name}</div>
                        <div className="text-slate-400 text-sm">{person.role}</div>
                      </div>
                      <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium bg-emerald-400/10 px-3 py-1.5 rounded-full">
                        <SvgIcon name="check_circle" className="size-4" />
                        {person.email}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* =========================================
          SECTION 5: DATA ACCURACY / STATS
      ========================================= */}
      <section className="py-20 bg-gradient-to-r from-cyan-900 via-teal-900 to-emerald-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid md:grid-cols-3 gap-8 text-center">
            <motion.div variants={fadeUp} className="p-6">
              <div className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-cyan-300 to-emerald-300 mb-2">99%</div>
              <div className="text-lg font-medium text-teal-100">Delivery Rate Guarantee</div>
            </motion.div>
            <motion.div variants={fadeUp} className="p-6 border-y md:border-y-0 md:border-x border-teal-700/50">
              <div className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-cyan-300 to-emerald-300 mb-2">250M+</div>
              <div className="text-lg font-medium text-teal-100">Verified Professionals</div>
            </motion.div>
            <motion.div variants={fadeUp} className="p-6">
              <div className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-cyan-300 to-emerald-300 mb-2">&lt;1s</div>
              <div className="text-lg font-medium text-teal-100">Average Search Time</div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* =========================================
          SECTION 6: USE CASES
      ========================================= */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Built for teams that need to grow</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div whileHover={{ y: -5 }} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
              <SvgIcon name="trending_up" className="size-10 text-cyan-500 mb-6" />
              <h3 className="text-2xl font-bold text-slate-900 mb-4">For Sales Teams</h3>
              <p className="text-slate-600 mb-6">
                Stop hunting for contact info. Spend your time actually selling by getting direct access to decision-makers instantly.
              </p>
              <a href="#" className="text-cyan-600 font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                Learn more <SvgIcon name="arrow_forward" className="size-4" />
              </a>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
              <SvgIcon name="groups" className="size-10 text-teal-500 mb-6" />
              <h3 className="text-2xl font-bold text-slate-900 mb-4">For Recruiters</h3>
              <p className="text-slate-600 mb-6">Reach passive candidates directly in their inbox. Bypass LinkedIn limits and connect with top talent faster.</p>
              <a href="#" className="text-teal-600 font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                Learn more <SvgIcon name="arrow_forward" className="size-4" />
              </a>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
              <SvgIcon name="campaign" className="size-10 text-emerald-500 mb-6" />
              <h3 className="text-2xl font-bold text-slate-900 mb-4">For Marketers</h3>
              <p className="text-slate-600 mb-6">Build highly targeted outreach lists for your cold email campaigns, PR outreach, and link-building efforts.</p>
              <a href="#" className="text-emerald-600 font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                Learn more <SvgIcon name="arrow_forward" className="size-4" />
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =========================================
          SECTION 7: TESTIMONIALS
      ========================================= */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 mb-16">Don't just take our word for it</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-slate-50 p-8 rounded-3xl border border-slate-200 relative"
            >
              <SvgIcon name="format_quote" className="size-12 text-teal-200 absolute top-6 right-6" />
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <SvgIcon key={i} name="star" className="size-5 text-yellow-400" />
                ))}
              </div>
              <p className="text-lg text-slate-700 italic mb-8">
                "This tool completely transformed our outbound process. We went from finding 50 emails a day manually to enriching lists of 5,000 in minutes. Our reply
                rates have never been higher."
              </p>
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-full bg-cyan-200 flex items-center justify-center">
                  <SvgIcon name="person" className="size-5 text-black" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">Sarah Jenkins</div>
                  <div className="text-sm text-slate-500">VP of Sales, TechFlow</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-slate-50 p-8 rounded-3xl border border-slate-200 relative"
            >
              <SvgIcon name="format_quote" className="size-12 text-teal-200 absolute top-6 right-6" />
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <SvgIcon key={i} name="star" className="size-5 text-yellow-400" />
                ))}
              </div>
              <p className="text-lg text-slate-700 italic mb-8">
                "The data accuracy is unmatched. We used to struggle with high bounce rates using other tools, but since switching to this platform, our deliverability is
                consistently at 99%."
              </p>
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-full bg-emerald-200 flex items-center justify-center">
                  <SvgIcon name="person" className="size-5 text-black" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">David Chen</div>
                  <div className="text-sm text-slate-500">Lead Recruiter, Horizon</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =========================================
          SECTION 8: BOTTOM CTA
      ========================================= */}
      <section className="py-24 relative overflow-hidden bg-slate-950">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-500/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-500/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/3 pointer-events-none"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            Ready to supercharge your outreach?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-teal-100 mb-10 max-w-2xl mx-auto"
          >
            Join thousands of professionals who are already booking more meetings and closing more deals.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button className="w-full sm:w-auto bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2">
              Start finding emails for free <SvgIcon name="arrow_forward" className="size-5" />
            </button>
            <button className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-4 rounded-xl font-bold text-lg transition-all backdrop-blur-md">
              View Pricing
            </button>
          </motion.div>
          <p className="mt-6 text-sm text-slate-400">No credit card required • 50 free searches per month</p>
        </div>
      </section>
    </div>
  );
}
