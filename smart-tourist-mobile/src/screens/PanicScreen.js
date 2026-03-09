// src/screens/PanicScreen.js
import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Button,
  ActivityIndicator,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { BACKEND_URL } from "../config";

export default function PanicScreen({ navigation }) {
  const [region, setRegion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [picked, setPicked] = useState(null);


  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission denied", "Location permission is required.");
        return;
      }

      const { status: bgStatus } = await Location.requestBackgroundPermissionsAsync();
      if (bgStatus !== "granted") {
        Alert.alert("Background Location", "Enable background location in settings.");
      }

      const coords = await Location.getCurrentPositionAsync({});
      setRegion({
        latitude: coords.coords.latitude,
        longitude: coords.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });

      const userId = await AsyncStorage.getItem("userId");
      registerForPushNotificationsAsync(userId);

      Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, distanceInterval: 5 },
        (pos) => {
          setRegion((prev) => ({
            ...prev,
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          }));
        }
      );
    })();
  }, []);

  // Pick evidence photo
  async function pickImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission denied", "Allow access to your gallery to attach photo.");
      return;
    }

    const res = await ImagePicker.launchImageLibraryAsync({
      quality: 0.6,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (!res.canceled) {
      setPicked(res.assets[0]);
    }
  }

  // Send Quick Panic Alert (location only)
  async function sendQuickAlert(location) {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("No token found, please login again");

      await axios.post(
        `${BACKEND_URL}/api/alert`,
        {
          location,
          description: "Quick panic alert",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Alert.alert("🚨 Panic alert sent!");
    } catch (err) {
      console.error("Error sending panic alert:", err);
      Alert.alert("Error", err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }

  // Send Full SOS (location + optional photo)
  async function sendSOS() {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("No token found, please login again");

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });

      const fd = new FormData();
      fd.append(
        "location",
        JSON.stringify({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          accuracy: loc.coords.accuracy,
        })
      );
      fd.append("description", "SOS triggered from mobile app");

      if (picked) {
        const uriParts = picked.uri.split(".");
        const fileType = uriParts[uriParts.length - 1];
        fd.append("evidence", {
          uri: picked.uri,
          name: `evidence.${fileType}`,
          type: `image/${fileType}`,
        });
      }

      const res = await axios.post(
        `${BACKEND_URL}/api/alert`,
        fd,
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } }
      );

      Alert.alert("SOS sent", `Incident ID: ${res.data.alert._id}`);
      navigation.goBack();
    } catch (err) {
      console.error("Error sending SOS:", err);
      Alert.alert("Failed to send SOS", err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Panic / SOS</Text>

      <Button title="Attach Photo (optional)" onPress={pickImage} />

      <TouchableOpacity
        style={styles.alertBtn}
        onPress={() => sendQuickAlert(region)} // demo location
      >
        <Text style={{ color: "#fff", fontWeight: "bold" }}>Send Quick Alert</Text>
      </TouchableOpacity>

      <View style={{ height: 12 }} />

      {loading ? (
        <ActivityIndicator size="large" color="#d9534f" />
      ) : (
        <Button title="Send Full SOS" color="#d9534f" onPress={sendSOS} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#ecfcca",
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "700",
  },
  alertBtn: {
    marginTop: 12,
    padding: 14,
    borderRadius: 8,
    backgroundColor: "#f44336",
    alignItems: "center",
  },
});
