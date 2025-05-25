import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Импорты
import { symptoms } from "./data/symptomList";
import { saveResultToDB } from "./lib/database";

const { width } = Dimensions.get("window");

export default function CalculatorScreen() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [selected, setSelected] = useState<boolean[]>(
    Array(symptoms.length).fill(false)
  );
  const [totalScore, setTotalScore] = useState<number>(0);
  const router = useRouter();

  const toggleDropdown = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const toggleCheckbox = (index: number) => {
    const newSelected = [...selected];
    newSelected[index] = !newSelected[index];
    setSelected(newSelected);
  };

  const calculateScore = () => {
    const score = selected.reduce(
      (sum, isPresent, index) => sum + (isPresent ? symptoms[index].score : 0),
      0
    );
    setTotalScore(score);
    saveResultToDB(score, new Date());
  };

  const resetCalculator = () => {
    setSelected(Array(symptoms.length).fill(false));
    setTotalScore(0);
    setExpandedIndex(null);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <Text style={styles.title}>SELENA-SLEDAI Калькулятор</Text>
      </View>

      {/* Список симптомов */}
      {symptoms.map((item, index) => (
        <View key={index} style={styles.dropdownContainer}>
          <View style={styles.dropdownHeaderContainer}>
            <TouchableOpacity
              style={styles.dropdownHeaderLeft}
              onPress={() => toggleDropdown(index)}
              accessibilityLabel={`Toggle ${item.title}`}
            >
              <Text style={styles.arrow}>
                {expandedIndex === index ? "▼" : "▶"}
              </Text>
              <Text style={styles.dropdownTitle} numberOfLines={0}>
                {item.title}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => toggleCheckbox(index)}
              accessibilityLabel={`Select ${item.title}`}
            >
              <View
                style={[styles.checkbox, selected[index] && styles.checked]}
              >
                {selected[index] && <Text style={styles.checkmark}>✓</Text>}
              </View>
            </TouchableOpacity>
          </View>

          {expandedIndex === index && (
            <View style={styles.dropdownBody}>
              <Text style={styles.dropdownDescription}>{item.description}</Text>
              <Text style={styles.checkboxLabel}>({item.score} балл)</Text>
            </View>
          )}
        </View>
      ))}

      {/* Результат */}
      {totalScore > 0 && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>Общий балл: {totalScore}</Text>
          <Text style={styles.interpretation}>
            Интерпретация:{" "}
            {totalScore >= 20
              ? "Высокая активность болезни"
              : "Низкая активность"}
          </Text>
        </View>
      )}

      {/* Кнопки */}
      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={[styles.button, styles.calculateButton]}
          onPress={calculateScore}
        >
          <Text style={styles.buttonText}>Рассчитать</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.resetButton]}
          onPress={resetCalculator}
        >
          <Text style={styles.buttonText}>Сбросить</Text>
        </TouchableOpacity>
      </View>

      {/* Навигация */}
      <View style={styles.navButtons}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => router.push("./history")}
        >
          <Text style={styles.navButtonText}>История</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => router.push("./chart")}
        >
          <Text style={styles.navButtonText}>График</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  contentContainer: {
    paddingBottom: 20,
  },
  header: {
    backgroundColor: "#4a6da7",
    paddingVertical: Platform.OS === "ios" ? 25 : 20,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  title: {
    fontSize: width < 400 ? 18 : 20,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  dropdownContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 8,
    marginHorizontal: 10,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  dropdownHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#eef2f6",
    minHeight: 50,
  },
  dropdownHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    flex: 1,
  },
  dropdownTitle: {
    fontSize: width < 400 ? 14 : 16,
    fontWeight: "600",
    color: "#333",
    flexShrink: 1,
    marginRight: 8,
    flexWrap: "wrap", // разрешает перенос строк
  },
  arrow: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#4a6da7",
    marginRight: 8,
    minWidth: 16,
  },
  checkboxContainer: {
    padding: 16,
    paddingLeft: 0,
  },
  dropdownBody: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#f9f9f9",
  },
  dropdownDescription: {
    fontSize: width < 400 ? 13 : 14,
    lineHeight: 20,
    color: "#555",
    marginBottom: 10,
  },
  checkboxLabel: {
    fontSize: width < 400 ? 13 : 14,
    color: "#333",
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  checked: {
    backgroundColor: "#4a6da7",
    borderColor: "#4a6da7",
  },
  checkmark: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  resultContainer: {
    marginVertical: 15,
    marginHorizontal: 10,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  resultText: {
    fontSize: width < 400 ? 16 : 18,
    fontWeight: "bold",
    color: "#4a6da7",
  },
  interpretation: {
    marginTop: 8,
    fontSize: width < 400 ? 14 : 16,
    color: "#555",
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    marginBottom: 15,
    marginHorizontal: 10,
  },
  button: {
    padding: 12,
    borderRadius: 8,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 50,
  },
  calculateButton: {
    backgroundColor: "#4a6da7",
    marginRight: 5,
  },
  resetButton: {
    backgroundColor: "#6c757d",
    marginLeft: 5,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: width < 400 ? 14 : 16,
  },
  navButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
    marginBottom: 20,
    marginHorizontal: 10,
  },
  navButton: {
    backgroundColor: "#4a6da7",
    padding: 12,
    borderRadius: 8,
    width: "45%",
    justifyContent: "center",
    alignItems: "center",
  },
  navButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "600",
    fontSize: width < 400 ? 14 : 16,
  },
});
