import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export const SummaryRow = ({ label, data }) => (
  <View style={styles.summaryRow}>
    <Text style={{ flex: 1 }}>{label}</Text>
    <Text style={styles.summaryValue}>{data?.avg ?? "--"}</Text>
    <Text style={styles.summaryValue}>{data?.min ?? "--"}</Text>
    <Text style={styles.summaryValue}>{data?.max ?? "--"}</Text>
  </View>
);

const styles = StyleSheet.create({
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
