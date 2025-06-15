import React, { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { fetchWords } from "../backend/api/words";

interface KanjiWord {
  _id: string;
  kanji: string;
  reading: string;
  meaning: string;
}

export default function KanjiListScreen() {
  const [words, setWords] = useState<KanjiWord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getWords = async () => {
      try {
        const data = await fetchWords();
        setWords(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    getWords();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 p-3 bg-gray-100">
      <FlatList
        data={words}
        keyExtractor={(item) => item._id}
        renderItem={({ item, index }) => (
          <View className="bg-white p-2 rounded-lg mb-3 flex-row items-center shadow-md">
            <Text className="mr-5 text-3xl">{index + 1}</Text>
            <View className="flex-1 flex-col">
              <Text className="text-3xl mr-4">{item.kanji}</Text>
              <Text className="text-base text-gray-800">{item.reading}</Text>
              <Text className="text-sm text-gray-600">{item.meaning}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}
