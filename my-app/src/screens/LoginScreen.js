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

export default function LoginScreen({ navigation }) {
  const {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    handleLogin,
  } = useAuth();

  const onLoginPress = async () => {
    const result = await handleLogin();
    // Nếu handleLogin trả về kết quả (không phải null), tức là thành công
    if (result) {
      Alert.alert("✅ Thành công", "Đăng nhập thành công!");
      navigation.navigate("MainTabs");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}    
    >
      <View style={styles.container}>
        <Text style={styles.title}>Đăng nhập</Text>
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
          <Button title="Đăng nhập" onPress={onLoginPress} />
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