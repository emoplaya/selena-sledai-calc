import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: "Selena-Sledai Calculator" }}
      />
      <Stack.Screen name="history" options={{ title: "History" }} />
      <Stack.Screen name="chart" options={{ title: "Chart" }} />
    </Stack>
  );
}
