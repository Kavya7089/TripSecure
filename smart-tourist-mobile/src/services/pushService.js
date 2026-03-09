// src/services/pushService.js
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./api";

export async function registerForPushNotificationsAsync(userId) {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== "granted") {
    console.log("Failed to get push token for push notifications!");
    return null;
  }

  const tokenData = await Notifications.getExpoPushTokenAsync();
  const pushToken = tokenData.data;
  await AsyncStorage.setItem("pushToken", pushToken);
  // send to backend
  try {
    await api.post("/users/push-token", { userId, pushToken });
  } catch (e) {
    console.warn("Failed to register push token with backend", e.message);
  }
  return pushToken;
}
