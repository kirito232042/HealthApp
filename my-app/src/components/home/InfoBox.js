import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const InfoRow = ({ label, value, unit }) => (
  <>
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <View style={styles.infoValueContainer}>
        <Text style={styles.infoValue}>{value ?? "--"}</Text>
        {unit && <Text style={styles.infoUnit}>{unit}</Text>}
      </View>
    </View>
    <View style={styles.rowDivider} />
  </>
);

export default function InfoBox({ data }) {
  return (
    <View style={styles.infoBox}>
      <InfoRow label="Cân Nặng" value={data.currentWeight} unit="kg" />
      <InfoRow label="Chiều Cao" value={data.currentHeight} unit="cm" />
      <InfoRow label="Huyết Áp" value={data.currentBP} unit="mmHg" />
      <InfoRow label="Nhịp tim" value={data.currentHeartRate} unit="bpm" />
      <InfoRow label="SpO₂" value={data.currentSpO2} unit="%" />
      {/* Bỏ đi row divider cuối cùng */}
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>BMI</Text>
        <View style={styles.infoValueContainer}>
          <Text style={styles.infoValue}>{data.currentBMI ?? "--"}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  infoBox: {
    backgroundColor: "#fff",
    borderRadius: SCREEN_WIDTH * 0.03,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: SCREEN_HEIGHT * 0.015,
    paddingHorizontal: SCREEN_WIDTH * 0.04,
    paddingVertical: SCREEN_HEIGHT * 0.01,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: SCREEN_HEIGHT * 0.015,
  },
  infoLabel: {
    fontSize: SCREEN_WIDTH * 0.042,
    fontWeight: "500",
    color: "#333",
  },
  infoValueContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoValue: {
    fontSize: SCREEN_WIDTH * 0.055,
    fontWeight: "bold",
    marginRight: SCREEN_WIDTH * 0.01,
  },
  infoUnit: {
    fontSize: SCREEN_WIDTH * 0.037,
    color: "#666",
  },
  rowDivider: {
    height: 1,
    backgroundColor: "#eee",
  },
});