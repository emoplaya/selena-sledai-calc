import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Symptom {
  title: string;
  description: string;
  score: number;
}

interface SymptomItemProps {
  symptom: Symptom;
  isSelected: boolean;
  onToggle: () => void;
}

const SymptomItem: React.FC<SymptomItemProps> = ({
  symptom,
  isSelected,
  onToggle,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text
          style={styles.title}
          numberOfLines={0} // Не ограничивать количество строк
        >
          {symptom.title}
        </Text>

        <TouchableOpacity
          style={styles.arrowButton}
          onPress={() => setIsExpanded(!isExpanded)}
        >
          <Text style={styles.arrow}>{isExpanded ? "▼" : "▶"}</Text>
        </TouchableOpacity>
      </View>

      {isExpanded && (
        <View style={styles.descriptionContainer}>
          <Text style={styles.description}>{symptom.description}</Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.checkboxRow}
        onPress={onToggle}
        activeOpacity={0.7}
      >
        <View style={[styles.checkbox, isSelected && styles.checked]}>
          {isSelected && <Text style={styles.checkmark}>✓</Text>}
        </View>
        <Text style={styles.checkboxLabel}>
          Отметить ({symptom.score} балл{symptom.score !== 1 ? "а" : ""})
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 10,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    marginHorizontal: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#eef2f6",
    minHeight: 60, // Минимальная высота для удобного нажатия
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    flex: 1,
    marginRight: 10,
    flexWrap: "wrap", // Разрешаем перенос слов
  },
  arrowButton: {
    padding: 5,
  },
  arrow: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4a6da7",
  },
  descriptionContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#f9f9f9",
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: "#555",
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    paddingTop: 0,
  },
  checkboxLabel: {
    marginLeft: 10,
    fontSize: 14,
    color: "#333",
  },
  checkbox: {
    width: 24,
    height: 24,
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
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default SymptomItem;
