// Lead types and Gemini API client
export interface Lead {
  company_name: string;
  contact_person: string;
  job_title: string;
  email: string;
  phone: string;
  website: string;
  company_size: string;
  annual_revenue: string;
  funding_stage: string;
  tech_stack: string[];
  linkedin_url: string;
  quality_score: number;
  intent_signals: string[];
  tags: string[];
  pain_point: string;
  outreach_hook: string;
  best_contact_time: string;
  _id?: string;
  _saved?: boolean;
}

export interface GenerateParams {
  niche: string;
  location: string;
  painPoint: string;
  count: number;
  enrich: { linkedin: boolean; tech: boolean; funding: boolean };
}

export function getApiKey(): string {
  if (typeof window !== "undefined") {
    return localStorage.getItem("gemini_api_key") || "";
  }
  return "";
}

function buildPrompt(p: GenerateParams) {
  const locPart = p.location ? ` in ${p.location}` : "";
  const painPart = p.painPoint ? ` focused on the pain point: ${p.painPoint}` : "";
  return `You are a B2B lead intelligence engine. Generate exactly ${p.count} realistic, highly detailed B2B leads for the ${p.niche} industry${locPart}${painPart}. Return ONLY a valid JSON array with no explanation, no markdown, no preamble. Each object must have these exact fields:
- company_name (string)
- contact_person (string — realistic full name)
- job_title (string — senior decision-maker level)
- email (string — realistic professional email)
- phone (string — realistic format)
- website (string — realistic URL)
- company_size (string — e.g. '50–200 employees')
- annual_revenue (string — e.g. '$2M–$10M')
- funding_stage (string — e.g. 'Series A', 'Bootstrapped', 'Series B')
- tech_stack (array of 3–5 strings — technologies they likely use)
- linkedin_url (string — realistic LinkedIn company URL)
- quality_score (integer 1–100)
- intent_signals (array of 2–3 short strings — e.g. 'Recently hired VP Sales', 'Job postings for SDRs', 'Raised funding 3 months ago')
- tags (array of 3–5 strings)
- pain_point (string — specific to their business context)
- outreach_hook (string — a highly personalized 1–2 sentence opener referencing their company specifically)
- best_contact_time (string — e.g. 'Tuesday–Thursday, 10am–2pm EST')
Return only the JSON array.`;
}

function stripFences(text: string): string {
  let t = text.trim();
  if (t.startsWith("```")) {
    t = t.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "");
  }
  // try to grab first JSON array if extra text leaks
  const start = t.indexOf("[");
  const end = t.lastIndexOf("]");
  if (start !== -1 && end !== -1) t = t.slice(start, end + 1);
  return t.trim();
}

export async function generateLeads(params: GenerateParams, apiKey: string = ""): Promise<Lead[]> {
  const prompt = buildPrompt(params);
  const finalApiKey = apiKey || getApiKey();
  
  if (!finalApiKey) {
    throw new Error("No Gemini API key provided. Please set your API key in settings.");
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${encodeURIComponent(finalApiKey)}`;
  
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
      generationConfig: {
        maxOutputTokens: 4000,
        temperature: 0.7,
      },
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    if (res.status === 429) throw new Error("Rate limit reached. Please wait a moment and try again.");
    if (res.status === 401 || res.status === 403) throw new Error("Invalid API key or request rejected by Gemini.");
    if (res.status === 400) throw new Error("Request rejected by Gemini.");
    throw new Error(`Gemini error ${res.status}: ${errText.slice(0, 140)}`);
  }

  const data = await res.json();
  const text: string | undefined = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Empty response from AI.");
  
  const cleaned = stripFences(text);
  let parsed: Lead[];
  try {
    parsed = JSON.parse(cleaned);
  } catch (e) {
    throw new Error("Could not parse AI response as JSON.");
  }
  if (!Array.isArray(parsed)) throw new Error("AI did not return a JSON array.");
  return parsed.map((l, i) => ({ ...l, _id: `${Date.now()}-${i}` }));
}
