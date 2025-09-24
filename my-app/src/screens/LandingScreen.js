import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import GradientText from '../components/GradientText';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function LandingScreen({ navigation }) {
  return (
    <View style={styles.background}>
      <View style={styles.container}>
        <Image
          source={require('../../assets/app_logo.jpg')}
          style={styles.logo}
          resizeMode="contain"
        />
        <GradientText style={styles.brand}>BkCare</GradientText>
        <Text style={styles.subtitle}>Chăm sóc sức khỏe thông minh, an toàn và tiện lợi</Text>
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[styles.buttonWrapper, styles.loginButton]}
            onPress={() => navigation.navigate('Login')}
            activeOpacity={0.85}
          >
            <Text style={styles.buttonText}>Đăng nhập</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.buttonWrapper, styles.registerButton]}
            onPress={() => navigation.navigate('Register')}
            activeOpacity={0.85}
          >
            <Text style={styles.buttonText}>Đăng ký</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#FDF9F5',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SCREEN_WIDTH * 0.08,
  },
  logo: {
    width: SCREEN_WIDTH * 0.55,
    height: SCREEN_WIDTH * 0.55,
    marginBottom: SCREEN_HEIGHT * 0.025,
  },
  brand: {
    fontSize: SCREEN_WIDTH * 0.13,
    fontWeight: 'bold',
    marginBottom: SCREEN_HEIGHT * 0.01,
    textAlign: 'center',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: SCREEN_WIDTH * 0.048,
    color: '#333',
    fontWeight: '500',
    marginBottom: SCREEN_HEIGHT * 0.06,
    textAlign: 'center',
    lineHeight: SCREEN_WIDTH * 0.07,
  },
  buttonGroup: {
    width: '100%',
    alignItems: 'center',
  },
  buttonWrapper: {
    width: '90%',
    borderRadius: SCREEN_WIDTH * 0.04,
    marginBottom: SCREEN_HEIGHT * 0.025,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButton: {
    backgroundColor: '#6EDCFF', // Xanh nhạt hơn
  },
  registerButton: {
    backgroundColor: '#1976D2', // Xanh đậm hơn
  },
  buttonText: {
    color: '#fff',
    fontSize: SCREEN_WIDTH * 0.058,
    fontWeight: '700',
    letterSpacing: 1,
    paddingVertical: SCREEN_HEIGHT * 0.022,
    width: '100%',
    textAlign: 'center',
  },
});