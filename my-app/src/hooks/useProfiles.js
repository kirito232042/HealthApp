import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { Alert } from "react-native";
import { fetchAllProfiles, setMainProfile } from "../services/API/userInforService";

export const useProfiles = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadProfiles = useCallback(async () => {
    const data = await fetchAllProfiles();
    console.log("Fetched profiles:", data);
    try {
      setLoading(true);
      const data = await fetchAllProfiles();
      console.log("Fetched profiles:", data);
      setProfiles(data);
    } catch (err) {
      Alert.alert("Lỗi", "Không thể tải danh sách hồ sơ.");
      setProfiles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
        console.log(1);
      loadProfiles();
    }, [loadProfiles])
  );

  const handleSetMain = async (profileId) => {
    try {
      await setMainProfile(profileId);
      await loadProfiles();
    } catch (err) {
      Alert.alert("Lỗi", err.message);
    }
  };

  return {
    profiles,
    loading,
    handleSetMain,
  };
};