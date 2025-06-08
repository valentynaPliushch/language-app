import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Button,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import Modal from "react-native-modal";

const { width: screenWidth } = Dimensions.get("window");
const itemVisibleWidth = screenWidth / 2.5;

const jlptLevels = [
  { label: "JLPT N5", value: "n5" },
  { label: "JLPT N4", value: "n4" },
  { label: "JLPT N3", value: "n3" },
  { label: "JLPT N2", value: "n2" },
  { label: "JLPT N1", value: "n1" },
];

type Unit = {
  title: string;
  description: string;
  order: number;
};

type Lesson = { id: string; title: string };

// Dummy lessons data
const dummyLessons: Lesson[] = [
  { id: "1", title: "Lesson 1: Greetings" },
  { id: "2", title: "Lesson 2: Numbers" },
  { id: "3", title: "Lesson 3: Basic Kanji" },
  { id: "4", title: "Lesson 4: Particles" },
  { id: "5", title: "Lesson 5: Verb Conjugation" },
];

export default function Index() {
  const [lessons, setLessons] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(jlptLevels[0].value);
  const [items, setItems] = useState(jlptLevels);
  const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [selectedItemKey, setSelectedItemKey] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch("https://language-app-ws2r.onrender.com/lessons")
      .then((res) => res.json())
      .then((data) => {
        setLessons(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load lessons:", err);
        setLoading(false);
      });
  }, []);

  const handleCardPress = (itemTitle: string) => {
    setSelectedItemKey(itemTitle);
    setBottomSheetVisible(true);
  };

  const handleLessonPress = (lessonId: string) => {
    setBottomSheetVisible(false);
    router.push({ pathname: "/lesson/[id]", params: { id: lessonId } });
  };

  const renderItem = ({ item }: { item: Unit }) => (
    <TouchableOpacity
      onPress={() => handleCardPress(item.title)}
      style={styles.itemContainer}
    >
      <View style={styles.cardContentWrapper}>
        <Image
          source={{ uri: "https://via.placeholder.com/100" }}
          style={styles.cardImage}
        />
        <Text style={styles.cardTitleText}>{item.title}</Text>
        <View style={styles.cardFooter}>
          <Text style={styles.cardStatusText}>5/5</Text>
          <Text style={styles.cardCheckmark}>⭐</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderLessonItem = ({ item }: { item: Lesson }) => (
    <TouchableOpacity
      onPress={() => handleLessonPress(item.id)}
      style={styles.lessonItem}
    >
      <Text style={styles.lessonItemText}>{item.title}</Text>
    </TouchableOpacity>
  );

  if (loading) return <ActivityIndicator size="large" color="blue" />;
  return (
    <View style={styles.pageContainer}>
      <View style={styles.pickerContainer}>
        <DropDownPicker
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
        />
      </View>
      <View style={styles.listContainer}>
        <FlatList
          data={lessons}
          renderItem={renderItem}
          keyExtractor={(item: Unit) => item.order.toString()}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        />
      </View>

      <Modal
        isVisible={isBottomSheetVisible}
        onBackdropPress={() => setBottomSheetVisible(false)}
        onSwipeComplete={() => setBottomSheetVisible(false)}
        swipeDirection={["down"]}
        style={styles.bottomSheetModal}
      >
        <View style={styles.bottomSheetContentContainer}>
          <Text style={styles.bottomSheetTitle}>
            Lessons for {selectedItemKey}
          </Text>
          <FlatList
            data={dummyLessons}
            renderItem={renderLessonItem}
            keyExtractor={(item: Lesson) => item.id}
            style={styles.lessonsList}
          />
          <Button title="Close" onPress={() => setBottomSheetVisible(false)} />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  pickerContainer: {
    paddingTop: 50,
    paddingHorizontal: 10,
    backgroundColor: "#f0f0f0",
  },
  picker: {
    height: 50,
    width: "100%",
    backgroundColor: "white",
  },
  listContainer: {
    flex: 1,
    justifyContent: "center",
  },
  itemContainer: {
    width: itemVisibleWidth,
    margin: 5,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
  },
  cardContentWrapper: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 6,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cardImage: {
    width: "80%",
    height: undefined,
    aspectRatio: 1.5,
    borderRadius: 4,
    marginBottom: 8,
  },
  cardTitleText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 8,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
  },
  cardStatusText: {
    fontSize: 14,
    color: "#333",
  },
  cardCheckmark: {
    fontSize: 20,
    color: "gold",
  },
  bottomSheetModal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  bottomSheetContentContainer: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "70%",
  },
  bottomSheetTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  lessonsList: {
    marginBottom: 15,
  },
  lessonItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  lessonItemText: {
    fontSize: 16,
  },
});
