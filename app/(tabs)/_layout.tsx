import { Tabs } from "expo-router";
import { Brain, House, PlusCircle } from "lucide-react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

const _Layout = () => {
  return (
    <SafeAreaProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#000000", // active text/icon color
          tabBarInactiveTintColor: "#B2B2B2", // inactive text/icon color
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <House color={focused ? "black" : "#B2B2B2"} />
            ),
          }}
        />
        <Tabs.Screen
          name="quiz"
          options={{
            title: "Quiz",
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <Brain color={focused ? "black" : "#B2B2B2"} />
            ),
          }}
        />
        <Tabs.Screen
          name="populateData"
          options={{
            title: "Add Kanji",
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <PlusCircle color={focused ? "black" : "#B2B2B2"} />
            ),
          }}
        />
      </Tabs>
    </SafeAreaProvider>
  );
};
export default _Layout;
