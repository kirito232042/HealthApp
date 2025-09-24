import API_URL from "../../config/apiConfig";
import { getTokenAndUserId } from "./authService";

export const fetchMainProfile = async () => {
  const { userId } = await getTokenAndUserId();
  const res = await fetch(`${API_URL}/userinfor/${userId}`);
  if (!res.ok) throw new Error('Failed to fetch profiles');
  const profiles = await res.json();
  if (Array.isArray(profiles.data)) {
    const mainProfile = profiles.data.find(p => p.profile === true);
    return mainProfile || null;
  }
  return null;
};

export const createProfile = async (userId, profileData) => {
  const { firstName, lastName, profile } = profileData;
  const res = await fetch(`${API_URL}/userinfor/${userId}/new`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ firstName, lastName, profile }),
  });
  
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error?.message || "Tạo profile thất bại");
  }

  return data.data; 
};

export const fetchAllProfiles = async () => {
  const { userId } = await getTokenAndUserId();
  const res = await fetch(`${API_URL}/userinfor/${userId}`);
  if (!res.ok){
    console.log("Failed to fetch profiles, status:", res.status);
    throw new Error("Failed to fetch profiles");
  } 
  const data = await res.json();
  console.log("Response data:", data);
  return Array.isArray(data.data) ? data.data : [];
};

export const setMainProfile = async (profileId) => {
  const { userId } = await getTokenAndUserId();
  const res = await fetch(`${API_URL}/userinfor/${userId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ profileId }),
  });
  const data = await res.json();
  if (!res.ok) {
    console.log("Failed to set main profile, response:", data);
    throw new Error(data.error?.message || "Could not update main profile");
  }
  return data;
};

export const updateProfileDetails = async (updatePayload) => {
  const { userId } = await getTokenAndUserId();
  const res = await fetch(`${API_URL}/userinfor/${userId}`, {
    method: "POST", 
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatePayload),
  });
  
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error?.message || "Could not update profile details");
  }
  return data.data;
};