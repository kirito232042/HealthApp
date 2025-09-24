import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import GradientIcon from "../GradientIcon";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function ProfileCard({ profile, onSetMain, onNavigateToDetail }) {
  const isMain = profile.profile;

  return (
    <TouchableOpacity
      style={[styles.profileCard, isMain && styles.mainProfileCard]}
      onPress={() => !isMain && onSetMain(profile.id)}
      activeOpacity={isMain ? 1 : 0.7}
    >
      <View style={styles.profileRow}>
        <GradientIcon name="person" size={24} />
        <Text style={[styles.profileName, isMain && styles.mainProfileName]}>
          {profile.firstName} {profile.lastName}
        </Text>
        {isMain && <Text style={styles.mainText}>Chính</Text>}
      </View>
      <TouchableOpacity style={styles.detailBtn} onPress={() => onNavigateToDetail(profile)}>
        <Icon name="chevron-right" size={28} color="#4A90E2" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    backgroundColor: "#fff",
    borderRadius: SCREEN_WIDTH * 0.03,
    padding: SCREEN_WIDTH * 0.04,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SCREEN_HEIGHT * 0.015,
    justifyContent: "space-between",
    borderWidth: 2,
    borderColor: 'transparent', // Mặc định trong suốt
  },
  mainProfileCard: {
    borderColor: "#222",
  },
  profileRow: { flexDirection: "row", alignItems: "center", flex: 1 },
  profileName: {
    fontSize: SCREEN_WIDTH * 0.042,
    fontWeight: "500",
    color: "#333",
    marginLeft: SCREEN_WIDTH * 0.02,
  },
  mainProfileName: {
    color: "#111",
    fontWeight: "bold",
  },
  mainText: {
    fontSize: SCREEN_WIDTH * 0.032,
    color: "#111",
    marginLeft: SCREEN_WIDTH * 0.03,
    fontWeight: "bold",
  },
  detailBtn: {
    marginLeft: SCREEN_WIDTH * 0.03,
    padding: SCREEN_WIDTH * 0.01,
  },
});