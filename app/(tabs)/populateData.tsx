import React, { useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";
import { API_URL } from "../../backend/config";
import KanjiListScreen from "../kanji-list";

const AddWordScreen = () => {
  const [kanji, setKanji] = useState("");
  const [reading, setReading] = useState("");
  const [meaning, setMeaning] = useState("");
  const [showWords, setShowWords] = useState(false);
  const unitId = "683c6a3a72e30e7dea782eac";

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${API_URL}/words`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ unitId, kanji, reading, meaning }),
      });

      if (!response.ok) throw new Error("Failed to add word");

      const data = await response.json();
      Alert.alert("✅ Success", `Word added: ${data.kanji}`);
      setKanji("");
      setReading("");
      setMeaning("");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View style={styles.container}>
      <View className="flex-1 p-20">
        <Button
          title={showWords ? "Hide words" : "Show words"}
          onPress={() => setShowWords((prev) => !prev)}
        />
        {showWords && <KanjiListScreen />}
      </View>
      <Text>Kanji</Text>
      <TextInput style={styles.input} value={kanji} onChangeText={setKanji} />

      <Text>Reading</Text>
      <TextInput
        style={styles.input}
        value={reading}
        onChangeText={setReading}
      />

      <Text>Meaning</Text>
      <TextInput
        style={styles.input}
        value={meaning}
        onChangeText={setMeaning}
      />

      <Button title="Add Word" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginVertical: 10,
    borderRadius: 6,
  },
});

export default AddWordScreen;
