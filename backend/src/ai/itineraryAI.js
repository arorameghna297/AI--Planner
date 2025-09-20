const DEFAULT_MODEL = 'gemini-2.0-flash';

function buildPrompt({ preferences, places, events, hotels }) {
  const { from, to, startDate, endDate, travelerType, budget, duration, region, moodboard = [], interests = [], wishes = [] } = preferences || {};
  const placesLine = (places || []).map(p => p.name).join(', ') || 'none';
  const eventsLine = (events || []).map(e => `${e.name} on ${e.date || ''}`).join('; ') || 'none';
  const hotelsLine = (hotels || []).map(h => `${h.name} (${h.rating}⭐, ₹${h.pricePerNight}/night)`).join('; ') || 'none';

  return `You are an expert travel planner for trips . Generate a detailed, day-by-day itinerary.

Constraints and inputs:
- From: ${from}
- To: ${to}
- Dates: ${startDate} to ${endDate}
- Traveler type: ${travelerType}
- Budget (INR): ${budget}
- Duration (days): ${duration}
- Region focus: ${region}
- Moodboard: ${moodboard.join(', ') || 'none'}
- Interests: ${interests.join(', ') || 'none'}
- Wishes: ${wishes.join(', ') || 'none'}

Context data (summarized):
- Candidate places: ${placesLine}
- Local events: ${eventsLine}
- Hotel options: ${hotelsLine}

Instructions:
- Produce exactly JSON. No prose, no markdown fences.
- JSON schema:
{
  "meta": {
    "from": string, "to": string, "startDate": string, "endDate": string,
    "travelerType": "couple"|"family"|"solo",
    "moodboard": string[], "wishes": string[]
  },
  "days": [
    { "day": number, "activities": [string], "notes": string }
  ],
  "hotels": [
    { "name": string, "rating": number, "pricePerNight": number, "url": string }
  ],
  "transport": {
    "flight": { "suggestion": string },
    "local": { "modes": [string], "notes": string }
  },
  "cost": number
}

Preferences:
- Balance time and budget. Cluster nearby spots per day.
- Reflect moodboard and wishes in daily activities.
- Prefer 1-2 hotel suggestions aligned to budget and region.
- If weather-sensitive, suggest backups in notes.

Return only JSON:`;
}

function extractJson(text) {
  if (!text) return null;
  const trimmed = text.trim();
  if (trimmed.startsWith('{') && trimmed.endsWith('}')) return trimmed;
  const fenceMatch = trimmed.match(/```(?:json)?\n([\s\S]*?)```/i);
  if (fenceMatch) return fenceMatch[1];
  const firstBrace = trimmed.indexOf('{');
  const lastBrace = trimmed.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    return trimmed.slice(firstBrace, lastBrace + 1);
  }
  return null;
}

function mockItinerary(preferences, hotels) {
  const { from, to, startDate, endDate, travelerType, moodboard = [], wishes = [] } = preferences || {};
  const days = [
    { day: 1, activities: [
      moodboard.includes('romantic') ? 'Sunset point with private dinner' : 'City orientation walk',
      (wishes || []).includes('historical') ? 'Heritage fort tour' : 'Popular local hangout'
    ], notes: 'Adjust timing based on traffic.' },
    { day: 2, activities: [
      moodboard.includes('exploring') ? 'Hidden gems and markets crawl' : 'Relaxing spa / calm beach time',
      (wishes || []).includes('foodie') ? 'Cafe hopping and street food trail' : 'Local museum'
    ], notes: 'Check local events schedule.' }
  ];
  return {
    source: 'mock',
    meta: { from, to, startDate, endDate, travelerType, moodboard, wishes },
    days,
    hotels: (hotels || []).slice(0, 2),
    transport: { flight: { suggestion: 'Search best fare for selected dates' }, local: { modes: ['cab', 'auto', 'walk'], notes: 'Use cabs for late evenings.' } },
    cost: 15000
  };
}

async function callGeminiGenerate({ apiKey, model, prompt }) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;
  const body = {
    contents: [
      { role: 'user', parts: [{ text: prompt }] }
    ],
    generationConfig: { temperature: 0.4, topK: 32, topP: 0.95, maxOutputTokens: 2048 }
  };
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-goog-api-key': apiKey },
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Gemini API error ${res.status}: ${text}`);
  }
  const data = await res.json();
  const output = data?.candidates?.[0]?.content?.parts?.[0]?.text || data?.candidates?.[0]?.output_text;
  return output;
}

async function getAIItinerary({ preferences, places, events, hotels }) {
  const apiKey = process.env.VERTEX_AI_API_KEY;
  const model = process.env.VERTEX_AI_MODEL || DEFAULT_MODEL;

  if (!apiKey) {
    console.log('[AI] Using mock itinerary (no VERTEX_AI_API_KEY set)');
    return mockItinerary(preferences, hotels);
  }

  try {
    const prompt = buildPrompt({ preferences, places, events, hotels });
    const output = await callGeminiGenerate({ apiKey, model, prompt });
    const jsonText = extractJson(output);
    if (!jsonText) throw new Error('Failed to extract JSON from model output');
    const parsed = JSON.parse(jsonText);

    if (!parsed.hotels || parsed.hotels.length === 0) {
      parsed.hotels = (hotels || []).slice(0, 2);
    }
    parsed.meta = parsed.meta || {
      from: preferences.from,
      to: preferences.to,
      startDate: preferences.startDate,
      endDate: preferences.endDate,
      travelerType: preferences.travelerType,
      moodboard: preferences.moodboard || [],
      wishes: preferences.wishes || []
    };
    parsed.source = 'gemini';
    console.log('[AI] Gemini itinerary generated');
    return parsed;
  } catch (err) {
    console.log('[AI] Falling back to mock:', err.message);
    return mockItinerary(preferences, hotels);
  }
}

module.exports = { getAIItinerary }; 