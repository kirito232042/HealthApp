import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import GradientBox from '../GradientBox';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const typeLabels = {
  weight: "Cân nặng", height: "Chiều cao", blood_pressure: "Huyết áp",
  spo2: "SpO₂", heart_rate: "Nhịp tim", temperature: "Nhiệt độ",
};
const typeUnits = {
  weight: "kg", height: "cm", blood_pressure: "mmHg",
  spo2: "%", heart_rate: "bpm", temperature: "°C",
};

export default function HistoryCard({ item, isSelected, onToggleSelect }) {
  const created = new Date(item.createdAt);
  const isToday = created.toDateString() === new Date().toDateString();

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <TouchableOpacity style={styles.checkbox} onPress={() => onToggleSelect(item.id)}>
          {isSelected && <GradientBox><Ionicons name="checkmark" size={14} color="#fff" /></GradientBox>}
        </TouchableOpacity>
        <Text style={styles.timeText}>
          {isToday ? "Hôm nay" : created.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })}
          {" @ "}
          {created.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
        </Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.infoRow}>
        {Object.keys(typeLabels).map(type => (
          <View style={styles.infoItem} key={type}>
            <Text style={styles.valueText}>{item.types[type]?.value ?? "--"}</Text>
            <Text style={styles.unitText}>{typeUnits[type]}</Text>
            <Text style={styles.labelText}>{typeLabels[type]}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.statusRow}>
        <View style={[styles.statusDot, { backgroundColor: item.statusColor || "green" }]} />
        <Text style={[styles.statusText, { color: item.statusColor || "green" }]}>
          {item.status || "Bình thường"}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#999" style={styles.arrowIcon} />
    </View>
  );
}
// ... copy styles của card vào đây
const styles = StyleSheet.create({
  card: { backgroundColor: "#fff", borderRadius: SCREEN_WIDTH * 0.03, padding: SCREEN_WIDTH * 0.04, marginBottom: SCREEN_HEIGHT * 0.018, position: "relative", shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 3, elevation: 2 },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: SCREEN_HEIGHT * 0.01 },
  checkbox: { width: SCREEN_WIDTH * 0.045, height: SCREEN_WIDTH * 0.045, borderWidth: 1, borderColor: "#999", marginRight: SCREEN_WIDTH * 0.02, borderRadius: SCREEN_WIDTH * 0.012, alignItems: "center", justifyContent: "center", backgroundColor: "#fff" },
  timeText: { fontSize: SCREEN_WIDTH * 0.032, color: "#666" },
  infoRow: { flexDirection: "row", paddingRight: SCREEN_WIDTH * 0.05 },
  infoItem: { width: SCREEN_WIDTH * 0.2, alignItems: "center", marginRight: SCREEN_WIDTH * 0.025 },
  valueText: { fontSize: SCREEN_WIDTH * 0.045, fontWeight: "bold", color: "#000" },
  unitText: { fontSize: SCREEN_WIDTH * 0.028, color: "#888", marginBottom: 2 },
  labelText: { fontSize: SCREEN_WIDTH * 0.032, color: "#666" },
  statusRow: { flexDirection: "row", alignItems: "center", marginTop: SCREEN_HEIGHT * 0.005 },
  statusDot: { width: SCREEN_WIDTH * 0.02, height: SCREEN_WIDTH * 0.02, borderRadius: SCREEN_WIDTH * 0.01, marginRight: SCREEN_WIDTH * 0.015 },
  statusText: { fontSize: SCREEN_WIDTH * 0.032, color: "#666" },
  arrowIcon: { position: "absolute", right: SCREEN_WIDTH * 0.04, top: "50%", transform: [{ translateY: -SCREEN_WIDTH * 0.025 }] },
});