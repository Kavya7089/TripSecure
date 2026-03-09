// src/screens/TripPlannerScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Platform,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { createTrip } from "../services/api"; // Backend API
import { analyzeTrip } from "../services/api"; // AI Engine API

export default function TripPlannerScreen() {
  const [newTrip, setNewTrip] = useState({
    title: "",
    destination: "",
    startDate: "",
    endDate: "",
    budget: "",
    travelers: "",
  });
  const [itinerary, setItinerary] = useState([]);

  // For Date Picker
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const addTrip = () => {
    if (!newTrip.title.trim() || !newTrip.destination.trim()) return;
    setItinerary([...itinerary, { ...newTrip, saved: false }]);
    setNewTrip({
      title: "",
      destination: "",
      startDate: "",
      endDate: "",
      budget: "",
      travelers: "",
    });
  };

  const saveTrip = async (index) => {
    try {
      const trip = itinerary[index];

      // 1. Save trip in backend
      const response = await createTrip(trip);
      console.log("Trip saved in backend:", response.data);

      // 2. Get AI analysis
      const aiResult = await analyzeTrip(trip);
      console.log("AI analysis:", aiResult);

      // 3. Update local UI
      const updated = [...itinerary];
      updated[index].saved = true;
      updated[index].analysis = aiResult; // attach AI insights
      setItinerary(updated);

      Alert.alert("Success", "✅ Trip saved & analyzed!");
    } catch (err) {
      console.error("Error saving trip:", err);
      Alert.alert("Error", "❌ Failed to save trip");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Plan New Trip</Text>

      {/* Inputs */}
      <View style={styles.inputGroup}>
        <TextInput
          style={styles.input}
          placeholder="Trip Title"
          value={newTrip.title}
          onChangeText={(text) => setNewTrip({ ...newTrip, title: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Destination"
          value={newTrip.destination}
          onChangeText={(text) =>
            setNewTrip({ ...newTrip, destination: text })
          }
        />
      </View>

      {/* Date Pickers */}
      <View style={styles.inputGroup}>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowStartPicker(true)}
        >
          <Text style={{ color: newTrip.startDate ? "#000" : "#999" }}>
            {newTrip.startDate || "Select Start Date"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowEndPicker(true)}
        >
          <Text style={{ color: newTrip.endDate ? "#000" : "#999" }}>
            {newTrip.endDate || "Select End Date"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Show Start Date Picker */}
      {showStartPicker && (
        <DateTimePicker
          value={newTrip.startDate ? new Date(newTrip.startDate) : new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(event, selectedDate) => {
            setShowStartPicker(false);
            if (selectedDate) {
              const formatted = selectedDate.toISOString().split("T")[0];
              setNewTrip({ ...newTrip, startDate: formatted });
            }
          }}
        />
      )}

      {/* Show End Date Picker */}
      {showEndPicker && (
        <DateTimePicker
          value={newTrip.endDate ? new Date(newTrip.endDate) : new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(event, selectedDate) => {
            setShowEndPicker(false);
            if (selectedDate) {
              const formatted = selectedDate.toISOString().split("T")[0];
              setNewTrip({ ...newTrip, endDate: formatted });
            }
          }}
        />
      )}

      {/* Budget & Travelers */}
      <View style={styles.inputGroup}>
        <TextInput
          style={styles.input}
          placeholder="Budget in Rupees"
          keyboardType="numeric"
          value={String(newTrip.budget)}
          onChangeText={(text) => setNewTrip({ ...newTrip, budget: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="No of Travelers"
          keyboardType="numeric"
          value={String(newTrip.travelers)}
          onChangeText={(text) => setNewTrip({ ...newTrip, travelers: text })}
        />
      </View>

      {/* Add Button */}
      <TouchableOpacity style={styles.btn} onPress={addTrip}>
        <Text style={styles.btnText}> Add to Itinerary</Text>
      </TouchableOpacity>

      {/* Trip Cards */}
      <FlatList
        style={{ marginTop: 20 }}
        data={itinerary}
        keyExtractor={(_, i) => String(i)}
        renderItem={({ item, index }) => (
          <View
            style={[
              styles.card,
              item.saved ? styles.savedCard : styles.pendingCard,
            ]}
          >
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardText}>📍 {item.destination}</Text>
            <Text style={styles.cardText}>
              📅 {item.startDate} → {item.endDate}
            </Text>
            <Text style={styles.cardText}>💰 Budget: {item.budget}</Text>
            <Text style={styles.cardText}>👥 Travelers: {item.travelers}</Text>

            {/* AI Insights */}
            {item.analysis && (
              <View
                style={{
                  marginTop: 8,
                  padding: 6,
                  backgroundColor: "#e8f5e9",
                  borderRadius: 6,
                }}
              >
                <Text style={{ fontWeight: "bold" }}>AI Insights:</Text>
                <Text>⚠ Risk: {item.analysis.risk_score}</Text>
                <Text>💡 {item.analysis.suggestion}</Text>
              </View>
            )}

            {!item.saved && (
              <TouchableOpacity
                style={styles.saveBtn}
                onPress={() => saveTrip(index)}
              >
                <Text style={styles.saveBtnText}> Save Trip</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ecfcca", padding: 20 },
  heading: { fontSize: 20, fontWeight: "bold", marginBottom: 15, color: "#333" },
  inputGroup: { flexDirection: "row", justifyContent: "space-between" },
  input: {
    flex: 1,
    borderWidth: 3,
    borderColor: "#5ea500",
    padding: 12,
    margin: 4,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  btn: {
    backgroundColor: "#5ea500",
    padding: 14,
    borderRadius: 8,
    marginTop: 8,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "bold" },
  card: { padding: 15, borderRadius: 10, marginBottom: 12 },
  pendingCard: { backgroundColor: "#ffe5b4" }, // orange
  savedCard: { backgroundColor: "#c7f7c2" }, // green
  cardTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 6 },
  cardText: { fontSize: 14, marginBottom: 3, color: "#333" },
  saveBtn: {
    backgroundColor: "#f77f00",
    padding: 8,
    borderRadius: 6,
    marginTop: 8,
    alignItems: "center",
  },
  saveBtnText: { color: "#fff", fontWeight: "bold" },
});
