// app/history.tsx
import React, { useEffect, useState } from "react";
import { FlatList, ScrollView, StyleSheet, Text, View } from "react-native";
import { fetchHistoryFromDB } from "./lib/database";

export default function HistoryScreen() {
  const [history, setHistory] = useState<
    { id: number; score: number; date: string }[]
  >([]);

  useEffect(() => {
    const loadHistory = async () => {
      const data = await fetchHistoryFromDB();
      setHistory(data);
    };
    loadHistory();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>История результатов</Text>
      <ScrollView>
        <FlatList
          data={history}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text>Балл: {item.score}</Text>
              <Text>Дата: {new Date(item.date).toLocaleString()}</Text>
            </View>
          )}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
});
