import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Button, FlatList, StyleSheet, Text, View } from "react-native";
import { getHistoryFromDB } from "../lib/database";

interface HistoryItem {
  id: string;
  score: number;
  date: Date;
}

export default function HistoryScreen() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const router = useRouter();

  useEffect(() => {
    const loadHistory = async () => {
      const data = await getHistoryFromDB();
      setHistory(data);
    };
    loadHistory();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Test History</Text>

      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.historyItem}>
            <Text>Score: {item.score}</Text>
            <Text>Date: {item.date.toLocaleDateString()}</Text>
          </View>
        )}
      />

      <Button title="Back to Calculator" onPress={() => router.back()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  historyItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});
