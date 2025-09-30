import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { fetchMainProfile } from '../services/API/userInforService';
import { fetchAllMeasurements, deleteMeasurementById } from '../services/API/measurementsService';
import { groupAndSortMeasurements } from '../utils/historyProcessor';

export const useHistoryScreen = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);
  
  // State mới để kích hoạt việc tải lại dữ liệu thủ công
  const [refreshKey, setRefreshKey] = useState(0);
  const refreshData = () => setRefreshKey(prev => prev + 1);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const loadData = async () => {
        if (!isActive) return;

        setLoading(true);
        setSelectedItems([]); // Reset lựa chọn mỗi khi vào màn hình
        
        try {
          // Luôn fetch profile chính MỚI NHẤT
          const profile = await fetchMainProfile();
          if (profile && isActive) {
            const rawMeasurements = await fetchAllMeasurements();
            const processedData = groupAndSortMeasurements(rawMeasurements, profile.id);
            if (isActive) {
              console.log("Loaded data for profile ID:", profile.id);
              setData(processedData);
            }
          } else if (isActive) {
            setData([]);
          }
        } catch (err) {
          if (isActive) {
            Alert.alert("Lỗi tải dữ liệu", err.message);
            setData([]);
          }
        } finally {
          if (isActive) {
            setLoading(false);
          }
        }
      };

      loadData();

      return () => {
        isActive = false;
      };
      // `useFocusEffect` sẽ chạy lại mỗi khi `refreshKey` thay đổi
    }, [refreshKey]) 
  );

  const toggleSelectItem = (id) => {
    setSelectedItems(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === data.length && data.length > 0) {
      setSelectedItems([]);
    } else {
      setSelectedItems(data.map(item => item.id));
    }
  };

  const deleteSelected = () => { // Bỏ async vì Alert đã xử lý bất đồng bộ
    const measurementIdsToDelete = [];
    data.forEach(item => {
      if (selectedItems.includes(item.id)) {
        measurementIdsToDelete.push(...Object.values(item.ids));
      }
    });

    if (measurementIdsToDelete.length === 0) return;

    Alert.alert(
      "Xác nhận xóa",
      `Bạn có chắc chắn muốn xóa ${selectedItems.length} mục đã chọn không?`,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            try {
              await Promise.all(measurementIdsToDelete.map(id => deleteMeasurementById(id)));
              // Kích hoạt việc tải lại dữ liệu
              refreshData(); 
            } catch (err) {
              Alert.alert("Lỗi khi xóa", err.message);
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  return {
    data, loading, activeTab, setActiveTab, selectedItems,
    toggleSelectItem, toggleSelectAll, deleteSelected,
  };
};