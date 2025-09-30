import React from 'react';
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
      Alert.alert(
        "✅ Đăng ký thành công", 
        "Tài khoản của bạn đã được tạo. Vui lòng quay lại để đăng nhập.",
        [{ text: "OK", onPress: () => navigation.navigate("Login") }]
      );
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header tùy chỉnh */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back-ios" size={24} color="#000" style={{ marginLeft: 10 }} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Đăng ký</Text>
        <View style={{ width: 34 }} /> 
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.container}>
          {/* Logo */}
          <Image
            source={require('../../assets/remove_bg.png')}
            style={styles.logo}
          />
          <GradientText style={styles.title}>Tạo tài khoản</GradientText>
          <Text style={styles.subtitle}>Bắt đầu hành trình sức khỏe của bạn</Text>
          
          {/* Form đăng ký */}
          <View style={styles.inputContainer}>
            <Icon name="person-outline" size={22} color="#888" style={styles.inputIcon} />
            <TextInput
              placeholder="Tên"
              value={firstName}
              onChangeText={setFirstName}
              style={styles.input}
              placeholderTextColor="#aaa"
            />
          </View>

          <View style={styles.inputContainer}>
            <Icon name="badge" size={22} color="#888" style={styles.inputIcon} />
            <TextInput
              placeholder="Họ"
              value={lastName}
              onChangeText={setLastName}
              style={styles.input}
              placeholderTextColor="#aaa"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Icon name="mail-outline" size={22} color="#888" style={styles.inputIcon} />
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
          
          <View style={styles.inputContainer}>
            <Icon name="lock-outline" size={22} color="#888" style={styles.inputIcon} />
            <TextInput
              placeholder="Mật khẩu (tối thiểu 6 ký tự)"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              style={styles.input}
              placeholderTextColor="#aaa"
            />
          </View>

          {/* Nút Đăng ký */}
          <TouchableOpacity onPress={onRegisterPress} disabled={isLoading} style={styles.buttonWrapper}>
            <LinearGradient
              colors={["#00E0D3", "#4A90E2"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.registerButton}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.registerButtonText}>Đăng ký</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* Link Đăng nhập */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Đã có tài khoản? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <GradientText style={styles.linkText}>Đăng nhập ngay</GradientText>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: '#F5F9FF',
  },
  headerTitle: {
    fontSize: SCREEN_WIDTH * 0.05,
    fontWeight: '600',
    color: '#000',
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: SCREEN_WIDTH * 0.06,
    justifyContent: "center",
    alignItems: 'center',
    paddingBottom: 20,
  },
  logo: {
    width: SCREEN_WIDTH * 0.5,
    height: SCREEN_WIDTH * 0.5,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  title: {
    fontSize: SCREEN_WIDTH * 0.07,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: SCREEN_WIDTH * 0.04,
    color: '#666',
    marginBottom: SCREEN_HEIGHT * 0.04,
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
  buttonWrapper: {
    width: '100%',
    marginTop: SCREEN_HEIGHT * 0.02,
  },
  registerButton: {
    borderRadius: SCREEN_WIDTH * 0.025,
    paddingVertical: SCREEN_HEIGHT * 0.018,
    alignItems: "center",
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#4A90E2',
    shadowOpacity: 0.4,
    shadowRadius: 5,
    shadowOffset: { height: 3, width: 0 },
  },
  registerButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: SCREEN_WIDTH * 0.045,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SCREEN_HEIGHT * 0.04,
  },
  loginText: {
    fontSize: SCREEN_WIDTH * 0.04,
    color: '#666',
  },
  linkText: {
    fontSize: SCREEN_WIDTH * 0.04,
    fontWeight: 'bold',
  }
});