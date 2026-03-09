// src/screens/Auth/RegisterScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { register } from "../../utils/auth";
import { registerDigitalID } from "../../services/blockchainService";

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [kycId, setKycId] = useState(""); // Aadhaar/Passport
  const [walletAddress, setWalletAddress] = useState(""); // optional

  async function handleRegister() {
    try {
      // Step 1: Register on backend (MongoDB)
      const user = await register({ name, email, phone, password });
      
      // Step 2: Call Blockchain Digital ID Registration
      await registerDigitalID(user._id, walletAddress || "temp-wallet", {
        kycId,
        name,
        email,
        phone,
      });

      Alert.alert("✅ Registered", "Digital ID Created. Please login.");
      navigation.replace("Home");
    } catch (err) {
      console.error("Register error:", err);
      Alert.alert("Register failed", err.response?.data?.message || err.message);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <TextInput
        placeholder="Name"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />
      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Phone"
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        placeholder="Aadhaar / Passport No."
        style={styles.input}
        value={kycId}
        onChangeText={setKycId}
      />
      <TextInput
        placeholder="Wallet Address (optional)"
        style={styles.input}
        value={walletAddress}
        onChangeText={setWalletAddress}
      />

      <TouchableOpacity style={styles.btn} onPress={handleRegister}>
        <Text style={styles.btnText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center", backgroundColor: "#ecfcca" },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 20, textAlign: "center", color: "#3c6300" },
  input: { borderWidth: 3, borderColor: "#5ea500", padding: 11, marginBottom: 12, borderRadius: 6, backgroundColor: "#fff" },
  btn: { backgroundColor: "#5ea500", borderRadius: 8, paddingVertical: 14, alignItems: "center", marginVertical: 3 },
  btnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
