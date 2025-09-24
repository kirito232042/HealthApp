import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import BottomNav from "../components/BottomNav";
import GradientText from "../components/GradientText";
import GradientBox from "../components/GradientBox";
import HistoryCard from "../components/history/HistoryCard";
import { useHistoryScreen } from "../hooks/useHistoryScreen";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const TabButton = ({ label, value, activeTab, setActiveTab }) => {
  const isActive = activeTab === value;
  return (
    <TouchableOpacity
      style={[styles.tab, isActive && styles.activeTab]}
      onPress={() => setActiveTab(value)}
    >
      {isActive ? (
        <GradientText style={[styles.tabText, styles.activeTabText]}>{label}</GradientText>
      ) : (
        <Text style={styles.tabText}>{label}</Text>
      )}
    </TouchableOpacity>
  );
};

export default function HistoryScreen({ navigation }) {
  const {
    data, loading, activeTab, setActiveTab, selectedItems,
    toggleSelectItem, toggleSelectAll, deleteSelected,
  } = useHistoryScreen();

  const renderItem = ({ item }) => (
    <HistoryCard
      item={item}
      isSelected={selectedItems.includes(item.id)}
      onToggleSelect={toggleSelectItem}
    />
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.checkbox} onPress={toggleSelectAll}>
          {selectedItems.length === data.length && data.length > 0 && (
            <GradientBox><Ionicons name="checkmark" size={14} color="#fff" /></GradientBox>
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={deleteSelected}>
          <Ionicons name="trash-outline" size={24} color={selectedItems.length > 0 ? "#D9534F" : "#ccc"} />
        </TouchableOpacity>
      </View>
      <View style={styles.divider} />

      <View style={styles.tabContainer}>
        <TabButton label="Tất cả" value="all" activeTab={activeTab} setActiveTab={setActiveTab} />
        <TabButton label="Báo cáo" value="report" activeTab={activeTab} setActiveTab={setActiveTab} />
      </View>

      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 30 }} color="#4A90E2" />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16 }}
          ListEmptyComponent={<Text style={styles.emptyText}>Không có dữ liệu lịch sử</Text>}
        />
      )}
    </SafeAreaView>
  );
}
// ... copy styles chung vào đây
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F5F9FF", paddingTop: SCREEN_HEIGHT * 0.025 },
  topBar: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: SCREEN_WIDTH * 0.05, marginBottom: SCREEN_HEIGHT * 0.012 },
  divider: { height: 1, backgroundColor: "#ccc", marginHorizontal: 0, marginBottom: SCREEN_HEIGHT * 0.012 },
  tabContainer: { flexDirection: "row", justifyContent: "center", backgroundColor: "#D9EFFF", borderRadius: SCREEN_WIDTH * 0.025, marginHorizontal: SCREEN_WIDTH * 0.15, padding: SCREEN_WIDTH * 0.01 },
  tab: { flex: 1, paddingVertical: SCREEN_HEIGHT * 0.012, alignItems: "center", borderRadius: SCREEN_WIDTH * 0.02 },
  activeTab: { backgroundColor: "#fff", shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 3, elevation: 2 },
  tabText: { fontSize: SCREEN_WIDTH * 0.037, fontWeight: "500", color: "#666" },
  activeTabText: { fontWeight: "600" },
  checkbox: { width: SCREEN_WIDTH * 0.045, height: SCREEN_WIDTH * 0.045, borderWidth: 1, borderColor: "#999", borderRadius: SCREEN_WIDTH * 0.012, alignItems: "center", justifyContent: "center", backgroundColor: "#fff" },
  emptyText: { textAlign: "center", marginTop: 50, color: '#666' }
});