"use client";

import { useState } from "react";
import { DEMO_PROPERTIES } from "@/data/properties";
import { ViewingRequestData, StorageSubmissionResult } from "@/types";
import { submitViewingRequest } from "@/services/storage";
import { LuxuryButton } from "@/components/ui/LuxuryButton";
import {
  Calendar,
  Clock,
  CheckCircle2,
  ShieldCheck,
  Building,
} from "lucide-react";

export function ViewingRequestForm() {
  const [formData, setFormData] = useState({
    propertyId: DEMO_PROPERTIES[0].id,
    preferredDate: "",
    timeSlot: "17:00 - 19:00 (Sunset / Golden Hour)",
    name: "",
    phone: "",
    email: "",
    notes: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<StorageSubmissionResult | null>(null);

  const selectedProperty = DEMO_PROPERTIES.find(
    (p) => p.id === formData.propertyId
  ) || DEMO_PROPERTIES[0];

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
    if (!formData.preferredDate) {
      errs.preferredDate = "Please choose a preferred viewing date.";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    const viewingData: ViewingRequestData = {
      propertyId: selectedProperty.id,
      propertyTitle: selectedProperty.title,
      propertyCity: selectedProperty.city,
      preferredDate: formData.preferredDate,
      timeSlot: formData.timeSlot,
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      notes: formData.notes,
    };

    const result = await submitViewingRequest(viewingData);
    setIsSubmitting(false);
    setSubmissionResult(result);
  };

  const handleReset = () => {
    setSubmissionResult(null);
    setFormData({
      propertyId: DEMO_PROPERTIES[0].id,
      preferredDate: "",
      timeSlot: "17:00 - 19:00 (Sunset / Golden Hour)",
      name: "",
      phone: "",
      email: "",
      notes: "",
    });
    setErrors({});
  };

  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <div className="rounded-3xl border border-[#B9D7E8]/20 bg-[#263C50]/80 p-6 sm:p-8 lg:p-10 backdrop-blur-xl shadow-2xl space-y-6">
      {/* Form Header */}
      <div className="border-b border-[#B9D7E8]/15 pb-5">
        <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#F6B99D]">
          PRIVATE VIEWING APPOINTMENT
        </span>
        <h3 className="font-serif text-2xl sm:text-3xl text-[#FFF9F4] mt-1 font-light">
          Experience the Architecture in Person
        </h3>
        <p className="font-sans text-xs text-[#FFF9F4]/75 mt-1 font-light">
          Private walk-throughs arranged with resident curators. Dedicated valet and confidential access provided.
        </p>
      </div>

      {submissionResult ? (
        /* Confirmation State */
        <div className="rounded-2xl border border-[#F6B99D]/40 bg-[#F6B99D]/10 p-6 sm:p-8 space-y-4 animate-in zoom-in-95 duration-300">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-8 w-8 text-[#F6B99D] flex-shrink-0" />
            <div>
              <h4 className="font-serif text-2xl text-[#FFF9F4]">
                Viewing Logged Successfully
              </h4>
              <span className="font-mono text-xs text-[#F6B99D]">
                Access Pass Code: {submissionResult.referenceId}
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#263C50]/80 p-4 space-y-2 text-xs font-mono text-[#FFF9F4]/90">
            <div className="flex justify-between">
              <span className="text-[#B9D7E8]/70">Residence:</span>
              <span className="text-[#FFF9F4] font-medium">{selectedProperty.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#B9D7E8]/70">Location:</span>
              <span className="text-[#FFF9F4]">{selectedProperty.locality}, {selectedProperty.city}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#B9D7E8]/70">Scheduled Slot:</span>
              <span className="text-[#F6B99D]">{formData.preferredDate} ({formData.timeSlot})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#B9D7E8]/70">Attendee:</span>
              <span className="text-[#FFF9F4]">{formData.name}</span>
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
              Schedule Another Viewing
            </LuxuryButton>
          </div>
        </div>
      ) : (
        /* Viewing Request Form */
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {/* Property Selection Dropdown */}
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-[#B9D7E8] mb-1.5">
              Select Curated Property *
            </label>
            <div className="relative">
              <select
                value={formData.propertyId}
                onChange={(e) =>
                  setFormData({ ...formData, propertyId: e.target.value })
                }
                className="w-full appearance-none rounded-xl border border-[#B9D7E8]/20 bg-[#263C50] px-4 py-3 pr-10 text-xs text-[#FFF9F4] focus:border-[#F6B99D] focus:outline-none focus:ring-1 focus:ring-[#F6B99D]"
              >
                {DEMO_PROPERTIES.map((prop) => (
                  <option key={prop.id} value={prop.id}>
                    {prop.title} — {prop.locality}, {prop.city} ({prop.priceFormatted} · {prop.bedrooms} BHK)
                  </option>
                ))}
              </select>
              <Building className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#B9D7E8]/60" />
            </div>

            {/* Quick preview snippet of chosen property */}
            <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-[#B9D7E8]/80 bg-white/5 border border-white/5 px-3 py-1.5 rounded-lg">
              <span>{selectedProperty.propertyType} · {selectedProperty.code}</span>
              <span className="text-[#F6B99D] font-medium">{selectedProperty.priceFormatted}</span>
            </div>
          </div>

          {/* Date & Time Slot Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-[#B9D7E8] mb-1.5">
                Preferred Viewing Date *
              </label>
              <div className="relative">
                <input
                  type="date"
                  min={todayStr}
                  value={formData.preferredDate}
                  onChange={(e) =>
                    setFormData({ ...formData, preferredDate: e.target.value })
                  }
                  className={`w-full rounded-xl border bg-[#263C50] px-4 py-2.5 text-xs text-[#FFF9F4] focus:border-[#F6B99D] focus:outline-none focus:ring-1 focus:ring-[#F6B99D] ${
                    errors.preferredDate
                      ? "border-red-400/80"
                      : "border-[#B9D7E8]/20"
                  }`}
                />
              </div>
              {errors.preferredDate && (
                <span className="text-[10px] text-red-300 font-sans mt-1 block">
                  {errors.preferredDate}
                </span>
              )}
            </div>

            <div>
              <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-[#B9D7E8] mb-1.5">
                Preferred Time Horizon *
              </label>
              <div className="relative">
                <select
                  value={formData.timeSlot}
                  onChange={(e) =>
                    setFormData({ ...formData, timeSlot: e.target.value })
                  }
                  className="w-full appearance-none rounded-xl border border-[#B9D7E8]/20 bg-[#263C50] px-4 py-2.5 pr-8 text-xs text-[#FFF9F4] focus:border-[#F6B99D] focus:outline-none focus:ring-1 focus:ring-[#F6B99D]"
                >
                  <option value="10:00 - 12:00 (Morning Light)">
                    10:00 - 12:00 (Morning Ambient Light)
                  </option>
                  <option value="14:00 - 16:00 (Afternoon Tour)">
                    14:00 - 16:00 (Afternoon Architectural Tour)
                  </option>
                  <option value="17:00 - 19:00 (Sunset / Golden Hour)">
                    17:00 - 19:00 (Sunset / Golden Hour Illumination)
                  </option>
                </select>
                <Clock className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#B9D7E8]/60" />
              </div>
            </div>
          </div>

          {/* Contact Details (Name, Phone, Email) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-[#B9D7E8] mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Vikramaditya Oberoi"
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
                Direct Phone *
              </label>
              <input
                type="tel"
                placeholder="+91 98200 12345"
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

            <div>
              <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-[#B9D7E8] mb-1.5">
                Direct Email *
              </label>
              <input
                type="email"
                placeholder="vikram@oberoi.group"
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
          </div>

          {/* Notes */}
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-[#B9D7E8] mb-1.5">
              Specific Architectural Requests or Confidentiality Instructions
            </label>
            <input
              type="text"
              placeholder="e.g. Helicopter landing coordination, private security clearance, or NDA..."
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              className="w-full rounded-xl border border-[#B9D7E8]/20 bg-[#263C50] px-4 py-2 text-xs text-[#FFF9F4] placeholder:text-white/30 focus:border-[#F6B99D] focus:outline-none focus:ring-1 focus:ring-[#F6B99D]"
            />
          </div>

          {/* Submit Action */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-white/10">
            <span className="font-mono text-[10px] text-[#B9D7E8]/70">
              Discreet booking. Resident security verified before access pass issuance.
            </span>
            <LuxuryButton
              type="submit"
              variant="peach"
              size="md"
              disabled={isSubmitting}
              icon={<Calendar className="h-3.5 w-3.5" />}
            >
              {isSubmitting ? "Issuing Viewing Pass..." : "Confirm Viewing Schedule"}
            </LuxuryButton>
          </div>
        </form>
      )}
    </div>
  );
}
