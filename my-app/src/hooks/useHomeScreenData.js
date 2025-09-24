import { useState, useEffect, useMemo, useCallback} from "react";
import { useFocusEffect } from '@react-navigation/native';
import { Alert } from "react-native";
import { fetchMainProfile } from "../services/API/userInforService";
import { fetchAllMeasurements } from "../services/API/measurementsService";
import { processMeasurements } from "../utils/measurementHomeProcessor";

export const useHomeScreenData = () => {
  const [date, setDate] = useState(new Date());
  const [weeksAgo, setWeeksAgo] = useState(1);
  const [mainProfileId, setMainProfileId] = useState(null);
  const [allMeasurements, setAllMeasurements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let isActive = true; // Cờ để kiểm tra component có còn active không

      const loadData = async () => {
        try {
          // Không cần setIsLoading(true) ở đây vì ta muốn màn hình cũ hiển thị
          // trong khi dữ liệu mới đang được tải ở nền.
          const profile = await fetchMainProfile();
          const measurements = await fetchAllMeasurements(); // Chỉ cập nhật state nếu màn hình vẫn đang active
          if (isActive) {
            if (profile) setMainProfileId(profile.id);
            console.log("Fetched measurements on focus:", measurements);
            setAllMeasurements(measurements);
            setIsLoading(false); // Dừng loading sau khi có dữ liệu mới
          }
        } catch (err) {
          if (isActive) {
            Alert.alert("Lỗi tải dữ liệu", err.message);
            setIsLoading(false);
          }
        }
      };

      loadData();

      return () => {
        isActive = false; // Cleanup: đánh dấu là không active nữa khi rời màn hình
      };
    }, []) // Dependency array rỗng để loadData không bị gọi lại vô tận
  );

  const processedData = useMemo(
    () => processMeasurements(allMeasurements, mainProfileId, date, weeksAgo),
    [allMeasurements, mainProfileId, date, weeksAgo]
  );

  const dateStr = useMemo(() => {
    const options = { day: "2-digit", month: "short", year: "2-digit" };
    return date.toLocaleDateString("en-GB", options).replace(/ /g, " ");
  }, [date]);

  return {
    date,
    setDate,
    weeksAgo,
    setWeeksAgo,
    dateStr,
    isLoading,
    ...processedData,
  };
};
