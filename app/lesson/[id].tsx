import { useLocalSearchParams } from "expo-router";
import { Dimensions, FlatList, StyleSheet, Text, View } from "react-native";

const { width: screenWidth } = Dimensions.get("window");

const cardData = [
  { id: "1", text: "This is the first card. Swipe to see more!" },
  { id: "2", text: "Card number two. Keep swiping!" },
  { id: "3", text: "You've reached the third card." },
  { id: "4", text: "Almost there, this is card four." },
  { id: "5", text: "Last card! Swipe back to review." },
];

export default function CardStackScreen() {
  const { id } = useLocalSearchParams();

  const renderCard = ({ item }: { item: { id: string; text: string } }) => {
    return (
      <View style={styles.card}>
        <Text style={styles.cardText}>Card for ID: {id}</Text>
        <Text style={styles.cardText}>{item.text}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={cardData}
        renderItem={renderCard}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={styles.flatList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0", // Light gray background for the page
  },
  flatList: {
    flex: 1,
  },
  card: {
    width: screenWidth,
    flex: 1, // Make card take full available height within FlatList item
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 20,
  },
  cardText: {
    fontSize: 18,
    textAlign: "center",
    marginVertical: 10,
  },
});
