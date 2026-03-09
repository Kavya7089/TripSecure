// src/services/locationService.js
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import * as Permissions from "expo-permissions";
import { Platform } from "react-native";
import { sendPanic } from "./api";

export async function requestLocationPermissions() {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") throw new Error("Foreground location permission denied");

  if (Platform.OS === "android") {
    const { status: bgStatus } = await Location.requestBackgroundPermissionsAsync();
    if (bgStatus !== "granted") console.warn("Background location permission not granted");
  }
  return true;
}

export async function getCurrentLocation() {
  await requestLocationPermissions();
  const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest });
  return loc.coords; // { latitude, longitude, altitude, accuracy }
}

/* Geofencing */
const GEOFENCE_TASK = "GEOFENCE_TASK";

TaskManager.defineTask(GEOFENCE_TASK, ({ data, error }) => {
  if (error) {
    console.log("GEOFENCE_TASK error:", error);
    return;
  }
  const { eventType, region } = data;
  if (eventType === Location.GeofencingEventType.Enter) {
    console.log("Entered region:", region);
    // You may call your backend from here using fetch/axios (note: tasks are run in a headless environment on Android)
  } else if (eventType === Location.GeofencingEventType.Exit) {
    console.log("Exited region:", region);
  }
});

export async function startGeofencing(regions = []) {
  // regions: [{ id, latitude, longitude, radius }]
  await requestLocationPermissions();
  if (!regions || regions.length === 0) throw new Error("No geofence regions provided");
  await Location.startGeofencingAsync(GEOFENCE_TASK, regions);
}

export async function stopGeofencing() {
  await Location.stopGeofencingAsync(GEOFENCE_TASK);
}

/* Send periodic location to backend (optional pattern) */
export async function pushLocationToBackend(touristId) {
  const coords = await getCurrentLocation();
  // send a simple alert or location update
  const fd = new FormData();
  fd.append("touristId", touristId);
  fd.append("location", JSON.stringify(coords));
  // this endpoint exists in backend? If you created one, call it here; else use sendPanic for example:
  // await api.post('/location/update', { touristId, location: coords })
}
