import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SvgIcon from "@/modules/global/icons/svg_icons";

export default function DottormailDashboardEmailFinder() {
  // States: 'idle', 'searching', 'success'
  const [searchState, setSearchState] = useState("idle");
  const [searchProgress, setSearchProgress] = useState(0);
  const [activeTab, setActiveTab] = useState("single"); // 'single' or 'bulk'

  // Form States
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [domain, setDomain] = useState("");

  // Simulate Search Function
  const handleSearch = (e: any) => {
    e.preventDefault();
    if (!firstName || !domain) return;

    setSearchState("searching");
    setSearchProgress(0);

    // Simulate progress animation
    const interval = setInterval(() => {
      setSearchProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setSearchState("success"), 400); // Small delay before showing result
          return 100;
        }
        return prev + Math.floor(Math.random() * 15) + 5;
      });
    }, 300);
  };

  const resetSearch = () => {
    setSearchState("idle");
    setFirstName("");
    setLastName("");
    setDomain("");
    setSearchProgress(0);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-6 lg:p-8 font-sans text-slate-900 rounded-[32px]">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-xl text-white shadow-lg shadow-emerald-500/20">
            <SvgIcon name="search" className="size-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Email Finder</h1>
            <p className="text-sm text-slate-500 font-medium">Locate verified contact information instantly.</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
          <SvgIcon name="generating_tokens" className="size-5 text-teal-500" />
          <div className="text-sm font-semibold text-slate-700">
            Credits: <span className="text-teal-600">1,245</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* ================= LEFT COLUMN: SEARCH TOOL ================= */}
        <div className="xl:col-span-5 space-y-6">
          <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-slate-100 p-2 gap-2 bg-slate-50/50">
              <button
                onClick={() => setActiveTab("single")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === "single" ? "bg-white text-teal-700 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"}`}
              >
                <SvgIcon name="person" className="size-4" /> Single Search
              </button>
              <button
                onClick={() => setActiveTab("bulk")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === "bulk" ? "bg-white text-teal-700 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"}`}
              >
                <SvgIcon name="list_alt" className="size-4" /> Bulk Upload
              </button>
            </div>

            {/* Form Area */}
            <div className="p-6">
              <AnimatePresence mode="wait">
                {activeTab === "single" ? (
                  <motion.form
                    key="single"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    onSubmit={handleSearch}
                    className="space-y-5"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">First Name *</label>
                        <div className="relative">
                          <SvgIcon name="badge" className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
                          <input
                            required
                            disabled={searchState !== "idle"}
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="e.g. John"
                            className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 rounded-xl py-3 pl-10 pr-4 transition-all text-sm font-medium disabled:opacity-50"
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">Last Name</label>
                        <div className="relative">
                          <input
                            disabled={searchState !== "idle"}
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder="e.g. Doe (Optional)"
                            className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 rounded-xl py-3 px-4 transition-all text-sm font-medium disabled:opacity-50"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">Company Domain *</label>
                      <div className="relative">
                        <SvgIcon name="language" className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
                        <input
                          required
                          disabled={searchState !== "idle"}
                          type="text"
                          value={domain}
                          onChange={(e) => setDomain(e.target.value)}
                          placeholder="e.g. microsoft.com"
                          className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 rounded-xl py-3 pl-10 pr-4 transition-all text-sm font-medium disabled:opacity-50"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={searchState !== "idle" || !firstName || !domain}
                      className="w-full mt-4 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold py-3.5 rounded-xl shadow-md shadow-emerald-500/20 transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <SvgIcon name="search" className="size-5" />
                      Find Email Address
                    </button>
                  </motion.form>
                ) : (
                  <motion.div
                    key="bulk"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="space-y-5 text-center py-6"
                  >
                    <div className="border-2 border-dashed border-teal-200 bg-teal-50/50 rounded-2xl p-8 hover:bg-teal-50 transition-colors cursor-pointer group">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:scale-110 transition-transform">
                        <SvgIcon name="cloud_upload" className="size-8 text-teal-500" />
                      </div>
                      <h3 className="font-bold text-slate-700 mb-1">Drag & Drop your CSV file</h3>
                      <p className="text-xs text-slate-500 mb-4">Must contain "First Name", "Last Name", and "Domain" columns.</p>
                      <button className="bg-white border border-slate-200 text-teal-600 hover:bg-slate-50 font-semibold py-2 px-6 rounded-lg text-sm transition-all shadow-sm">
                        Browse Files
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Quick Info Widget */}
          <div className="bg-gradient-to-br from-cyan-900 to-teal-900 rounded-[24px] p-6 text-white relative overflow-hidden">
            <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-cyan-500/30 blur-2xl rounded-full"></div>
            <div className="relative z-10 flex items-start gap-4">
              <div className="p-2 bg-white/10 rounded-xl backdrop-blur-sm shrink-0">
                <SvgIcon name="info" className="size-6 text-cyan-200" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-cyan-50 mb-1">Search Tips</h3>
                <p className="text-sm text-cyan-100/80 leading-relaxed">
                  For the most accurate results, ensure the company domain is the primary website (e.g., use <strong>google.com</strong> instead of{" "}
                  <strong>google.co.uk</strong>).
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ================= RIGHT COLUMN: OUTPUT / PROGRESS ================= */}
        <div className="xl:col-span-7 h-full min-h-[400px]">
          <AnimatePresence mode="wait">
            {/* STATE 1: IDLE */}
            {searchState === "idle" && (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full bg-white rounded-[24px] shadow-sm border border-slate-100 flex flex-col items-center justify-center p-10 text-center border-dashed"
              >
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                  <SvgIcon name="travel_explore" className="size-12 text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-700 mb-2">Awaiting Search Query</h3>
                <p className="text-slate-500 max-w-sm">Enter a prospect's name and company domain on the left to discover their verified email address.</p>
              </motion.div>
            )}

            {/* STATE 2: SEARCHING / PROGRESS */}
            {searchState === "searching" && (
              <motion.div
                key="searching"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="h-full bg-white rounded-[24px] shadow-sm border border-slate-100 flex flex-col items-center justify-center p-10 text-center relative overflow-hidden"
              >
                {/* Radar / Scanning Animation */}
                <div className="relative w-32 h-32 mb-8 flex items-center justify-center">
                  <motion.div
                    animate={{ scale: [1, 2.5], opacity: [0.5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                    className="absolute inset-0 bg-teal-400 rounded-full"
                  />
                  <div className="relative z-10 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-teal-100">
                    <SvgIcon name="radar" className="size-8 text-teal-600 animate-spin-slow" />
                  </div>
                </div>

                <h3 className="text-xl font-bold text-slate-800 mb-2">Scanning Databases...</h3>
                <p className="text-slate-500 text-sm mb-8 animate-pulse">
                  Running SMTP checks and cross-referencing sources for <span className="font-semibold text-teal-600">{domain}</span>
                </p>

                {/* Progress Bar */}
                <div className="w-full max-w-md bg-slate-100 rounded-full h-2.5 mb-2 overflow-hidden">
                  <motion.div
                    className="bg-gradient-to-r from-cyan-500 to-emerald-500 h-2.5 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${searchProgress}%` }}
                    transition={{ ease: "linear" }}
                  />
                </div>
                <div className="text-xs font-bold text-slate-400">{searchProgress}% Complete</div>
              </motion.div>
            )}

            {/* STATE 3: SUCCESS RESULT */}
            {searchState === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[24px] shadow-lg shadow-slate-200/50 border border-slate-100 overflow-hidden"
              >
                {/* Result Header */}
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 border-b border-emerald-100 flex justify-between items-start">
                  <div className="flex gap-4">
                    <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-emerald-100 flex items-center justify-center text-xl font-bold text-emerald-600 uppercase">
                      {firstName.charAt(0)}
                      {lastName ? lastName.charAt(0) : ""}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-800 capitalize">
                        {firstName} {lastName}
                      </h2>
                      <div className="flex items-center gap-2 mt-1">
                        <SvgIcon name="domain" className="size-4 text-slate-400" />
                        <a href={`https://${domain}`} target="_blank" className="text-sm font-medium text-teal-600 hover:underline">
                          {domain}
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 mb-2 border border-emerald-200">
                      <SvgIcon name="verified" className="size-4" /> Highly Confident
                    </div>
                    <span className="text-xs text-slate-400 font-medium">Found in 1.2s</span>
                  </div>
                </div>

                {/* Primary Email Output */}
                <div className="p-8">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">Verified Email Address</label>
                  <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-50 border border-slate-200 rounded-2xl p-4 group hover:border-teal-300 transition-colors">
                    <div className="flex-1 w-full flex items-center gap-3 overflow-hidden">
                      <div className="p-2 bg-emerald-500 rounded-xl text-white shrink-0">
                        <SvgIcon name="mail" className="size-6" />
                      </div>
                      <span className="text-lg sm:text-xl font-bold text-slate-800 truncate select-all">
                        {firstName.toLowerCase()}.{lastName ? lastName.toLowerCase() : "contact"}@{domain}
                      </span>
                    </div>
                    <button className="w-full sm:w-auto shrink-0 bg-white border border-slate-200 hover:border-teal-500 hover:text-teal-600 text-slate-600 px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all flex items-center justify-center gap-2">
                      <SvgIcon name="content_copy" className="size-4" /> Copy Email
                    </button>
                  </div>

                  {/* Meta Stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
                    <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm text-center">
                      <SvgIcon name="dns" className="size-5 text-cyan-500 mx-auto mb-2" />
                      <div className="text-xs text-slate-400 font-semibold mb-1">MX Records</div>
                      <div className="text-sm font-bold text-slate-700">Valid</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm text-center">
                      <SvgIcon name="mark_email_read" className="size-5 text-emerald-500 mx-auto mb-2" />
                      <div className="text-xs text-slate-400 font-semibold mb-1">SMTP Check</div>
                      <div className="text-sm font-bold text-emerald-600">Passed</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm text-center">
                      <SvgIcon name="contact_mail" className="size-5 text-teal-500 mx-auto mb-2" />
                      <div className="text-xs text-slate-400 font-semibold mb-1">Catch-All</div>
                      <div className="text-sm font-bold text-slate-700">No</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm text-center">
                      <SvgIcon name="score" className="size-5 text-emerald-500 mx-auto mb-2" />
                      <div className="text-xs text-slate-400 font-semibold mb-1">Score</div>
                      <div className="text-sm font-bold text-emerald-600">98%</div>
                    </div>
                  </div>
                </div>

                {/* Footer Actions / Download Options */}
                <div className="bg-slate-50 p-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <button onClick={resetSearch} className="text-sm font-bold text-slate-500 hover:text-teal-600 transition-colors flex items-center gap-1">
                    <SvgIcon name="refresh" className="size-4" /> Search Again
                  </button>

                  <div className="flex gap-3 w-full sm:w-auto">
                    <button className="flex-1 sm:flex-none bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all flex items-center justify-center gap-2">
                      <SvgIcon name="bookmark_add" className="size-4" /> Save to List
                    </button>

                    {/* Download Dropdown (Simplified as a primary split button style here) */}
                    <div className="relative flex-1 sm:flex-none flex group cursor-pointer">
                      <button className="w-full sm:w-auto bg-slate-800 hover:bg-slate-900 text-white px-5 py-2.5 rounded-l-xl text-sm font-bold shadow-sm transition-all flex items-center justify-center gap-2 border-r border-slate-700">
                        <SvgIcon name="download" className="size-4" /> Export
                      </button>
                      <button className="bg-slate-800 hover:bg-slate-900 text-white px-3 py-2.5 rounded-r-xl shadow-sm transition-all flex items-center justify-center">
                        <SvgIcon name="expand_more" className="size-4" />
                      </button>

                      {/* Hover Tooltip/Menu mock */}
                      <div className="absolute bottom-full right-0 mb-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 overflow-hidden z-20">
                        <div className="px-4 py-2.5 hover:bg-slate-50 text-sm font-semibold text-slate-700 flex items-center gap-2 border-b border-slate-100">
                          <SvgIcon name="table_chart" className="size-4 text-emerald-500" /> Download CSV
                        </div>
                        <div className="px-4 py-2.5 hover:bg-slate-50 text-sm font-semibold text-slate-700 flex items-center gap-2 border-b border-slate-100">
                          <SvgIcon name="dataset" className="size-4 text-emerald-600" /> Download Excel
                        </div>
                        <div className="px-4 py-2.5 hover:bg-slate-50 text-sm font-semibold text-slate-700 flex items-center gap-2">
                          <SvgIcon name="picture_as_pdf" className="size-4 text-rose-500" /> Save as PDF
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ================= RECENT SEARCHES HISTORY ================= */}
      <div className="mt-8 bg-white rounded-[24px] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <SvgIcon name="history" className="size-5 text-slate-400" /> Recent Finds
          </h2>
          <button className="text-sm font-bold text-teal-600 hover:text-teal-700">View All History</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-4">Name / Domain</th>
                <th className="px-6 py-4">Result</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-800">Sarah Jenkins</div>
                  <div className="text-slate-500 text-xs mt-0.5">acmecorp.com</div>
                </td>
                <td className="px-6 py-4 font-medium text-slate-700">sarah.j@acmecorp.com</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                    <SvgIcon name="check_circle" className="size-3" /> Valid
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-slate-400 hover:text-teal-600 p-2">
                    <SvgIcon name="content_copy" className="size-4" />
                  </button>
                  <button className="text-slate-400 hover:text-teal-600 p-2">
                    <SvgIcon name="download" className="size-4" />
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-800">Michael Ross</div>
                  <div className="text-slate-500 text-xs mt-0.5">specter.io</div>
                </td>
                <td className="px-6 py-4 font-medium text-slate-700">m.ross@specter.io</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 border border-amber-200">
                    <SvgIcon name="warning" className="size-3" /> Catch-All
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-slate-400 hover:text-teal-600 p-2">
                    <SvgIcon name="content_copy" className="size-4" />
                  </button>
                  <button className="text-slate-400 hover:text-teal-600 p-2">
                    <SvgIcon name="download" className="size-4" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
