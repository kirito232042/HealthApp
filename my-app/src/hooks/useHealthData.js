import { useState, useEffect } from "react";
import { MEASUREMENT_CONFIG } from "../config/measurementConfig";
import { fetchAllMeasurements } from "../services/API/measurementsService";

// Hàm tính toán BMI
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

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const rawData = await fetchAllMeasurements();

        const bmiData = calculateBMI(rawData);
        setAllHealthData([...rawData, ...bmiData]);
      } catch (err) {
        console.error("Fetch error:", err);
        // Reset data on error
        setAllHealthData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  return { allHealthData, loading };
};