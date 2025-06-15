import { fetchWords } from "@/backend/api/words";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Triangle, X } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { SafeAreaView } from "react-native-safe-area-context";

interface KanjiWord {
  _id: string;
  kanji: string;
  reading: string;
  meaning: string;
}
const LearnKanji = () => {
  const { id } = useLocalSearchParams();

  const [words, setWords] = useState<KanjiWord[]>([]);
  const [loading, setLoading] = useState(true);
  const [quizFinished, setQuizFinished] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timer, setTimer] = useState(20);

  const router = useRouter();

  const progress = ((currentQuestionIndex + 1) / words.length) * 100;

  useEffect(() => {
    if (!quizFinished) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer === 1) {
            handleNext();
            return 20;
          }
          return prevTimer - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [quizFinished, currentQuestionIndex]);

  useEffect(() => {
    const getWords = async () => {
      try {
        const data = await fetchWords();
        setWords(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
      } finally {
        // setLoading(false);
      }
    };

    getWords();
  }, []);

  const handleStartQuiz = () => {
    setQuizFinished(false);
    setCurrentQuestionIndex(0);
    setTimer(20);
  };

  const handleNext = () => {
    if (currentQuestionIndex < words.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTimer(20);
    } else {
      setQuizFinished(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setTimer(20);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  if (quizFinished) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-gray-100">
        <Text className="text-2xl font-bold mb-8">Quiz Finished!</Text>
        <TouchableOpacity
          className="bg-blue-500 py-4 px-8 rounded-lg"
          onPress={handleStartQuiz}
        >
          <Text className="text-white text-xl font-bold">Restart Quiz</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
  if (!loading) {
    const currentKanji = words[currentQuestionIndex];

    return (
      <SafeAreaView className="flex-1 px-6 items-center bg-gray-100">
        <View className="w-full flex-row justify-between items-center my-2">
          <TouchableOpacity onPress={() => router.push("/(tabs)/quiz")}>
            <X />
          </TouchableOpacity>

          <View className="w-[75%] bg-gray-300 rounded-full h-2.5">
            <View
              className="bg-green-500 h-2.5 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </View>

          <Text className="text-right text-gray-600">
            {currentQuestionIndex + 1} / {words.length}
          </Text>
        </View>

        <View className="w-full flex-1 flex-col bg-white rounded-2xl justify-evenly items-center shadow-lg mt-5 mb-20">
          <AnimatedCircularProgress
            size={100}
            width={15}
            fill={(timer / 20) * 100}
            tintColor="#3783f0"
            backgroundColor="#e6e7e9"
            rotation={0}
            lineCap="round"
          >
            {() => (
              <Text className="text-3xl font-bold text-blue-500">{timer}</Text>
            )}
          </AnimatedCircularProgress>
          <View>
            <Text className="text-6xl mb-10">{currentKanji.kanji}</Text>
            <Text className="text-xl">{currentKanji.reading}</Text>
            <Text className="text-xl">{currentKanji.meaning}</Text>
          </View>
        </View>

        {/* <TouchableOpacity
          className="bg-green-500 py-3 px-6 rounded-lg mb-8"
          onPress={() => setShowDetails(!showDetails)}
        >
          <Text className="text-white text-lg font-bold">
            {showDetails ? "Hide" : "Show"} Reading & Meaning
          </Text>
        </TouchableOpacity> */}

        <View className="flex-row justify-between w-4/5 mb-5">
          <TouchableOpacity
            onPress={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            {currentQuestionIndex !== 0 && (
              <Triangle style={{ transform: [{ rotate: "-90deg" }] }} />
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNext}>
            <Triangle style={{ transform: [{ rotate: "90deg" }] }} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
};

export default LearnKanji;
