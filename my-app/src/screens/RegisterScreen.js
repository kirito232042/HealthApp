import React from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useAuth } from "../hooks/useAuth"; 

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function RegisterScreen({ navigation }) {
  const {
    firstName, setFirstName,
    lastName, setLastName,
    email, setEmail,
    password, setPassword,
    isLoading,
    handleRegister,
  } = useAuth();

  const onRegisterPress = async () => {
    const result = await handleRegister();
    if (result?.success) {
      Alert.alert("✅ Thành công", "Đăng ký thành công! Vui lòng quay lại màn hình chính để đăng nhập.");
      navigation.navigate("Landing");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Đăng ký</Text>
        <TextInput
          placeholder="Tên"
          value={firstName}
          onChangeText={setFirstName}
          style={styles.input}
        />
        <TextInput
          placeholder="Họ"
          value={lastName}
          onChangeText={setLastName}
          style={styles.input}
        />
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Mật khẩu"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={styles.input}
        />
        {isLoading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <Button title="Đăng ký" onPress={onRegisterPress} />
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SCREEN_WIDTH * 0.06,
    justifyContent: "center",
    backgroundColor: "#F5F9FF",
  },
  title: {
    fontSize: SCREEN_WIDTH * 0.07,
    fontWeight: "bold",
    marginBottom: SCREEN_HEIGHT * 0.03,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    paddingVertical: SCREEN_HEIGHT * 0.018,
    paddingHorizontal: SCREEN_WIDTH * 0.04,
    marginBottom: SCREEN_HEIGHT * 0.018,
    borderRadius: SCREEN_WIDTH * 0.025,
    fontSize: SCREEN_WIDTH * 0.045,
    backgroundColor: "#fff",
  },
});