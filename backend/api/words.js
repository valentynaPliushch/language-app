import { API_URL } from "../config";

export const addWord = async (unitId, kanji, reading, meaning) => {
  await fetch(`${API_URL}/words`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ unitId, kanji, reading, meaning }),
  });
  if (!response.ok) throw new Error("Failed to add word");

  return await response.json();
};

export const fetchWords = async () => {
  const response = await fetch(`${API_URL}/words`);

  if (!response.ok) {
    throw new Error("Failed to fetch words");
  }
  return await response.json();
};
