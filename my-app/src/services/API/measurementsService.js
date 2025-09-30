import API_URL from "../../config/apiConfig";
import { getTokenAndUserId } from "./authService";
import { fetchMainProfile } from "./userInforService";

export const fetchAllMeasurements = async () => {
  const { userId } = await getTokenAndUserId();
  const res = await fetch(`${API_URL}/measurements/all?userId=${userId}`);
  if (!res.ok) throw new Error('Failed to fetch measurements');
  const data = await res.json();
  if (!Array.isArray(data.data)) throw new Error("Invalid measurement data from server");
  return data.data;
};

export const deleteMeasurementById = async (measurementId) => {
  const res = await fetch(`${API_URL}/measurements/${measurementId}`, { 
    method: "DELETE" 
  });
  if (!res.ok) {
    throw new Error(`Failed to delete measurement ${measurementId}`);
  }
  return await res.json();
};

export const createMeasurement = async (measurementData) => {
  const { userId } = await getTokenAndUserId();

  const mainProfile = await fetchMainProfile();

  if (!mainProfile) throw new Error("Main profile not found");
  
  console.log("Creating measurement with data:", measurementData, "for userId:", userId, "and profileId:", mainProfile.id);

  const body = {
    ...measurementData,
    userId,
    profileId: mainProfile.id,
  };

  const res = await fetch(`${API_URL}/measurements`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Failed to create measurement");
  return data.data;
};

export const saveManualMeasurements = async (measurementsData, config) => {
    // 1. Lấy userId từ token
    const { userId } = await getTokenAndUserId();
    if (!userId) {
        throw new Error("User not authenticated");
    }

    // 2. Lấy profileId
    const mainProfile = await fetchMainProfile();
    if (!mainProfile) {
        throw new Error("Main profile not found");
    }

    // 3. Chuẩn bị dữ liệu để gửi đi
    const measurementsToCreate = config
        .map(field => ({
            type: field.type || field.key, // Dùng `type` nếu có, không thì dùng `key`
            value: measurementsData[field.key],
            unit: field.unit,
        }))
        .filter(m => m.value !== undefined && m.value !== null && m.value !== "");
    
    console.log("Prepared measurements to create:", measurementsToCreate);

    if (measurementsToCreate.length === 0) {
        throw new Error("Không có dữ liệu nào để lưu!");
    }

    await Promise.all(
        measurementsToCreate.map(m =>
            createMeasurement({
                ...m,
                userId,
                profileId: mainProfile.id,
                // Thêm trường thời gian tại đây nếu cần
            })
        )
    );
};