import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ScrollView,
  Image
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Import các component và hook tùy chỉnh
import { useAuth } from "../hooks/useAuth";
import GradientText from "../components/GradientText";

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
    if (result) {
      // Thay thế màn hình hiện tại để người dùng không thể quay lại
      navigation.replace("MainTabs");
    }
  };

  const onForgotPasswordPress = () => {
    Alert.alert("Thông báo", "Chức năng này sẽ được cập nhật sớm. Vui lòng thử lại sau!");
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.container}>
          {/* Logo và Tên ứng dụng */}
          <Image
            source={require('../../assets/remove_bg.png')}
            style={styles.logo}
          />
          <GradientText style={styles.title}>Chào mừng trở lại</GradientText>
          <Text style={styles.subtitle}>Đăng nhập để tiếp tục</Text>

          {/* Ô nhập Email */}
          <View style={styles.inputContainer}>
            <Icon name="person-outline" size={22} color="#888" style={styles.inputIcon} />
            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#aaa"
            />
          </View>
          
          {/* Ô nhập Mật khẩu */}
          <View style={styles.inputContainer}>
            <Icon name="lock-outline" size={22} color="#888" style={styles.inputIcon} />
            <TextInput
              placeholder="Mật khẩu"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              style={styles.input}
              placeholderTextColor="#aaa"
            />
          </View>

          {/* Hàng tùy chọn: Quên mật khẩu */}
          <View style={styles.optionsRow}>
            <TouchableOpacity onPress={onForgotPasswordPress}>
              <Text style={styles.forgotText}>Quên mật khẩu?</Text>
            </TouchableOpacity>
          </View>

          {/* Nút Đăng nhập */}
          <TouchableOpacity onPress={onLoginPress} disabled={isLoading} style={{ width: '100%' }}>
            <LinearGradient
              colors={["#00E0D3", "#4A90E2"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.loginButton}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.loginButtonText}>Đăng nhập</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* Link Đăng ký */}
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Chưa có tài khoản? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <GradientText style={styles.linkText}>Đăng ký ngay</GradientText>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F5F9FF",
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: SCREEN_WIDTH * 0.06,
    justifyContent: "center",
    alignItems: 'center',
  },
  logo: {
    width: SCREEN_WIDTH * 0.5, // Tăng kích thước logo
    height: SCREEN_WIDTH * 0.5, // Tăng kích thước logo
    resizeMode: 'contain',
    marginBottom: 20,
  },
  title: {
    fontSize: SCREEN_WIDTH * 0.07,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: SCREEN_WIDTH * 0.04,
    color: '#666',
    marginBottom: SCREEN_HEIGHT * 0.05,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: SCREEN_WIDTH * 0.025,
    marginBottom: SCREEN_HEIGHT * 0.018,
    width: '100%',
  },
  inputIcon: {
    marginHorizontal: 15,
  },
  input: {
    flex: 1,
    paddingVertical: Platform.OS === 'ios' ? SCREEN_HEIGHT * 0.018 : SCREEN_HEIGHT * 0.015,
    fontSize: SCREEN_WIDTH * 0.04,
    color: '#333',
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start', // Đẩy về phía bên phải
    alignItems: 'center',
    width: '100%',
    marginBottom: SCREEN_HEIGHT * 0.03,
  },
  linkText: {
    fontSize: SCREEN_WIDTH * 0.04, // Tăng kích thước chữ cho dễ nhấn
    fontWeight: 'bold',
  },
  forgotText: {
    fontSize: SCREEN_WIDTH * 0.038, // Tăng kích thước chữ cho dễ nhấn
    color: '#4A90E2',
    fontWeight: '500',
  },
  loginButton: {
    borderRadius: SCREEN_WIDTH * 0.025,
    paddingVertical: SCREEN_HEIGHT * 0.018,
    alignItems: "center",
    justifyContent: 'center',
    width: '100%',
    elevation: 3,
    shadowColor: '#4A90E2',
    shadowOpacity: 0.4,
    shadowRadius: 5,
    shadowOffset: { height: 3, width: 0 },
  },
  loginButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: SCREEN_WIDTH * 0.045,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SCREEN_HEIGHT * 0.04,
  },
  registerText: {
    fontSize: SCREEN_WIDTH * 0.04,
    color: '#666',
  }
});