import { NextRequest, NextResponse } from "next/server";
import { processPropertyQuery } from "@/services/aiMatcher";
import { DEMO_PROPERTIES } from "@/data/properties";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userMessage: string = body.message || "";

    if (!userMessage.trim()) {
      return NextResponse.json(
        { error: "Message content cannot be blank" },
        { status: 400 }
      );
    }

    // Check if an AI API Key is configured on the server
    const geminiKey = process.env.GEMINI_API_KEY;

    if (geminiKey) {
      try {
        const promptContext = `
You are the AVENORA AI Property Consultant, an ultra-luxury private architectural advisor.
Your tone is sophisticated, discreet, and architectural.
Available property portfolio:
${JSON.stringify(
  DEMO_PROPERTIES.map((p) => ({
    id: p.id,
    title: p.title,
    city: p.city,
    locality: p.locality,
    type: p.propertyType,
    bhk: p.bedrooms,
    price: p.priceFormatted,
    category: p.category,
    tagline: p.tagline,
  }))
)}

User Query: "${userMessage}"
Respond concisely in 2-3 sentences. Then recommend 1-3 matching property IDs from the portfolio in JSON format:
{ "reply": "...", "propertyIds": ["avn-..."] }
`;

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: promptContext }] }],
              generationConfig: { responseMimeType: "application/json" },
            }),
          }
        );

        if (geminiRes.ok) {
          const data = await geminiRes.json();
          const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            const parsed = JSON.parse(rawText);
            const matchedProperties = DEMO_PROPERTIES.filter((p) =>
              parsed.propertyIds?.includes(p.id)
            );
            return NextResponse.json({
              content: parsed.reply,
              matchedProperties:
                matchedProperties.length > 0
                  ? matchedProperties
                  : DEMO_PROPERTIES.slice(0, 2),
              mode: "ai_live",
            });
          }
        }
      } catch {
        // Fallback gracefully to rule-based engine
      }
    }

    // Default / Rule-Based Assistant against real dataset (Demo Mode)
    const ruleBasedResult = processPropertyQuery(userMessage);
    return NextResponse.json(ruleBasedResult);
  } catch {
    return NextResponse.json(
      { error: "Internal AI processing error" },
      { status: 500 }
    );
  }
}
