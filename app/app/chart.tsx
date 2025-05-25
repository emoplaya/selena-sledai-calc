// app/chart.tsx
import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { fetchHistoryFromDB } from "./lib/database";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

export default function ChartScreen() {
  const [data, setData] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const [scrollOffset] = useState(new Animated.Value(0));
  const [showScrollHint, setShowScrollHint] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      const history = await fetchHistoryFromDB();
      const sortedHistory = history.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      setData(sortedHistory.map((item) => item.score));
      setLabels(
        sortedHistory.map((item) => new Date(item.date).toLocaleDateString())
      );
    };
    loadHistory();
  }, []);

  // Анимация подсказки о прокрутке
  useEffect(() => {
    if (labels.length > 5) {
      const timer = setTimeout(() => {
        setShowScrollHint(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [labels.length]);

  if (data.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Нет данных для отображения графика</Text>
      </View>
    );
  }

  // Рассчитываем ширину графика
  const chartWidth = Math.max(
    screenWidth * 1.5, // Базовая увеличенная ширина
    data.length * 70 // 70px на каждую точку данных
  );

  return (
    <View style={styles.container}>
      {showScrollHint && labels.length > 5 && (
        <Animated.View
          style={[
            styles.scrollHint,
            {
              opacity: scrollOffset.interpolate({
                inputRange: [0, 50],
                outputRange: [1, 0],
              }),
            },
          ]}
        >
          <MaterialIcons name="swipe" size={24} color="#4a6da7" />
          <Text style={styles.hintText}>Прокрутите в сторону</Text>
        </Animated.View>
      )}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={true}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollOffset } } }],
          { useNativeDriver: false }
        )}
        contentContainerStyle={styles.scrollContainer}
      >
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
          height={screenHeight * 0.4} // Увеличенная высота
          yAxisLabel=""
          yAxisSuffix=""
          yAxisInterval={1}
          fromZero
          chartConfig={{
            backgroundGradientFrom: "#f5f5f5",
            backgroundGradientTo: "#f5f5f5",
            decimalPlaces: 0,
            color: () => "#4a6da7",
            labelColor: () => "#333",
            propsForLabels: {
              fontSize: 12,
            },
            propsForDots: {
              r: "6",
              strokeWidth: "2",
              stroke: "#4a6da7",
            },
            style: {
              borderRadius: 16,
            },
          }}
          bezier
          style={{
            marginVertical: 16,
            borderRadius: 16,
            paddingRight: 20,
          }}
          withVerticalLines={data.length < 20}
          withHorizontalLines={true}
          segments={5}
          xLabelsOffset={-10}
          verticalLabelRotation={45} // Наклон подписей дат для лучшей читаемости
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  scrollContainer: {
    paddingBottom: 30,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
  },
  scrollHint: {
    position: "absolute",
    top: "50%",
    right: 20,
    backgroundColor: "rgba(255,255,255,0.9)",
    padding: 10,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 100,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  hintText: {
    fontSize: 14,
    color: "#4a6da7",
    marginLeft: 5,
    fontWeight: "500",
  },
});
