import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import API_URL from "../../config/apiConfig";

export const getTokenAndUserId = async () => {
  const token = await AsyncStorage.getItem("token");
  console.log("Retrieved token:", token);
  if (!token) throw new Error("User not logged in");
  const decoded = jwtDecode(token);
  console.log("Decoded token:", decoded);
  return { token, userId: decoded.id };
};

export const login = async (email, password) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    console.log("Login error response:", data);
    throw new Error(data.error?.message || "Đăng nhập thất bại");
  }

  // Lưu token
  await AsyncStorage.setItem("token", data.data.token);

  // Trả về dữ liệu nếu thành công
  return data.data;
};

export const register = async (email, password) => {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    console.log("Registration error response:", data);
    throw new Error(data.error?.message || "Đăng ký thất bại");
  }
  
  return data.data; 
};