// src/screens/Auth/LoginScreen.js
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity,Button, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loginUser } from "../../services/api"; // use your real API

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
  try {
    const res = await loginUser({ email, password });

    if (res.data && res.data.token) {
      // Save token for future requests
      await AsyncStorage.setItem("token", res.data.token);

      // Save full user object
      await AsyncStorage.setItem("user", JSON.stringify(res.data.user));

      // ✅ Save userId (MongoDB _id) separately
      if (res.data.user && res.data.user.id) {
        await AsyncStorage.setItem("userId", res.data.user.id.toString());
      }

      console.log("Logged in as:", res.data.user.id);

      // Navigate to home/dashboard
      navigation.replace("Home");
    } else {
      Alert.alert("Login failed", "No token received");
    }
  } catch (err) {
    Alert.alert(
      "Login failed",
      err.response?.data?.message || err.message
    );
  }
}


  return (
    <View style={styles.container}>
      <Text style={styles.titlemain}> TripSecure</Text>
      <Text style={styles.title}>Smart Tourist Guardian</Text>

      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />
      
      <TouchableOpacity style={styles.btn} onPress={handleLogin}>
        <Text style={styles.btnText}>Login</Text>
      </TouchableOpacity>

      <View style={{ height: 10 }} />

      <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate("Register")}>
        <Text style={styles.btnText}>Register</Text>
      </TouchableOpacity> 
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" , backgroundColor: "#ecfcca"},
  title: {
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#DC143C",
    textDecorationStyle: "underline",
    textDecorationLine: "underline",
    textDecorationColor: "#DC143C"
  },
  titlemain: {
    fontSize: 36,
    fontWeight: "bold",
    textAlign: "center",
    color: "#35530e"
  },
  input: {
    borderWidth: 3,
    borderColor: "#ccc",
    padding: 12,
    marginBottom: 10,
    borderRadius: 6,
    height: 50,
    borderColor: "#5ea500",
    backgroundColor: "#fff",
  },
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
});
