// frontend/services/database.ts
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "https://trip-secure-backend.vercel.app/api"; // backend URL

class DatabaseService {
  // User operations
  async createUser(user: any): Promise<string> {
    const res = await axios.post(`${API_BASE}/auth/register`, user);
    return res.data.userId;
  }

  async getUserById(id: string): Promise<any> {
    const res = await axios.get(`${API_BASE}/auth/${id}`);
    return res.data;
  }

  async updateUser(id: string, updates: any): Promise<void> {
    await axios.put(`${API_BASE}/auth/${id}`, updates);
  }

  // Tourist operations
  async registerTourist(data: any): Promise<any> {
    const res = await axios.post(`${API_BASE}/tourist`, data);
    return res.data;
  }

  async issueTourist(data: any): Promise<any> {
    const res = await axios.post(`${API_BASE}/tourist/issue`, data);
    return res.data;
  }

  // Trip operations
  async createTrip(trip: any): Promise<string> {
  const res = await axios.post(`${API_BASE}/trip`, trip, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } // if using JWT
  });
  return res.data.id;
}

async getTripsByUserId(userId: string): Promise<any[]> {
  const res = await axios.get(`${API_BASE}/trip/${userId}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
  });
  return res.data;
}

async updateTrip(id: string, updates: any): Promise<void> {
  await axios.put(`${API_BASE}/trip/${id}`, updates, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
  });
}

  // Alert operations
  async createPanicAlert(alert: any): Promise<any> {
    const res = await axios.post(`${API_BASE}/alert/panic`, alert);
    return res.data;
  }

  async createGeoFenceAlert(alert: any): Promise<any> {
    const res = await axios.post(`${API_BASE}/alert/geofence`, alert);
    return res.data;
  }

  async createRestrictedZoneAlert(alert: any): Promise<any> {
    const res = await axios.post(`${API_BASE}/alert/restricted`, alert);
    return res.data;
  }
}

export const databaseService = new DatabaseService();
