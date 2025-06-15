import { useLocalSearchParams, useRouter } from "expo-router";
import { X } from "lucide-react-native";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Sample data - in a real app, this would come from your API
const SAMPLE_QUESTIONS = [
  {
    id: 1,
    kanji: "日",
    correctAnswer: "Day, Sun",
    options: ["Day, Sun", "Month, Moon", "Fire", "Water"],
  },
  {
    id: 2,
    kanji: "月",
    correctAnswer: "Month, Moon",
    options: ["Day, Sun", "Month, Moon", "Tree, Wood", "Earth"],
  },
  {
    id: 3,
    kanji: "火",
    correctAnswer: "Fire",
    options: ["Water", "Fire", "Gold", "Earth"],
  },
  {
    id: 4,
    kanji: "水",
    correctAnswer: "Water",
    options: ["Tree", "Fire", "Water", "Metal"],
  },
  {
    id: 5,
    kanji: "木",
    correctAnswer: "Tree, Wood",
    options: ["Tree, Wood", "Water", "Fire", "Earth"],
  },
];

const PracticeScreen = () => {
  const { id } = useLocalSearchParams();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const router = useRouter();

  const currentQuestion = SAMPLE_QUESTIONS[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / SAMPLE_QUESTIONS.length) * 100;

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    const correct = answer === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    if (correct) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < SAMPLE_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
    } else {
      setShowResult(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setScore(0);
    setShowResult(false);
  };

  if (showResult) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100 p-5">
        <View className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
          <Text className="text-3xl font-bold text-center mb-4">
            Quiz Complete!
          </Text>
          <Text className="text-xl text-center mb-6">
            Your score: {score} out of {SAMPLE_QUESTIONS.length}
          </Text>
          <TouchableOpacity
            className="bg-blue-500 py-4 px-6 rounded-lg"
            onPress={handleRestart}
          >
            <Text className="text-white text-center text-lg font-bold">
              Try Again
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="p-5">
        <View className="w-full flex-row justify-center items-center gap-2 mb-4">
          <TouchableOpacity onPress={() => router.push("/(tabs)/quiz")}>
            <X />
          </TouchableOpacity>
          {/* Progress Bar */}
          <View className="w-[75%] bg-gray-300 rounded-full h-2.5">
            <View
              className="bg-green-500 h-2.5 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </View>

          {/* Question Counter */}
          <Text className="text-right text-gray-600">
            {currentQuestionIndex + 1} / {SAMPLE_QUESTIONS.length}
          </Text>
        </View>

        {/* Kanji Display */}
        <View className="bg-white p-8 rounded-2xl shadow-lg mb-8 items-center">
          <Text className="text-8xl mb-4">{currentQuestion.kanji}</Text>
          <Text className="text-gray-600 text-lg">
            What is the meaning of this kanji?
          </Text>
        </View>

        {/* Answer Options */}
        <View className="gap-y-2">
          {currentQuestion.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              className={`p-4 rounded-xl ${
                selectedAnswer === option
                  ? isCorrect
                    ? "bg-green-500"
                    : "bg-red-500"
                  : "bg-white"
              } shadow-md`}
              onPress={() => !selectedAnswer && handleAnswer(option)}
              disabled={selectedAnswer !== null}
            >
              <Text
                className={`text-lg text-center ${
                  selectedAnswer === option ? "text-white" : "text-gray-800"
                }`}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Next Button */}
        {selectedAnswer && (
          <TouchableOpacity
            className="bg-blue-500 py-4 px-6 rounded-lg mt-8"
            onPress={handleNext}
          >
            <Text className="text-white text-center text-lg font-bold">
              {currentQuestionIndex === SAMPLE_QUESTIONS.length - 1
                ? "Finish"
                : "Next Question"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

export default PracticeScreen;
