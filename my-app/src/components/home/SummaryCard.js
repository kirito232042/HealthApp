// src/components/home/SummaryCard.js
import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import WeekSelector from '../WeekSelector';
import { SummaryRow } from './SummaryRow';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");


export default function SummaryCard({ data, onWeekChange }) {
  return (
    <View style={styles.summaryCard}>
      <View style={styles.summaryHeader}>
        <Text style={styles.summaryTitle}>Tóm tắt</Text>
        <WeekSelector weeksAgo={data.weeksAgo} onChange={onWeekChange} />
      </View>

      <Text style={styles.summarySubtitle}>Thông số</Text>

      <View style={styles.summaryHeaderRow}>
        <Text style={{ flex: 1 }}></Text>
        <Text style={styles.summaryLabel}>Trung bình</Text>
        <Text style={styles.summaryLabel}>Thấp nhất</Text>
        <Text style={styles.summaryLabel}>Cao nhất</Text>
      </View>

      <SummaryRow label="Cân nặng" data={data.summaryWeight} />
      <SummaryRow label="Chiều cao" data={data.summaryHeight} />
      <SummaryRow label="Huyết áp" data={data.summaryBP} />
      <SummaryRow label="Nhịp tim" data={data.summaryHeartRate} />
      <SummaryRow label="SpO₂" data={data.summarySpO2} />
      
      <View style={styles.summaryRow}>
        <Text style={{ flex: 1 }}>BMI</Text>
        <Text style={styles.summaryValue}>{data.currentBMI ?? "--"}</Text>
        <Text style={styles.summaryValue}>--</Text>
        <Text style={styles.summaryValue}>--</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  summaryCard: {
    backgroundColor: "#fff",
    borderRadius: SCREEN_WIDTH * 0.03,
    padding: SCREEN_WIDTH * 0.04,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: SCREEN_HEIGHT * 0.02,
  },
  summaryHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: SCREEN_HEIGHT * 0.01 },
  summaryTitle: { fontSize: SCREEN_WIDTH * 0.045, fontWeight: "600" },
  summarySubtitle: { fontSize: SCREEN_WIDTH * 0.037, marginBottom: SCREEN_HEIGHT * 0.01, color: '#555' },
  summaryHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SCREEN_HEIGHT * 0.008,
  },
  summaryLabel: {
    flex: 1,
    textAlign: "center",
    color: "#666",
    fontSize: SCREEN_WIDTH * 0.032,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: SCREEN_HEIGHT * 0.01,
  },
  summaryValue: {
    flex: 1,
    backgroundColor: "#E9F4FF",
    paddingVertical: SCREEN_HEIGHT * 0.006,
    borderRadius: SCREEN_WIDTH * 0.02,
    textAlign: "center",
    fontSize: SCREEN_WIDTH * 0.04,
    marginHorizontal: 2,
    overflow: 'hidden', // For rounded corners on Android
  },
});