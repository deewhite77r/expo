import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, FlatList } from "react-native";

export default function LotteryApp() {
  const [history, setHistory] = useState([]);
  const [pick, setPick] = useState(null);
  const [suggested, setSuggested] = useState(null);

  // Generate random 3-number pick
  const quickPick = () => {
    const newPick = Array.from({ length: 3 }, () =>
      Math.floor(Math.random() * 10)
    );
    setHistory([...history, newPick]);
    setPick(newPick);
  };

  // Frequency analysis
  const frequencyAnalysis = () => {
    const flat = history.flat();
    const counts = {};
    flat.forEach((n) => {
      counts[n] = (counts[n] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([num, freq]) => ({ num, freq }));
  };

  // Suggested pick from most frequent
  const suggestPick = () => {
    if (history.length === 0) {
      quickPick();
      return;
    }
    const freq = frequencyAnalysis();
    let topNumbers = freq.slice(0, 3).map((f) => parseInt(f.num));
    while (topNumbers.length < 3) {
      topNumbers.push(Math.floor(Math.random() * 10));
    }
    setSuggested(topNumbers);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎰 Lottery 3-Number Helper</Text>

      <View style={styles.buttons}>
        <TouchableOpacity style={styles.button} onPress={quickPick}>
          <Text style={styles.buttonText}>Quick Pick</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.green]} onPress={suggestPick}>
          <Text style={styles.buttonText}>Suggested Pick</Text>
        </TouchableOpacity>
      </View>

      {pick && (
        <Text style={styles.result}>
          🎲 Quick Pick: <Text style={styles.numbers}>{pick.join(" - ")}</Text>
        </Text>
      )}

      {suggested && (
        <Text style={styles.result}>
          ⭐ Suggested Pick: <Text style={styles.numbers}>{suggested.join(" - ")}</Text>
        </Text>
      )}

      <Text style={styles.subtitle}>📜 History</Text>
      <FlatList
        style={styles.list}
        data={history}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Text style={styles.listItem}>{item.join(" - ")}</Text>
        )}
      />

      <Text style={styles.subtitle}>📊 Frequency Analysis</Text>
      <FlatList
        style={styles.list}
        data={frequencyAnalysis()}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Text style={styles.listItem}>
            Number {item.num} → {item.freq} times
          </Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  buttons: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#1e40af",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  green: {
    backgroundColor: "#15803d",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  result: {
    fontSize: 18,
    color: "#fff",
    marginVertical: 8,
  },
  numbers: {
    fontWeight: "bold",
    color: "#facc15",
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
    marginTop: 20,
    marginBottom: 8,
  },
  list: {
    width: "100%",
    backgroundColor: "#222",
    padding: 10,
    borderRadius: 8,
    maxHeight: 150,
    marginBottom: 20,
  },
  listItem: {
    color: "#ddd",
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
});
