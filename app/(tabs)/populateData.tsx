import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { API_URL } from "../../backend/config";
import KanjiListScreen from "../kanji-list";

interface Unit {
  _id: string;
  title: string;
  description: string;
  order: number;
}

const AddWordScreen = () => {
  const [kanji, setKanji] = useState("");
  const [reading, setReading] = useState("");
  const [meaning, setMeaning] = useState("");
  const [showWords, setShowWords] = useState(false);
  const [units, setUnits] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchUnits();
  }, []);

  const fetchUnits = async () => {
    try {
      const response = await fetch(`${API_URL}/units`);
      if (!response.ok) throw new Error("Failed to fetch units");
      const data = await response.json();
      const formattedUnits = data.map((unit: Unit) => ({
        label: unit.title,
        value: unit._id,
      }));
      setUnits(formattedUnits);
      if (formattedUnits.length > 0) {
        setSelectedUnit(formattedUnits[0].value);
      }
    } catch (err) {
      console.error("Error fetching units:", err);
      Alert.alert("Error", "Failed to load units");
    }
  };

  const handleSubmit = async () => {
    if (!selectedUnit) {
      Alert.alert("Error", "Please select a unit");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/words`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ unitId: selectedUnit, kanji, reading, meaning }),
      });

      if (!response.ok) throw new Error("Failed to add word");

      const data = await response.json();
      Alert.alert("✅ Success", `Word added: ${data.kanji}`);
      setKanji("");
      setReading("");
      setMeaning("");
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Failed to add word");
    }
  };

  return (
    <SafeAreaView className="flex-1 px-5 py-4">
      <TouchableOpacity onPress={() => setShowWords((prev) => !prev)}>
        <Text className="text-base text-blue-600 mb-2">
          {showWords ? "Hide words" : "Show words"}
        </Text>
      </TouchableOpacity>
      {showWords && <KanjiListScreen />}

      <Text className="text-lg font-semibold mt-4">Select Unit</Text>
      <View className="my-2 z-10">
        <DropDownPicker
          open={open}
          value={selectedUnit}
          items={units}
          setOpen={setOpen}
          setValue={setSelectedUnit}
          style={{ borderColor: "#ccc" }}
          dropDownContainerStyle={{ borderColor: "#ccc" }}
          placeholder="Select a unit"
        />
      </View>

      <Text className="text-lg font-semibold mt-4">Kanji</Text>
      <TextInput
        className="border border-gray-300 rounded-md px-3 py-2 mt-1"
        value={kanji}
        onChangeText={setKanji}
      />

      <Text className="text-lg font-semibold mt-4">Reading</Text>
      <TextInput
        className="border border-gray-300 rounded-md px-3 py-2 mt-1"
        value={reading}
        onChangeText={setReading}
      />

      <Text className="text-lg font-semibold mt-4">Meaning</Text>
      <TextInput
        className="border border-gray-300 rounded-md px-3 py-2 mt-1"
        value={meaning}
        onChangeText={setMeaning}
      />

      <View className="mt-6">
        <Button title="Add Word" onPress={handleSubmit} />
      </View>
    </SafeAreaView>
  );
};

export default AddWordScreen;
