import { useState, useCallback } from "react";
import { useFocusEffect } from '@react-navigation/native'; // 1. Import hook cần thiết
import { Alert } from 'react-native';
import { fetchAllMeasurements } from "../services/API/measurementsService";

// Hàm tính toán BMI (giữ nguyên)
const calculateBMI = (rawData) => {
  const weightArr = rawData.filter((m) => m.type === "weight");
  const heightArr = rawData.filter((m) => m.type === "height");
  const bmiArr = [];

  weightArr.forEach((w) => {
    const wDate = w.createdAt.slice(0, 10);
    const h = heightArr.find((h) => h.createdAt.slice(0, 10) === wDate);
    if (h) {
      const heightM = parseFloat(h.value) / 100;
      const bmi = parseFloat(w.value) / (heightM * heightM);
      bmiArr.push({
        createdAt: w.createdAt,
        value: bmi.toFixed(1),
        type: "bmi",
      });
    }
  });
  return bmiArr;
};

export const useHealthData = () => {
  const [allHealthData, setAllHealthData] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ SỬA LỖI: Dùng useFocusEffect để tải lại dữ liệu mỗi khi màn hình được focus
  useFocusEffect(
    useCallback(() => {
      let isActive = true; // Cờ để tránh cập nhật state trên component đã unmount

      const fetchAllData = async () => {
        try {
          // Chỉ set loading cho lần tải đầu tiên
          if (allHealthData.length === 0) {
            setLoading(true);
          }
          
          const rawData = await fetchAllMeasurements();

          if (isActive) {
            const bmiData = calculateBMI(rawData);
            setAllHealthData([...rawData, ...bmiData]);
          }
        } catch (err) {
          if (isActive) {
            console.error("Fetch error:", err);
            Alert.alert("Lỗi", "Không thể tải dữ liệu mới nhất.");
          }
        } finally {
          if (isActive) {
            setLoading(false);
          }
        }
      };

      fetchAllData();

      return () => {
        isActive = false; // Cleanup function khi rời màn hình
      };
    }, [])
  );

  return { allHealthData, loading };
};