import React, { useState, useMemo } from "react";
import { View, StyleSheet, FlatList, Text, Modal, TouchableOpacity, Dimensions, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePickerModal from "react-native-modal-datetime-picker";

import BottomNav from "../components/BottomNav";
import ChartCard from "../components/stats/ChartCard";
import MeasureTab from "../components/stats/MeasureTab";
import TabSelector from "../components/stats/TabSelector";
import { useHealthData } from "../hooks/useHealthData";
import { MEASUREMENT_CONFIG } from "../config/measurementConfig";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function StatScreen({ navigation }) {
    const [activeTab, setActiveTab] = useState("chart");
    
    const [customDateRange, setCustomDateRange] = useState({ startDate: null, endDate: null });
    
    // State để quản lý modal nào đang hiển thị ('start', 'end', hoặc null)
    const [pickerMode, setPickerMode] = useState(null); 
    
    // 1. Hook được gọi không có tham số, chỉ fetch 1 lần
    const { allHealthData, loading } = useHealthData();

    // 2. useMemo thực hiện việc LỌC và PHÂN LOẠI dữ liệu
    const categorizedData = useMemo(() => {
        if (!allHealthData || allHealthData.length === 0) return {};
        const result = {};
        MEASUREMENT_CONFIG.forEach((config) => {
            result[config.key] = allHealthData.filter((m) => m.type === config.key);
        });
        return result;
    }, [allHealthData]);

    // Hàm xử lý khi người dùng xác nhận một ngày
    const handleDateConfirm = (selectedDate) => {
        if (pickerMode === 'start') {
            setCustomDateRange({ startDate: selectedDate, endDate: null });
            setPickerMode('end');
        } else if (pickerMode === 'end') {
            if (selectedDate < customDateRange.startDate) {
                Alert.alert("Lỗi", "Ngày kết thúc không được nhỏ hơn ngày bắt đầu.");
                return;
            }
            // Cập nhật state chung, các Card sẽ tự nhận biết qua useEffect
            setCustomDateRange(prevRange => ({ ...prevRange, endDate: selectedDate }));
            setPickerMode(null);
        }
    };

    const handleDateCancel = () => {
      setPickerMode(null);
    };

    // Hàm render item cho FlatList
     const renderChartItem = ({ item }) => (
        <ChartCard
            title={item.title}
            unit={item.unit}
            color={item.color}
            // Truyền toàn bộ dữ liệu đã phân loại, Card sẽ tự lọc
            initialData={categorizedData[item.key] || []}
            styles={styles}
            // Chỉ truyền 2 props này cho chức năng tùy chỉnh
            onCustomRangePress={() => setPickerMode('start')}
            customDateRange={customDateRange}
        />
    );

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.container}>
                <TabSelector activeTab={activeTab} setActiveTab={setActiveTab} styles={styles} />
                {activeTab === "chart" ? (
                    loading ? (
                        <Text style={{ textAlign: 'center', marginTop: 20 }}>Đang tải dữ liệu...</Text>
                    ) : (
                        <FlatList
                            data={MEASUREMENT_CONFIG}
                            renderItem={renderChartItem}
                            keyExtractor={(item) => item.key}
                            initialNumToRender={3}
                        />
                    )
                ) : (
                    <MeasureTab navigation={navigation} styles={styles} />
                )}
            </View>

            <DateTimePickerModal
                isVisible={pickerMode !== null}
                mode="date"
                date={new Date()}
                onConfirm={handleDateConfirm}
                onCancel={handleDateCancel}
                headerTextIOS={pickerMode === 'start' ? "Chọn ngày bắt đầu" : "Chọn ngày kết thúc"}
                confirmTextIOS="Xác nhận"
                cancelTextIOS="Hủy"
                maximumDate={new Date()}
            />
        </SafeAreaView>
    );
}

// Giữ nguyên toàn bộ styles
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F5F9FF" },
  container: { flex: 1, paddingTop: SCREEN_HEIGHT * 0.025 },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#D9EFFF",
    borderRadius: SCREEN_WIDTH * 0.025,
    marginHorizontal: SCREEN_WIDTH * 0.15,
    padding: SCREEN_WIDTH * 0.01,
  },
  tab: {
    flex: 1,
    paddingVertical: SCREEN_HEIGHT * 0.012,
    alignItems: "center",
    borderRadius: SCREEN_WIDTH * 0.02,
  },
  activeTab: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  tabText: { fontSize: SCREEN_WIDTH * 0.037, fontWeight: "500", color: "#666" },
  activeTabText: { color: "#00BFFF", fontWeight: "600" },
  chartCard: {
    backgroundColor: "#fff",
    marginHorizontal: SCREEN_WIDTH * 0.05,
    marginVertical: SCREEN_HEIGHT * 0.015,
    padding: SCREEN_WIDTH * 0.04,
    borderRadius: SCREEN_WIDTH * 0.03,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerRow: { flexDirection: "row", justifyContent: "space-between" },
  chartTitle: { fontSize: SCREEN_WIDTH * 0.045, fontWeight: "600" },
  chartDate: { fontSize: SCREEN_WIDTH * 0.032, color: "#666" },
  chartUnit: { fontSize: SCREEN_WIDTH * 0.032, color: "#666", marginBottom: SCREEN_HEIGHT * 0.008 },
  rangeButton: {
    paddingHorizontal: SCREEN_WIDTH * 0.025,
    paddingVertical: SCREEN_HEIGHT * 0.008,
    borderRadius: SCREEN_WIDTH * 0.015,
    borderWidth: 1,
    borderColor: "#ccc",
    marginRight: SCREEN_WIDTH * 0.015,
  },
  activeRange: { backgroundColor: "#000", borderColor: "#000" },
  rangeText: { fontSize: SCREEN_WIDTH * 0.032, color: "#000" },
  activeRangeText: { color: "#fff" },
  measureContainer: { flex: 1, alignItems: "center", padding: SCREEN_WIDTH * 0.04 },
  measureCard: {
    backgroundColor: "#fff",
    padding: SCREEN_WIDTH * 0.05,
    borderRadius: SCREEN_WIDTH * 0.03,
    width: "45%",
    alignItems: "center",
    marginBottom: SCREEN_HEIGHT * 0.025,
  },
  buttonRow: { flexDirection: "row" },
});