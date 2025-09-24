import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function GradientBox({ children, style }) {
  return (
    <LinearGradient
      colors={["#00E0D3", "#4A90E2"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[styles.gradientBox, style]}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientBox: {
    width: SCREEN_WIDTH * 0.045,
    height: SCREEN_WIDTH * 0.045,
    borderRadius: SCREEN_WIDTH * 0.012,
    alignItems: 'center',
    justifyContent: 'center',
  },
});