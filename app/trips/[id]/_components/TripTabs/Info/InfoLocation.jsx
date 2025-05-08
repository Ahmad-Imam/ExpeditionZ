import InfoClient from "./InfoClient";

const mockDestinationData = {
  "Paris, France": {
    timezone: "Europe/Paris",
    offset: "+02:00",
    language: "French",
    currency: "Euro (EUR)",
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
  },
  "Tokyo, Japan": {
    timezone: "Asia/Tokyo",
    offset: "+09:00",
    language: "Japanese",
    currency: "Japanese Yen (JPY)",
    tips: [
      "Tipping is not customary and can sometimes be considered rude",
      "Many places don't accept credit cards, so carry cash",
      "Convenience stores (konbini) are great for quick meals and ATMs",
      "Get a Suica or Pasmo card for easy public transportation",
      "Bow slightly when greeting or thanking someone",
    ],
    phrases: [
      { phrase: "Hello", translation: "Konnichiwa" },
      { phrase: "Thank you", translation: "Arigatou gozaimasu" },
      { phrase: "Excuse me", translation: "Sumimasen" },
      {
        phrase: "Do you speak English?",
        translation: "Eigo wo hanasemasu ka?",
      },
      { phrase: "How much is this?", translation: "Kore wa ikura desu ka?" },
    ],
  },
  Italy: {
    timezone: "Europe/Rome",
    offset: "+02:00",
    language: "Italian",
    currency: "Euro (EUR)",
    tips: [
      "Many shops close for a few hours in the afternoon for 'riposo'",
      "Cover your shoulders and knees when visiting churches",
      "A small coperto (cover charge) is common at restaurants",
      "Validate your train ticket before boarding",
      "Coffee at the bar is cheaper than sitting at a table",
    ],
    phrases: [
      { phrase: "Hello", translation: "Ciao" },
      { phrase: "Thank you", translation: "Grazie" },
      { phrase: "Excuse me", translation: "Scusi" },
      { phrase: "Do you speak English?", translation: "Parla inglese?" },
      { phrase: "How much is this?", translation: "Quanto costa?" },
    ],
  },
};

export default function InfoLocation({ trip }) {
  console.log("test");

  const destinationKey =
    Object.keys(mockDestinationData).find((key) =>
      trip.destination.includes(key)
    ) || Object.keys(mockDestinationData)[0];

  const destinationData = mockDestinationData[destinationKey];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold ">Destination Information</h3>
      </div>

      <InfoClient destinationData={destinationData} trip={trip} />
    </div>
  );
}
