import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { fetchMainProfile } from '../services/API/userInforService';
import { fetchAllMeasurements, deleteMeasurementById } from '../services/API/measurementsService';
import { groupAndSortMeasurements } from '../utils/historyProcessor';

export const useHistoryScreen = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);
  const [mainProfileId, setMainProfileId] = useState(null);

  const loadInitialData = useCallback(async () => {
    try {
      setLoading(true);
      const profile = await fetchMainProfile();
      if (profile) {
        setMainProfileId(profile.id);
        const rawMeasurements = await fetchAllMeasurements();
        const processedData = groupAndSortMeasurements(rawMeasurements, profile.id);
        setData(processedData);
      }
    } catch (err) {
      Alert.alert("Lỗi tải dữ liệu", err.message);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const toggleSelectItem = (id) => {
    setSelectedItems(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === data.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(data.map(item => item.id));
    }
  };

  const deleteSelected = async () => {
    const measurementIdsToDelete = [];
    data.forEach(item => {
      if (selectedItems.includes(item.id)) {
        // Lấy tất cả ID thực tế từ các nhóm đã chọn
        measurementIdsToDelete.push(...Object.values(item.ids));
      }
    });

    if (measurementIdsToDelete.length === 0) return;

    setLoading(true);
    try {
      await Promise.all(measurementIdsToDelete.map(id => deleteMeasurementById(id)));
      setSelectedItems([]);
      await loadInitialData();
    } catch (err) {
      Alert.alert("Lỗi khi xóa", err.message);
      setLoading(false);
    }
  };

  return {
    data, loading, activeTab, setActiveTab, selectedItems,
    toggleSelectItem, toggleSelectAll, deleteSelected,
  };
};