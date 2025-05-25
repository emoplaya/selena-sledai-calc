import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { saveResultToDB } from "../lib/database";

export default function CalculatorScreen() {
  const [answers, setAnswers] = useState<number[]>(Array(24).fill(0));
  const [totalScore, setTotalScore] = useState<number>(0);
  const router = useRouter();

  const questions = [
    "Непереносимость яркого света (фотофобия)",
    "Боль при движении глазами",
    "Слезотечение",
    "Раздражение или ощущение песка в глазах",
    "Покраснение глаз",
    "Снижение остроты зрения",
    // Добавьте остальные 18 вопросов
  ];

  const handleAnswerChange = (index: number, value: string) => {
    const numValue = parseInt(value) || 0;
    if (numValue >= 0 && numValue <= 4) {
      const newAnswers = [...answers];
      newAnswers[index] = numValue;
      setAnswers(newAnswers);
    }
  };

  const calculateScore = () => {
    const score = answers.reduce((sum, current) => sum + current, 0);
    setTotalScore(score);
    saveResultToDB(score, new Date());
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selena-Sledai Calculator</Text>

      {questions.map((question, index) => (
        <View key={index} style={styles.questionContainer}>
          <Text style={styles.questionText}>
            {index + 1}. {question}
          </Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={answers[index].toString()}
            onChangeText={(text) => handleAnswerChange(index, text)}
            placeholder="0-4"
          />
        </View>
      ))}

      <Button title="Calculate Score" onPress={calculateScore} />

      {totalScore > 0 && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>Total Score: {totalScore}</Text>
          <Text style={styles.interpretation}>
            Interpretation:{" "}
            {totalScore >= 20
              ? "High disease activity"
              : "Low disease activity"}
          </Text>
        </View>
      )}

      <View style={styles.navButtons}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => router.push("/history")}
        >
          <Text>View History</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => router.push("/chart")}
        >
          <Text>View Chart</Text>
        </TouchableOpacity>
      </View>
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
    textAlign: "center",
  },
  questionContainer: {
    marginBottom: 12,
  },
  questionText: {
    fontSize: 14,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
  },
  resultContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
  },
  resultText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  interpretation: {
    fontSize: 16,
    marginTop: 8,
  },
  navButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  navButton: {
    padding: 10,
    backgroundColor: "#ddd",
    borderRadius: 5,
  },
});
