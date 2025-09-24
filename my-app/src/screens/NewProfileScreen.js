import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNewProfile } from "../hooks/useNewProfile";
import GradientBox from "../components/GradientBox";
import GradientText from "../components/GradientText";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function NewProfileScreen({ navigation }) {
  const {
    firstName, setFirstName,
    lastName, setLastName,
    dob, setDob,
    age,
    isLoading,
    handleCreate,
  } = useNewProfile();

  const onCreatePress = async () => {
    const result = await handleCreate();
    if (result) {
      Alert.alert("Thành công", "Tạo hồ sơ mới thành công!");
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tạo hồ sơ mới</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.container}>
        <Text style={styles.label}>Tên</Text>
        <TextInput
          style={styles.input}
          value={firstName}
          onChangeText={setFirstName}
          placeholder="Tên"
        />

        <Text style={styles.label}>Họ</Text>
        <TextInput
          style={styles.input}
          value={lastName}
          onChangeText={setLastName}
          placeholder="Họ"
        />

        <Text style={styles.label}>Ngày sinh</Text>
        <View style={styles.row}>
          <TextInput
            style={[styles.input, { flex: 1, marginRight: 10 }]}
            value={dob}
            onChangeText={setDob}
            placeholder="yyyy-MM-dd hoặc dd/MM/yyyy"
          />
          <Text style={styles.ageText}>{age !== null ? `${age} tuổi` : ""}</Text>
        </View>
      </View>

      <View style={styles.bottomButtonWrapper}>
        <TouchableOpacity onPress={onCreatePress} disabled={isLoading}>
          <GradientBox style={styles.updateButton}>
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.updateText}>Tạo mới</Text>
            )}
          </GradientBox>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// Giữ nguyên styles
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F5F9FF" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SCREEN_WIDTH * 0.04,
    paddingTop: SCREEN_HEIGHT * 0.01,
    paddingBottom: SCREEN_HEIGHT * 0.015,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: { fontSize: SCREEN_WIDTH * 0.05, fontWeight: "600" },
  container: { flex: 1, padding: SCREEN_WIDTH * 0.04 },
  label: {
    fontSize: SCREEN_WIDTH * 0.037,
    color: "#444",
    marginBottom: SCREEN_HEIGHT * 0.005,
    marginTop: SCREEN_HEIGHT * 0.015,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: SCREEN_WIDTH * 0.02,
    paddingVertical: SCREEN_HEIGHT * 0.012,
    paddingHorizontal: SCREEN_WIDTH * 0.03,
    fontSize: SCREEN_WIDTH * 0.045,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  row: { flexDirection: "row", alignItems: "center" },
  ageText: { fontSize: SCREEN_WIDTH * 0.037, color: "#555" },
  bottomButtonWrapper: {
    paddingHorizontal: SCREEN_WIDTH * 0.04,
    paddingBottom: SCREEN_HEIGHT * 0.025,
    backgroundColor: "#F5F9FF",
  },
  updateButton: {
    borderRadius: SCREEN_WIDTH * 0.02,
    paddingVertical: SCREEN_HEIGHT * 0.018,
    alignItems: "center",
    width: SCREEN_WIDTH - SCREEN_WIDTH * 0.08,
    height: SCREEN_HEIGHT * 0.07,
    justifyContent: "center",
  },
  updateText: { color: "#fff", fontWeight: "600", fontSize: SCREEN_WIDTH * 0.045 },
});