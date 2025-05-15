"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { getLoggedUser } from "./user";

const testData = {
  tips: [
    "Most museums are closed on Mondays or Tuesdays",
    "Tipping is not required but rounding up is appreciated",
    "The Paris Museum Pass can save money if you plan to visit multiple museums",
    "Metro tickets can be purchased in bundles for a discount",
    "Many restaurants offer fixed-price lunch menus that are a good value",
  ],
  phrases: [
    { phrase: "Hello", translation: "Bonjour" },
    { phrase: "Thank you", translation: "Merci" },
    { phrase: "Excuse me", translation: "Excusez-moi" },
    { phrase: "Do you speak English?", translation: "Parlez-vous anglais?" },
    { phrase: "How much is this?", translation: "Combien ça coûte?" },
  ],
};

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-lite",
  tools: [{ googleSearch: {} }],
});

export async function generateTripWeather(trip) {
  const prompt = `
          go through this whole sample json ${testData}, and provide results in ONLY the JSON format I provided without any additional notes or explanations:

          the location is name: ${trip.destination} ..
          the startDate is ${trip.startDate} .
          currentDate is ${new Date().toISOString()}.
          based on this provide the rest of the json in the same format as I provided.

          for the current weather, you can consider date: ${new Date().toISOString()}  and fill based on that.
          return current weather data in the structure of this JSON and fill the values based on the location provided:

              current: {
                temp: 22,
                feels_like: 23,
                humidity: 65,
                wind_speed: 12,
                condition: "SUNNY"| PARTLY CLOUDY | CLOUDY |RAINY | SNOWY | WINDY,

            },

            for the daily, you can consider the next 5 days and fill based on that.          
            for the tripWeather you should start from the startDate of trip and end at 5 days after the startdate of trip.

            return the daily and tripWeather weather data in the structure of this JSON and fill the values based on the location provided:

                  {
                    date: "2023-07-15",
                    temp_max: 24,
                    temp_min: 18,
                      condition: "SUNNY"| PARTLY CLOUDY | CLOUDY |RAINY | SNOWY | WINDY,
                    precipitation: 0,
                    },

       
            

        if you are unable to find data based on the location I provided, you must use the default location newyork,usa.
        if there are multiple locations provided, you must use the first one.

        
          IMPORTANT: Return ONLY the JSON and EXACTLY AS THE FORMAT OF THE PROVIDED JSON. No additional text, notes, or markdown formatting. DONOT INLCUDE ANY HTML TAGS INSIDE THE CONTENTS.
        Make sure to include all the fields mentioned above. If any field is not found in the jSON, set its value to null.
        `;

  const loggedUser = await getLoggedUser();
  if (!loggedUser) throw new Error("User not logged in");

  const result = await model.generateContent(prompt);
  const response = result?.response;
  const text = response?.text();
  const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

  return JSON?.parse(cleanedText);
}

export async function generateTripLocationInfo(trip) {
  const prompt = `
          go through this whole sample json ${trip}, and provide results in ONLY the JSON format I provided without any additional notes or explanations:

          the location is name: ${trip.destination} .
          the startDate is ${trip.startDate} .
          currentDate is ${new Date().toISOString()}.
          based on this provide the rest of the json in the same format as I provided.

       
           remember to provide the following fields in the JSON and fill the values based on the location provided:
              timezone: "Europe/Paris",
              offset: "+02:00", (timezone in gmt format)
              language: "French",
              currency: "Euro (EUR)",
              convert: "1 USD" (this is the conversion rate of the currency of the location to USD),
              name: "Paris",
              country: "France",
              countDown: 5, (days remaining for the trip from today)
              tips: [
                "Most museums are closed on Mondays or Tuesdays",
                "Tipping is not required but rounding up is appreciated",
                "The Paris Museum Pass can save money if you plan to visit multiple museums",
                "Metro tickets can be purchased in bundles for a discount",
                "Many restaurants offer fixed-price lunch menus that are a good value",
              ],
              phrases: [
                { phrase: "Hello", translation: "Bonjour" },
                { phrase: "Thank you", translation: "Merci" },
                { phrase: "Excuse me", translation: "Excusez-moi" },
                { phrase: "Do you speak English?", translation: "Parlez-vous anglais?" },
                { phrase: "How much is this?", translation: "Combien ça coûte?" },
              ],
          }

          for the tips consider the country of the location and fill based on that
                  and provide in the structure of ${testData.tips}

                  for the phrases, consider the country of the location and fill based on that
                  and provide EXACTLY in the structure of this:
                  ${testData.phrases}
                  DONOT COPY PASTE THE PHRASES FROM THE EXAMPLE JSON, JUST FOLLOW THE STRUCTURE AND FILL BASED ON THE LOCATION PROVIDED.
       
            

        if you are unable to find data based on the location I provided, you must use the default location newyork,usa.
        if there are multiple locations provided, you must use the first one.

        
          IMPORTANT: Return ONLY the JSON and EXACTLY AS THE FORMAT OF THE PROVIDED JSON. No additional text, notes, or markdown formatting. DONOT INLCUDE ANY HTML TAGS INSIDE THE CONTENTS.
        Make sure to include all the fields mentioned above. If any field is not found in the jSON, set its value to null.
        `;

  const loggedUser = await getLoggedUser();
  if (!loggedUser) throw new Error("User not logged in");

  const result = await model.generateContent(prompt);
  const response = result?.response;
  const text = response?.text();
  const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

  const finalText = cleanedText.replace(/,\s*([}\]])/g, "$1");

  try {
    return JSON.parse(finalText);
  } catch (e) {
    console.error("Failed to parse JSON from Gemini:", finalText);
    throw e;
  }
}
