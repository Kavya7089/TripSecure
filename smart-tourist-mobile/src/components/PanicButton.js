// src/components/PanicButton.js
import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

export default function PanicButton({ onPress,navigation }) {
  return (
    <TouchableOpacity style={styles.btn} onPress={onPress}>
      <Text style={styles.text}>Panic</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: { backgroundColor: "#c22", padding: 12, borderRadius: 10, alignItems: "center" },
  text: { color: "#fff", fontWeight: "700" },
});
