import { useRouter } from "expo-router";
import { Button, View } from "react-native";

const QuizScreen = () => {
  const router = useRouter();
  const id = "1";
  return (
    <View className="flex-1 justify-center items-center gap-4">
      <Button
        title="Learn Kanji"
        onPress={() => router.push(`/quiz/learn/${id}`)}
      />
      <Button
        title="Practice Kanji"
        onPress={() => router.push(`/quiz/practice/${id}`)}
      />
    </View>
  );
};

export default QuizScreen;
