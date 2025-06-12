import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { fetchWords } from "../../backend/api/words";

interface KanjiWord {
  _id: string;
  kanji: string;
  reading: string;
  meaning: string;
}
// const KANJI_DATA = [
//   { kanji: "日", reading: "nichi, jitsu / hi, -bi, -ka", meaning: "Day, Sun" },
//   { kanji: "月", reading: "getsu, gatsu / tsuki", meaning: "Month, Moon" },
//   { kanji: "火", reading: "ka / hi, -bi, ho-", meaning: "Fire" },
//   { kanji: "水", reading: "sui / mizu, mizu-", meaning: "Water" },
//   { kanji: "木", reading: "boku, moku / ki, ko-", meaning: "Tree, Wood" },
//   { kanji: "金", reading: "kin, kon / kane, -gane", meaning: "Gold, Metal" },
//   { kanji: "土", reading: "do, to / tsuchi", meaning: "Earth, Soil" },
// ];

const QuizScreen = () => {
  const [words, setWords] = useState<KanjiWord[]>([]);
  const [loading, setLoading] = useState(true);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timer, setTimer] = useState(20);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (quizStarted && !quizFinished) {
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
  }, [quizStarted, quizFinished, currentQuestionIndex]);

  useEffect(() => {
    const getWords = async () => {
      try {
        const data = await fetchWords();
        setWords(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    getWords();
  }, []);

  const handleStartQuiz = () => {
    setQuizStarted(true);
    setQuizFinished(false);
    setCurrentQuestionIndex(0);
    setTimer(20);
    setShowDetails(false);
  };

  const handleNext = () => {
    if (currentQuestionIndex < words.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTimer(20);
      setShowDetails(false);
    } else {
      setQuizFinished(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setTimer(20);
      setShowDetails(false);
    }
  };

  if (!quizStarted) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <TouchableOpacity
          className="bg-blue-500 py-4 px-8 rounded-lg"
          onPress={handleStartQuiz}
        >
          <Text className="text-white text-xl font-bold">Start Quiz</Text>
        </TouchableOpacity>
      </View>
    );
  }
  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  if (quizFinished) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <Text className="text-2xl font-bold mb-8">Quiz Finished!</Text>
        <TouchableOpacity
          className="bg-blue-500 py-4 px-8 rounded-lg"
          onPress={handleStartQuiz}
        >
          <Text className="text-white text-xl font-bold">Restart Quiz</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!loading) {
    const currentKanji = words[currentQuestionIndex];
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <AnimatedCircularProgress
          size={120}
          width={15}
          fill={(timer / 20) * 200}
          tintColor="#3783f0"
          backgroundColor="#e6e7e9"
          rotation={0}
          lineCap="round"
        >
          {() => (
            <Text className="text-3xl font-bold text-blue-500">{timer}</Text>
          )}
        </AnimatedCircularProgress>

        <View className="w-4/5 h-64 bg-white rounded-2xl justify-center items-center flex-row shadow-lg mt-10 mb-10">
          <Text className="text-8xl">{currentKanji.kanji}</Text>
          <Text className="text-8xl">{currentKanji.meaning}</Text>
        </View>

        <TouchableOpacity
          className="bg-green-500 py-3 px-6 rounded-lg mb-8"
          onPress={() => setShowDetails(!showDetails)}
        >
          <Text className="text-white text-lg font-bold">
            {showDetails ? "Hide" : "Show"} Reading & Meaning
          </Text>
        </TouchableOpacity>

        {showDetails && (
          <View className="w-4/5 p-4 bg-white rounded-lg shadow-md mb-8 items-center">
            <Text className="text-lg font-bold">Reading:</Text>
            <Text className="text-md text-center mb-2">
              {currentKanji.reading}
            </Text>
            <Text className="text-lg font-bold">Meaning:</Text>
            <Text className="text-md">{currentKanji.meaning}</Text>
          </View>
        )}

        <View className="flex-row justify-between w-4/5">
          <TouchableOpacity
            className={`py-3 px-6 rounded-lg min-w-[120px] items-center ${
              currentQuestionIndex === 0 ? "bg-gray-400" : "bg-blue-500"
            }`}
            onPress={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            <Text className="text-white text-lg font-bold">Previous</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-blue-500 py-3 px-6 rounded-lg min-w-[120px] items-center"
            onPress={handleNext}
          >
            <Text className="text-white text-lg font-bold">
              {currentQuestionIndex === words.length - 1 ? "Finish" : "Next"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
};

export default QuizScreen;
