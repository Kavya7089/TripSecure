// src/screens/ExpenseTrackerScreen.js
import React, { useState } from "react";
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { updateTrip } from "../services/api";

export default function ExpenseTrackerScreen({ route }) {
  const { tripId } = route.params || {};  // tripId passed from previous screen
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("");
  const [expenses, setExpenses] = useState([]);

  function addExpense() {
    if (!type || !amount) return Alert.alert("Error", "Please fill all fields");
    setExpenses((prev) => [...prev, { type, amount: parseFloat(amount), date: new Date() }]);
    setAmount("");
    setType("");
  }

  async function saveExpenses() {
    try {
      if (!tripId) {
        Alert.alert("Error", "Trip ID is missing. Cannot save to DB.");
        return;
      }

      await updateTrip(tripId, { expenses });
      Alert.alert("Success", "Expenses saved to database!");
    } catch (e) {
      Alert.alert("Error", e.message || "Failed to save expenses");
    }
  }

  const renderExpense = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.type}</Text>
      <Text style={styles.cardAmount}>₹{item.amount}</Text>
      <Text style={styles.cardDate}>{item.date.toLocaleDateString()}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Expense Tracker</Text>

      <TextInput
        placeholder="Type (hotel/food)"
        style={styles.input}
        value={type}
        onChangeText={setType}
      />

      <TextInput
        placeholder="Amount"
        style={styles.input}
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />

      {/* Add Button */}
      <TouchableOpacity style={styles.btn} onPress={addExpense}>
        <Text style={styles.btnText}>Add</Text>
      </TouchableOpacity>

      <FlatList
        data={expenses}
        style={styles.FlatList}
        renderItem={renderExpense}
        keyExtractor={(_, i) => String(i)}
      />

      {/* Save Button */}
      <TouchableOpacity style={styles.btn} onPress={saveExpenses}>
        <Text style={styles.btnText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 18, backgroundColor: "#ecfcca", flex: 1 },
  title: { fontSize: 20, marginBottom: 12, fontWeight: "900", color: "#35530e" },
  FlatList: { marginVertical: 30 },

  input: {
    borderWidth: 2,
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
    borderColor: "#5ea500",
    height: 55,
    backgroundColor: "#fff",
  },

  btn: {
    backgroundColor: "#5ea500",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginVertical: 10,
  },
  btnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },

  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: { fontSize: 16, fontWeight: "600", color: "#35530e" },
  cardAmount: { fontSize: 14, fontWeight: "500", color: "#5ea500", marginTop: 4 },
  cardDate: { fontSize: 12, color: "#666", marginTop: 2 },
});
