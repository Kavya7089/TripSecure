// src/services/api.js
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FULL_URL } from "../config";

const api = axios.create({
  baseURL: FULL_URL,
  timeout: 15000,
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}, (err) => Promise.reject(err));

/* Auth */
export async function registerUser(payload) {
  return api.post("/auth/register", payload);
}
// src/services/api.js (loginUser wrapper)
export async function loginUser(payload) {
  const response = await api.post("/auth/login", payload);

  if (response.data?.user?.id) {
    await AsyncStorage.setItem("userId", response.data.user.id);
  }

  return response;
}


/* Tourist registration (KYC) */
export async function registerTourist(payload) {
  // payload: { userId, walletAddress, kyc } (backend handles encryption/IPFS)
  return api.post("/tourists", payload);
}

/* Trips */
export async function createTrip(payload) {
  return api.post("/trips", payload);
}
export async function getTrips() {
  return api.get("/trips");
}
export async function updateTrip(tripId, payload) {
  return api.put(`/trips/${tripId}`, payload);
}

/* AI Analysis */
export async function analyzeTrip(payload) {
  // payload: { destination, days, budget, riskFactors, etc. }
  return api.post("/trips/analyze", payload);
}

/* Panic / Alerts - upload formdata */
export async function sendPanic(formData) {
  // formData: FormData with file (evidence), touristId, description, location JSON
  return api.post("/alerts/panic", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

/* Feedback */
export async function addFeedback(payload) {
  return api.post("/feedback", payload);
}
export async function getFeedback() {
  return api.get("/feedback");
}

/* Dashboard or other endpoints can be added similarly */

export default api;


// src/services/api.js
// import axios from "axios";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { FULL_URL, USE_MOCK } from "../config"; // 👈 add USE_MOCK flag

// /* -------------------
//    REAL API INSTANCE
// ------------------- */
// const api = axios.create({
//   baseURL: FULL_URL,
//   timeout: 15000,
// });

// api.interceptors.request.use(
//   async (config) => {
//     const token = await AsyncStorage.getItem("token");
//     if (token) config.headers.Authorization = `Bearer ${token}`;
//     return config;
//   },
//   (err) => Promise.reject(err)
// );

// /* -------------------
//    MOCK IMPLEMENTATION
// ------------------- */
// const mockDelay = (result, ms = 500) =>
//   new Promise((resolve) => setTimeout(() => resolve(result), ms));

// const MockAPI = {
//   registerUser: async (payload) =>
//     mockDelay({ data: { success: true, userId: "mock-user-123" } }),

//   tloginUser: async (payload) =>
//     mockDelay({ data: { success: true, token: "mock-token-xyz" } }),

//   registerTourist: async (payload) =>
//     mockDelay({ data: { success: true, touristId: "mock-tourist-001" } }),

//   createTrip: async (payload) =>
//     mockDelay({ data: { success: true, tripId: "mock-trip-001", ...payload } }),

//   getTrips: async () =>
//     mockDelay({
//       data: [
//         { id: "trip1", name: "Mock Trip to Delhi", status: "active" },
//         { id: "trip2", name: "Mock Trip to Jaipur", status: "completed" },
//       ],
//     }),

//   updateTrip: async (id, payload) =>
//     mockDelay({ data: { success: true, id, ...payload } }),

//   sendPanic: async (formData) =>
//     mockDelay({ data: { success: true, alertId: "mock-alert-001" } }),

//   addFeedback: async (payload) =>
//     mockDelay({ data: { success: true, feedbackId: "mock-fb-001" } }),

//   getFeedback: async () =>
//     mockDelay({
//       data: [
//         { id: "fb1", message: "Great service (mock)" },
//         { id: "fb2", message: "Need more safety measures (mock)" },
//       ],
//     }),
// };

// /* -------------------
//    EXPORTS
// ------------------- */
// // If USE_MOCK = true → export MockAPI
// // If USE_MOCK = false → export real API wrappers
// export const registerUser = USE_MOCK
//   ? MockAPI.registerUser
//   : (payload) => api.post("/auth/register", payload);

// export const loginUser = USE_MOCK
//   ? MockAPI.loginUser
//   : (payload) => api.post("/auth/login", payload);

// export const registerTourist = USE_MOCK
//   ? MockAPI.registerTourist
//   : (payload) => api.post("/tourists", payload);

// export const createTrip = USE_MOCK
//   ? MockAPI.createTrip
//   : (payload) => api.post("/trips", payload);

// export const getTrips = USE_MOCK
//   ? MockAPI.getTrips
//   : () => api.get("/trips");

// export const updateTrip = USE_MOCK
//   ? MockAPI.updateTrip
//   : (id, payload) => api.put(`/trips/${id}`, payload);

// export const sendPanic = USE_MOCK
//   ? MockAPI.sendPanic
//   : (formData) =>
//       api.post("/alerts/panic", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

// export const addFeedback = USE_MOCK
//   ? MockAPI.addFeedback
//   : (payload) => api.post("/feedback", payload);

// export const getFeedback = USE_MOCK
//   ? MockAPI.getFeedback
//   : () => api.get("/feedback");

// export default api;
