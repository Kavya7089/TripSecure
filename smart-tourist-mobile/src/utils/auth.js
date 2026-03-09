// src/utils/auth.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loginUser, registerUser } from "../services/api";

export async function saveToken(token) {
  await AsyncStorage.setItem("token", token);
}

export async function removeToken() {
  await AsyncStorage.removeItem("token");
}

export async function getToken() {
  return AsyncStorage.getItem("token");
}

export async function login(email, password) {
  const res = await loginUser({ email, password });
  if (res?.data?.token) {
    await saveToken(res.data.token);
  }
  return res.data;
}

export async function register(payload) {
  return registerUser(payload);
}
