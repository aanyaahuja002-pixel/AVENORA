"use client";

import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ContactInquiryData, StorageSubmissionResult } from "@/types";
import { submitContactInquiry } from "@/services/storage";
import { ViewingRequestForm } from "./ViewingRequestForm";
import { LuxuryButton } from "@/components/ui/LuxuryButton";
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  Send,
  CalendarCheck,
  FileText,
} from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function ContactSection() {
  const [activeTab, setActiveTab] = useState<"inquiry" | "viewing">("inquiry");

  const [formData, setFormData] = useState<ContactInquiryData>({
    name: "",
    email: "",
    phone: "",
    location: "Mumbai",
    propertyType: "Penthouse",
    budget: "₹15 Cr – ₹25 Crore",
    message: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<StorageSubmissionResult | null>(null);

  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errs.name = "Full name is required (min 2 characters).";
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = "Please enter a valid email address.";
    }
    if (!formData.phone.trim() || formData.phone.trim().length < 10) {
      errs.phone = "Phone number must be at least 10 digits.";
    }
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      errs.message = "Please provide brief details about your acquisition requirements (min 10 characters).";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    const result = await submitContactInquiry(formData);
    setIsSubmitting(false);
    setSubmissionResult(result);
  };

  const handleReset = () => {
    setSubmissionResult(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      location: "Mumbai",
      propertyType: "Penthouse",
      budget: "₹15 Cr – ₹25 Crore",
      message: "",
    });
    setErrors({});
  };

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionQuery.matches) return;

    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { opacity: 0, y: 35 },
          {
            scrollTrigger: {
              trigger: headerRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
          }
        );
      }

      if (contentRef.current) {
        gsap.fromTo(
          contentRef.current,
          { opacity: 0, y: 35 },
          {
            scrollTrigger: {
              trigger: contentRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            clearProps: "all",
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="contact-advisory"
      className="relative z-20 bg-[#263C50] text-[#FFF9F4] py-24 sm:py-32 px-4 sm:px-6 lg:px-8 border-t border-[#B9D7E8]/15"
      aria-label="Private Advisory & Contact"
    >
      {/* Background Architectural Grid Accent */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] rounded-full bg-[#F6B99D]/10 blur-[140px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[600px] h-[600px] rounded-full bg-[#B9D7E8]/10 blur-[140px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#B9D7E8_1px,transparent_1px),linear-gradient(to_bottom,#B9D7E8_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_50%,#000_60%,transparent_100%)]" />
      </div>

      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        {/* Section Header */}
        <div ref={headerRef} className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#B9D7E8]/30 bg-white/5 px-4 py-1 backdrop-blur-md">
            <Sparkles className="h-3 w-3 text-[#F6B99D]" />
            <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#FFF9F4]/90">
              STAGE 03 // PRIVATE ADVISORY & ENGAGEMENT
            </span>
          </div>

          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light text-[#FFF9F4] tracking-tight leading-[1.08]">
            Your next chapter starts with the right address.
          </h2>

          <p className="font-sans text-base sm:text-lg text-[#FFF9F4]/80 font-light leading-relaxed max-w-2xl">
            Whether acquiring a flagship penthouse, commissioning a private villa, or seeking confidential portfolio advisory across Indian metros, Studio AVENORA acts with absolute discretion.
          </p>
        </div>

        {/* Tab Switcher: Advisory Inquiry vs. Residence Viewing */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-4">
          <button
            type="button"
            onClick={() => setActiveTab("inquiry")}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-sans uppercase tracking-[0.18em] transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F6B99D] ${
              activeTab === "inquiry"
                ? "bg-[#FFF9F4] text-[#263C50] font-semibold shadow-lg"
                : "text-[#FFF9F4]/70 hover:text-[#FFF9F4] hover:bg-white/5"
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Private Advisory Inquiry</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("viewing")}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-sans uppercase tracking-[0.18em] transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F6B99D] ${
              activeTab === "viewing"
                ? "bg-[#FFF9F4] text-[#263C50] font-semibold shadow-lg"
                : "text-[#FFF9F4]/70 hover:text-[#FFF9F4] hover:bg-white/5"
            }`}
          >
            <CalendarCheck className="h-3.5 w-3.5 text-[#F6B99D]" />
            <span>Schedule Property Viewing</span>
          </button>
        </div>

        {/* Content Section: 2 Columns */}
        <div ref={contentRef} className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 items-start">
          {/* Left Column: Form View (Inquiry or Viewing) */}
          <div className="lg:col-span-8">
            {activeTab === "viewing" ? (
              <ViewingRequestForm />
            ) : (
              /* Contact Advisory Inquiry Form */
              <div className="rounded-3xl border border-[#B9D7E8]/20 bg-[#263C50]/80 p-6 sm:p-8 lg:p-10 backdrop-blur-xl shadow-2xl space-y-6">
                <div className="border-b border-[#B9D7E8]/15 pb-5">
                  <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#F6B99D]">
                    CONFIDENTIAL ADVISORY BRIEF
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl text-[#FFF9F4] mt-1 font-light">
                    Direct Partner Engagement
                  </h3>
                  <p className="font-sans text-xs text-[#FFF9F4]/75 mt-1 font-light">
                    Complete this brief to initiate confidential discussions. All disclosures are governed by strict non-disclosure covenants.
                  </p>
                </div>

                {submissionResult ? (
                  /* Confirmation State with Honest Persistence Feedback */
                  <div className="rounded-2xl border border-[#F6B99D]/40 bg-[#F6B99D]/10 p-6 sm:p-8 space-y-4 animate-in zoom-in-95 duration-300">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-8 w-8 text-[#F6B99D] flex-shrink-0" />
                      <div>
                        <h4 className="font-serif text-2xl text-[#FFF9F4]">
                          Acquisition Brief Recorded
                        </h4>
                        <span className="font-mono text-xs text-[#F6B99D]">
                          Tracking Reference: {submissionResult.referenceId}
                        </span>
                      </div>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-[#263C50]/80 p-4 space-y-2 text-xs font-mono text-[#FFF9F4]/90">
                      <div className="flex justify-between">
                        <span className="text-[#B9D7E8]/70">Principal Name:</span>
                        <span className="text-[#FFF9F4] font-medium">{formData.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#B9D7E8]/70">Direct Email:</span>
                        <span className="text-[#FFF9F4]">{formData.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#B9D7E8]/70">Target Territory:</span>
                        <span className="text-[#F6B99D]">{formData.location} · {formData.propertyType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#B9D7E8]/70">Capital Horizon:</span>
                        <span className="text-[#F6B99D]">{formData.budget}</span>
                      </div>
                    </div>

                    {/* Honest Persistence Disclaimer */}
                    <div className="rounded-xl border border-[#B9D7E8]/20 bg-[#263C50]/60 p-3.5 text-xs font-sans text-[#B9D7E8]/90 leading-relaxed">
                      <div className="flex items-start gap-2">
                        <ShieldCheck className="h-4 w-4 text-[#F6B99D] flex-shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-[#FFF9F4]">Demo Environment Notice:</strong>{" "}
                          {submissionResult.message}
                        </div>
                      </div>
                    </div>

                    <div className="pt-2">
                      <LuxuryButton variant="outline" size="sm" onClick={handleReset}>
                        Submit Another Inquiry
                      </LuxuryButton>
                    </div>
                  </div>
                ) : (
                  /* The Input Form */
                  <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                    {/* Name, Email, Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-[#B9D7E8] mb-1.5">
                          Full Legal Name *
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Yashvardhan Singhania"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          className={`w-full rounded-xl border bg-[#263C50] px-4 py-2.5 text-xs text-[#FFF9F4] placeholder:text-white/30 focus:border-[#F6B99D] focus:outline-none focus:ring-1 focus:ring-[#F6B99D] ${
                            errors.name ? "border-red-400/80" : "border-[#B9D7E8]/20"
                          }`}
                        />
                        {errors.name && (
                          <span className="text-[10px] text-red-300 font-sans mt-1 block">
                            {errors.name}
                          </span>
                        )}
                      </div>

                      <div>
                        <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-[#B9D7E8] mb-1.5">
                          Direct Email *
                        </label>
                        <input
                          type="email"
                          placeholder="yash@singhania.holdings"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          className={`w-full rounded-xl border bg-[#263C50] px-4 py-2.5 text-xs text-[#FFF9F4] placeholder:text-white/30 focus:border-[#F6B99D] focus:outline-none focus:ring-1 focus:ring-[#F6B99D] ${
                            errors.email ? "border-red-400/80" : "border-[#B9D7E8]/20"
                          }`}
                        />
                        {errors.email && (
                          <span className="text-[10px] text-red-300 font-sans mt-1 block">
                            {errors.email}
                          </span>
                        )}
                      </div>

                      <div>
                        <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-[#B9D7E8] mb-1.5">
                          Direct Telephone *
                        </label>
                        <input
                          type="tel"
                          placeholder="+91 98201 55000"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          className={`w-full rounded-xl border bg-[#263C50] px-4 py-2.5 text-xs text-[#FFF9F4] placeholder:text-white/30 focus:border-[#F6B99D] focus:outline-none focus:ring-1 focus:ring-[#F6B99D] ${
                            errors.phone ? "border-red-400/80" : "border-[#B9D7E8]/20"
                          }`}
                        />
                        {errors.phone && (
                          <span className="text-[10px] text-red-300 font-sans mt-1 block">
                            {errors.phone}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Location, Property Type & Budget Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Location */}
                      <div>
                        <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-[#B9D7E8] mb-1.5">
                          Target Location *
                        </label>
                        <select
                          value={formData.location}
                          onChange={(e) =>
                            setFormData({ ...formData, location: e.target.value })
                          }
                          className="w-full appearance-none rounded-xl border border-[#B9D7E8]/20 bg-[#263C50] px-4 py-2.5 text-xs text-[#FFF9F4] focus:border-[#F6B99D] focus:outline-none focus:ring-1 focus:ring-[#F6B99D]"
                        >
                          <option value="Mumbai">Mumbai (Worli, Bandra, Marine Drive)</option>
                          <option value="Pune">Pune (Koregaon Park, Kalyani Nagar)</option>
                          <option value="Bangalore">Bangalore (Lavelle Road, Indiranagar)</option>
                          <option value="Hyderabad">Hyderabad (Jubilee Hills, Banjara Hills)</option>
                          <option value="Other International">Other / International Portfolio</option>
                        </select>
                      </div>

                      {/* Property Type */}
                      <div>
                        <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-[#B9D7E8] mb-1.5">
                          Property Typology *
                        </label>
                        <select
                          value={formData.propertyType}
                          onChange={(e) =>
                            setFormData({ ...formData, propertyType: e.target.value })
                          }
                          className="w-full appearance-none rounded-xl border border-[#B9D7E8]/20 bg-[#263C50] px-4 py-2.5 text-xs text-[#FFF9F4] focus:border-[#F6B99D] focus:outline-none focus:ring-1 focus:ring-[#F6B99D]"
                        >
                          <option value="Penthouse">Penthouse / Sky Residence</option>
                          <option value="Architectural Villa">Architectural Villa / Mansion</option>
                          <option value="Garden Duplex">Garden Duplex</option>
                          <option value="Heritage Estate">Heritage Estate</option>
                          <option value="Multi-Unit Portfolio">Multi-Unit Private Portfolio</option>
                        </select>
                      </div>

                      {/* Budget */}
                      <div>
                        <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-[#B9D7E8] mb-1.5">
                          Budget Horizon (INR) *
                        </label>
                        <select
                          value={formData.budget}
                          onChange={(e) =>
                            setFormData({ ...formData, budget: e.target.value })
                          }
                          className="w-full appearance-none rounded-xl border border-[#B9D7E8]/20 bg-[#263C50] px-4 py-2.5 text-xs text-[#FFF9F4] focus:border-[#F6B99D] focus:outline-none focus:ring-1 focus:ring-[#F6B99D]"
                        >
                          <option value="Under ₹15 Crore">Under ₹15 Crore (Capital)</option>
                          <option value="₹15 Cr – ₹25 Crore">₹15 Cr – ₹25 Crore (Prime)</option>
                          <option value="₹25 Cr – ₹50 Crore">₹25 Cr – ₹50 Crore (Ultra-Prime)</option>
                          <option value="₹50 Crore+">₹50 Crore+ (Bespoke Trophy)</option>
                          <option value="Under ₹5 L/mo (Lease)">Under ₹5 Lakh/mo (Lease)</option>
                          <option value="Above ₹5 L/mo (Lease)">Above ₹5 Lakh/mo (Lease)</option>
                        </select>
                      </div>
                    </div>

                    {/* Message / Brief */}
                    <div>
                      <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-[#B9D7E8] mb-1.5">
                        Confidential Brief & Requirements *
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Detail specific spatial requirements, orientation preferences, timeline, family office representation, or architectural constraints..."
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        className={`w-full rounded-xl border bg-[#263C50] px-4 py-2.5 text-xs text-[#FFF9F4] placeholder:text-white/30 focus:border-[#F6B99D] focus:outline-none focus:ring-1 focus:ring-[#F6B99D] ${
                          errors.message ? "border-red-400/80" : "border-[#B9D7E8]/20"
                        }`}
                      />
                      {errors.message && (
                        <span className="text-[10px] text-red-300 font-sans mt-1 block">
                          {errors.message}
                        </span>
                      )}
                    </div>

                    {/* Submit Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-white/10">
                      <div className="flex items-center gap-2 text-xs font-mono text-[#B9D7E8]/80">
                        <ShieldCheck className="h-4 w-4 text-[#F6B99D]" />
                        <span>Fiduciary Discretion Assured · Direct Partner Access</span>
                      </div>
                      <LuxuryButton
                        type="submit"
                        variant="peach"
                        size="md"
                        disabled={isSubmitting}
                        icon={<Send className="h-3.5 w-3.5" />}
                      >
                        {isSubmitting ? "Encrypting & Storing..." : "Transmit Acquisition Brief"}
                      </LuxuryButton>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Private Office Global & Metro Directory */}
          <div className="lg:col-span-4 space-y-6">
            <div className="rounded-3xl border border-[#B9D7E8]/20 bg-[#263C50]/60 p-6 sm:p-7 backdrop-blur-xl shadow-xl space-y-6">
              <div className="border-b border-white/10 pb-4">
                <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#F6B99D]">
                  DIRECT PRIVATE OFFICE
                </span>
                <h4 className="font-serif text-2xl text-[#FFF9F4] mt-0.5 font-light">
                  Metropolitan Desks
                </h4>
              </div>

              {/* Office Desks */}
              <div className="space-y-4 text-xs font-sans">
                <div className="border-b border-white/5 pb-3">
                  <div className="flex items-center justify-between font-serif text-base text-[#FFF9F4]">
                    <span>Mumbai Private Office</span>
                    <span className="font-mono text-[10px] text-[#F6B99D]">Desk 01</span>
                  </div>
                  <p className="text-[#B9D7E8]/70 text-[11px] mt-0.5">
                    Level 38, The Capital, Bandra-Kurla Complex & Worli Sea Face
                  </p>
                  <p className="font-mono text-[11px] text-[#FFF9F4]/90 mt-1">
                    +91 22 4900 8800 · mumbai@avenora.private
                  </p>
                </div>

                <div className="border-b border-white/5 pb-3">
                  <div className="flex items-center justify-between font-serif text-base text-[#FFF9F4]">
                    <span>Pune Concierge</span>
                    <span className="font-mono text-[10px] text-[#F6B99D]">Desk 02</span>
                  </div>
                  <p className="text-[#B9D7E8]/70 text-[11px] mt-0.5">
                    Lane 5, Koregaon Park North Enclave
                  </p>
                  <p className="font-mono text-[11px] text-[#FFF9F4]/90 mt-1">
                    +91 20 6700 4400 · pune@avenora.private
                  </p>
                </div>

                <div className="border-b border-white/5 pb-3">
                  <div className="flex items-center justify-between font-serif text-base text-[#FFF9F4]">
                    <span>Bangalore Studio</span>
                    <span className="font-mono text-[10px] text-[#F6B99D]">Desk 03</span>
                  </div>
                  <p className="text-[#B9D7E8]/70 text-[11px] mt-0.5">
                    UB City & Lavelle Road Tree-Line Arcade
                  </p>
                  <p className="font-mono text-[11px] text-[#FFF9F4]/90 mt-1">
                    +91 80 4100 2200 · blr@avenora.private
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between font-serif text-base text-[#FFF9F4]">
                    <span>Hyderabad Pavilion</span>
                    <span className="font-mono text-[10px] text-[#F6B99D]">Desk 04</span>
                  </div>
                  <p className="text-[#B9D7E8]/70 text-[11px] mt-0.5">
                    Road No. 36, Jubilee Hills Ridge
                  </p>
                  <p className="font-mono text-[11px] text-[#FFF9F4]/90 mt-1">
                    +91 40 2300 9900 · hyd@avenora.private
                  </p>
                </div>
              </div>

              {/* Service SLA Badge */}
              <div className="rounded-xl border border-white/10 bg-white/5 p-3.5 space-y-1.5 text-xs">
                <div className="flex items-center gap-2 text-[#F6B99D] font-mono text-[10px] uppercase tracking-wider">
                  <Clock className="h-3.5 w-3.5" />
                  <span>Senior Partner Response SLA</span>
                </div>
                <p className="text-[#FFF9F4]/75 text-[11px] leading-relaxed">
                  All direct inquiries are assigned to a Managing Director within 4 business hours. Non-disclosure documentation dispatched prior to address disclosure.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
