// src/screens/HomeScreen.js
import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
} from "react-native";
import MapView, { UrlTile, Marker } from "react-native-maps";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import { Audio } from "expo-av";
import * as Speech from "expo-speech";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { registerForPushNotificationsAsync } from "../services/pushService";
import { BACKEND_URL } from "../config";

const GEOFENCE_TASK = "geofenceTask";

// Geofence task
TaskManager.defineTask(GEOFENCE_TASK, ({ data: { eventType, region }, error }) => {
  if (error) {
    console.error("Geofence error:", error);
    return;
  }
  if (eventType === Location.GeofencingEventType.Enter) {
    Alert.alert("Geofence", `Entered ${region.identifier || "a region"}`);
  } else if (eventType === Location.GeofencingEventType.Exit) {
    Alert.alert("Geofence", `Exited ${region.identifier || "a region"}`);
  }
});

export default function HomeScreen({ navigation }) {
  const [region, setRegion] = useState(null);
  const [mode, setMode] = useState("streets");
  const [searchQuery, setSearchQuery] = useState("");
  const [alwaysOn, setAlwaysOn] = useState(false);
  const mapRef = useRef(null);
  const recordingRef = useRef(null);

  // Location + notifications
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

  const toggleMapMode = () => setMode(prev => (prev === "streets" ? "satellite" : "streets"));

  const startExampleGeofence = async () => {
    if (!region) return;
    const { status: bgStatus } = await Location.getBackgroundPermissionsAsync();
    if (bgStatus !== "granted") {
      Alert.alert("Permission needed", "Background location is required.");
      return;
    }
    const regions = [{
      identifier: "demo1",
      latitude: region.latitude,
      longitude: region.longitude,
      radius: 200,
      notifyOnEnter: true,
      notifyOnExit: true,
    }];
    try {
      await Location.startGeofencingAsync(GEOFENCE_TASK, regions);
      Alert.alert("Geofence", "Started around your position.");
    } catch (e) {
      Alert.alert("Error", e.message);
    }
  };

  const sendQuickAlert = async (location) => {
    try {
      const token = await AsyncStorage.getItem("token");
      await axios.post(
        `${BACKEND_URL}/api/alert`,
        { location, description: "Quick panic alert" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Alert.alert("🚨 Panic alert sent!");
    } catch (err) {
      Alert.alert("Error", err.response?.data?.message || err.message);
    }
  };

  const searchPlace = async () => {
    if (!searchQuery.trim()) return;
    try {
      const res = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery}`,
        { headers: { "User-Agent": "TripSecureApp/1.0" } }
      );
      if (res.data.length > 0) {
        const place = res.data[0];
        const newRegion = {
          latitude: parseFloat(place.lat),
          longitude: parseFloat(place.lon),
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };
        setRegion(newRegion);
        mapRef.current.animateToRegion(newRegion, 1000);
      } else Alert.alert("Not found", "No results for your search.");
    } catch (err) {
      Alert.alert("Error", "Failed to search place.");
    }
  };

  // Always-On voice assistant
  


  return (
    <View style={styles.container}>
      {region ? (
        <MapView
          ref={mapRef}
          style={styles.map}
          region={region}
          showsUserLocation
          followsUserLocation
        >
          <UrlTile
            urlTemplate={mode === "streets"
              ? "https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=0NSdfJyi0x2Rp7mWVs3R"
              : "https://api.maptiler.com/maps/satellite/{z}/{x}/{y}.jpg?key=0NSdfJyi0x2Rp7mWVs3R"}
            maximumZ={20}
          />
          <Marker coordinate={{ latitude: region.latitude, longitude: region.longitude }} title="You" />
        </MapView>
      ) : (
        <Text style={{ textAlign: "center", marginTop: 20 }}>Loading map...</Text>
      )}

      {/* Search */}
      <View style={styles.searchBar}>
        <TextInput
          style={styles.input}
          placeholder="Search a place..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={searchPlace}
        />
        <TouchableOpacity style={styles.searchBtn} onPress={searchPlace}>
          <Text style={{ color: "#fff" }}>Go</Text>
        </TouchableOpacity>
      </View>

      {/* Always-On Toggle */}

      {/* Action Buttons */}
      <TouchableOpacity
        style={styles.alwaysOnBtn}
        onPress={startExampleGeofence}
      >
        <Text style={{ color: "#fff", fontWeight: "bold" }}>geofencing</Text>
      </TouchableOpacity>
      <View style={styles.actionsContainer}>
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate("Panic")}>
            <Text style={styles.btnText}>Panic</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate("TripPlanner")}>
            <Text style={styles.btnText}>Plan Trip</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate("Contacts")}>
            <Text style={styles.btnText}>Contacts</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate("Expenses")}>
            <Text style={styles.btnText}>Expenses</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate("Feedback")}>
            <Text style={styles.btnText}>Feedback</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate("Chatbot")}>
            <Text style={styles.btnText}>ChatBot</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Map Mode */}
      <TouchableOpacity style={styles.modeBtn} onPress={toggleMapMode}>
        <Text style={styles.modeBtnText}>{mode === "streets" ? "🌍 Streets" : "🛰 Satellite"}</Text>
      </TouchableOpacity>

      {/* SOS Button */}
      <TouchableOpacity style={styles.fab} onPress={() => sendQuickAlert(region)}>
        <Text style={styles.fabText}>🚨</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  alwaysOnBtn: {
    position: "absolute",
    top: 150,
    right: 20,
    backgroundColor: "#000",
    padding: 10,
    borderRadius: 8,
    zIndex: 10,
  },
  searchBar: {
    position: "absolute",
    top: 50,
    left: 15,
    right: 15,
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 5,
    elevation: 3,
  },
  input: { flex: 1, padding: 8 },
  searchBtn: { backgroundColor: "#5ea500", padding: 10, borderRadius: 6, justifyContent: "center", alignItems: "center" },
  actionsContainer: { position: "absolute", bottom: 100,
    left: 20,
    right: 20,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  btn: {
    backgroundColor: "#5ea500",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 8,
    minWidth: 90,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "700" },

  modeBtn: {
    position: "absolute",
    top: 110,
    right: 20,
    backgroundColor: "#000",
    padding: 10,
    borderRadius: 8,
  },
  modeBtnText: { color: "#fff", fontWeight: "bold" },

  fab: {
    position: "absolute",
    bottom: 25,
    right: 25,
    backgroundColor: "#f44336",
    width: 65,
    height: 65,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
  fabText: { fontSize: 28, color: "#fff" },
});

