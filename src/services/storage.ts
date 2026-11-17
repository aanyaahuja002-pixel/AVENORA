import {
  ContactInquiryData,
  ViewingRequestData,
  StorageSubmissionResult,
} from "@/types";

const CONTACT_STORAGE_KEY = "avenora_contact_inquiries";
const VIEWING_STORAGE_KEY = "avenora_viewing_requests";

/**
 * Check if Supabase credentials are configured in environment
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

/**
 * Generate a luxury editorial reference tracking code
 */
function generateRefCode(prefix: string): string {
  const timestamp = Date.now().toString(36).toUpperCase().slice(-4);
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${timestamp}-${randomPart}`;
}

/**
 * Persist Contact Advisory Inquiry
 * Persists to Supabase if configured; otherwise saves to local demo storage.
 * Explicitly states local demo storage when no backend is connected.
 */
export async function submitContactInquiry(
  data: ContactInquiryData
): Promise<StorageSubmissionResult> {
  const referenceId = generateRefCode("AVN-INQ");
  const payload: ContactInquiryData = {
    ...data,
    id: referenceId,
    createdAt: new Date().toISOString(),
  };

  if (isSupabaseConfigured()) {
    try {
      const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/inquiries`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
          Prefer: "return=representation",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        return {
          success: true,
          referenceId,
          mode: "supabase",
          message:
            "Your confidential acquisition brief has been securely transmitted to the AVENORA Private Office.",
        };
      }
    } catch {
      // Fallback gracefully to local storage
    }
  }

  // Local Demo Storage
  try {
    const existingRaw = typeof window !== "undefined" ? localStorage.getItem(CONTACT_STORAGE_KEY) : null;
    const existingList: ContactInquiryData[] = existingRaw ? JSON.parse(existingRaw) : [];
    existingList.unshift(payload);
    if (typeof window !== "undefined") {
      localStorage.setItem(CONTACT_STORAGE_KEY, JSON.stringify(existingList));
    }
  } catch {
    // Ignore storage quota errors
  }

  return {
    success: true,
    referenceId,
    mode: "local_demo",
    message:
      "Logged in Local Demo Storage. Notice: Live concierge backend is not connected in this demo environment. Your brief has been saved locally in your browser portfolio with Reference ID: " +
      referenceId +
      ". No outbound message was dispatched to an external agent.",
  };
}

/**
 * Persist Property Viewing Request
 * Persists to Supabase if configured; otherwise saves to local demo storage.
 */
export async function submitViewingRequest(
  data: ViewingRequestData
): Promise<StorageSubmissionResult> {
  const referenceId = generateRefCode("AVN-VIEW");
  const payload: ViewingRequestData = {
    ...data,
    id: referenceId,
    createdAt: new Date().toISOString(),
  };

  if (isSupabaseConfigured()) {
    try {
      const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/viewing_requests`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
          Prefer: "return=representation",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        return {
          success: true,
          referenceId,
          mode: "supabase",
          message:
            "Your private residence viewing request has been confirmed with the Resident Concierge.",
        };
      }
    } catch {
      // Fallback to local demo storage
    }
  }

  // Local Demo Storage
  try {
    const existingRaw = typeof window !== "undefined" ? localStorage.getItem(VIEWING_STORAGE_KEY) : null;
    const existingList: ViewingRequestData[] = existingRaw ? JSON.parse(existingRaw) : [];
    existingList.unshift(payload);
    if (typeof window !== "undefined") {
      localStorage.setItem(VIEWING_STORAGE_KEY, JSON.stringify(existingList));
    }
  } catch {
    // Ignore
  }

  return {
    success: true,
    referenceId,
    mode: "local_demo",
    message:
      "Viewing Scheduled in Local Demo Storage. Notice: This platform is operating in client demonstration mode. Your viewing appointment has been logged in browser storage with Access Pass: " +
      referenceId +
      ". No live concierge notification was transmitted.",
  };
}

/**
 * Retrieve saved demo inquiries
 */
export function getLocalInquiries(): ContactInquiryData[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CONTACT_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Retrieve saved demo viewing requests
 */
export function getLocalViewingRequests(): ViewingRequestData[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(VIEWING_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
