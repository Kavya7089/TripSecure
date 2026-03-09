// src/screens/FeedbackScreen.js
import React, { useState, useEffect } from "react";
import { View, TextInput,  Button, FlatList, Text, StyleSheet, TouchableOpacity } from "react-native";
import { addFeedback, getFeedback } from "../services/api";

export default function FeedbackScreen() {
  const [place, setPlace] = useState("");
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const [list, setList] = useState([]);

  async function fetch() {
    const r = await getFeedback();
    setList(r.data || []);
  }

  useEffect(() => {
    fetch();
  }, []);

  async function submit() {
    if (!place.trim() || !feedback.trim() || rating === 0) return;
    await addFeedback({ place, feedback, rating });
    setPlace("");
    setFeedback("");
    setRating(0);
    fetch();
  }

  return (
    <View style={styles.container}>
      {/* Place Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter place name"
        value={place}
        onChangeText={setPlace}
      />

      {/* Feedback Input */}
      <TextInput
        style={[styles.input, { height: 100, textAlignVertical: "top" }]}
        placeholder="Share your safety feedback"
        value={feedback}
        onChangeText={setFeedback}
        multiline
      />

      {/* Rating Stars */}
      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => setRating(star)}>
            <Text style={[styles.star, rating >= star ? styles.filledStar : styles.emptyStar]}>
              ★
            </Text>
          </TouchableOpacity>
        ))}
      </View>

        <TouchableOpacity style={styles.btn} onPress={submit} >
                    <Text style={styles.btnText}>Submit</Text>
        </TouchableOpacity> 

      {/* Feedback List */}
      <FlatList
        style={{ marginTop: 15 }}
        data={list}
        keyExtractor={(item, i) => String(i)}
        renderItem={({ item }) => (
          <View style={styles.feedbackCard}>
            <Text style={styles.feedbackPlace}>📍 {item.place}</Text>
            <Text style={styles.feedbackText}>{item.feedback}</Text>
            <Text style={styles.feedbackRating}>⭐ {item.rating}/5</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 18, backgroundColor: "#ecfcca", flex: 1 },
  btn: {
    backgroundColor: "#5ea500",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginVertical: 3,
  },
  btnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    
  },
  input: {
    borderWidth: 3,
    padding: 10,
    marginBottom: 8,
    borderRadius: 6,
    borderColor: "#5ea500",
    backgroundColor: "#fff",
  },
  ratingContainer: { flexDirection: "row", marginBottom: 12 },
  star: { fontSize: 30, marginHorizontal: 4 , lineHeight: 40 },
  filledStar: { color: "#FFD700" },
  emptyStar: { color: "#bbb" },
  feedbackCard: {
    backgroundColor: "#fff",
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#5ea500",
  },
  feedbackPlace: { fontWeight: "bold", marginBottom: 4, color: "#333" },
  feedbackText: { marginBottom: 4, color: "#444" },
  feedbackRating: { fontSize: 12, color: "#666" },
});
