import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/MaterialIcons";
import BottomNav from "../components/BottomNav";
import GradientText from "../components/GradientText"; 
import ProfileCard from "../components/profile/ProfileCard"; 
import { useProfiles } from "../hooks/useProfiles";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function ProfileScreen({ navigation }) {
  const { profiles, loading, handleSetMain } = useProfiles();

  const sortedProfiles = React.useMemo(() => {
    if (!profiles) return [];
    return [...profiles].sort((a, b) => (b.profile === true ? 1 : 0) - (a.profile === true ? 1 : 0));
  }, [profiles]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
          <GradientText style={styles.title}>Hồ sơ</GradientText>
          {loading ? (
            <ActivityIndicator size="large" color="#00E0D3" />
          ) : sortedProfiles.length > 0 ? (
            sortedProfiles.map((profile) => (
              <ProfileCard
                key={profile.id}
                profile={profile}
                onSetMain={handleSetMain}
                onNavigateToDetail={(p) => navigation.navigate("ProfileDetail", { profile: p })}
              />
            ))
          ) : (
            <Text style={styles.emptyText}>Không có dữ liệu hồ sơ</Text>
          )}
        </ScrollView>
        <View style={styles.bottomButtonWrapper}>
          <TouchableOpacity onPress={() => navigation.navigate("NewProfile")}>
            <LinearGradient
              colors={["#00E0D3", "#4A90E2"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.addButton}
            >
              <Icon name="add" size={20} color="#fff" style={{ marginRight: 6 }} />
              <Text style={styles.addButtonText}>Thêm mới</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F5F9FF" },
  container: { flex: 1 },
  title: {
    fontSize: SCREEN_WIDTH * 0.055,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: SCREEN_HEIGHT * 0.025,
  },
  emptyText: {
    textAlign: "center",
    color: "#888",
    marginTop: 20,
    fontSize: SCREEN_WIDTH * 0.04,
  },
  bottomButtonWrapper: {
    paddingHorizontal: SCREEN_WIDTH * 0.04,
    paddingBottom: SCREEN_HEIGHT * 0.02,
    backgroundColor: "#F5F9FF",
  },
  addButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: SCREEN_WIDTH * 0.02,
    paddingVertical: SCREEN_HEIGHT * 0.015,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: SCREEN_WIDTH * 0.042,
  },
});