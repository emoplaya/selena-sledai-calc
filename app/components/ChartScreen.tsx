// app/chart.tsx
import React, { useEffect, useState } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { fetchHistoryFromDB } from "../lib/database";

export default function ChartScreen() {
  const [data, setData] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);

  useEffect(() => {
    const loadHistory = async () => {
      const history = await fetchHistoryFromDB();
      const sortedHistory = history.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      setData(sortedHistory.map((item) => item.score));
      setLabels(
        sortedHistory.map((item) =>
          new Date(item.date).toLocaleDateString("ru-RU", {
            day: "numeric",
            month: "short",
          })
        )
      );
    };
    loadHistory();
  }, []);

  const chartWidth = Math.min(Dimensions.get("window").width - 40, 500);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>График активности болезни</Text>

      {data.length > 0 ? (
        <View style={styles.chartContainer}>
          <LineChart
            data={{
              labels: labels,
              datasets: [
                {
                  data: data,
                  color: () => "#4a6da7",
                  strokeWidth: 2,
                },
              ],
              legend: ["Активность SLE"],
            }}
            width={chartWidth}
            height={220}
            yAxisLabel=""
            yAxisSuffix=""
            yAxisInterval={1}
            chartConfig={{
              backgroundGradientFrom: "#f5f5f5",
              backgroundGradientTo: "#f5f5f5",
              decimalPlaces: 0,
              color: () => "#4a6da7",
              labelColor: () => "#333",
              propsForDots: {
                r: "5",
                strokeWidth: "2",
                stroke: "#4a6da7",
              },
              propsForLabels: {
                fontSize: 10,
              },
            }}
            bezier
            style={styles.chart}
          />
        </View>
      ) : (
        <Text style={styles.emptyText}>Нет данных для отображения графика</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
  },
  chartContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  chart: {
    borderRadius: 10,
    paddingRight: 10,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    color: "#666",
  },
});
