import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet, Dimensions, Text } from "react-native";
import GradientIcon from "../GradientIcon";
import GradientText from "../GradientText";
import { LinearGradient } from "expo-linear-gradient";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const buttons = [
  { label: "Bắt đầu đo", icon: "bluetooth-searching", onPress: null },
  { label: "Nhập thủ công", icon: "edit", onPress: "ManualMeasurement" },
];

export default function MeasureTab({ navigation, styles }) {
  const [pressedButton, setPressedButton] = useState(null);

  return (
    <View style={styles.measureContainer}>
      <View style={styles.buttonRow}>
        {buttons.map(({ label, icon, onPress }, idx) => {
          const isPressed = pressedButton === label;
          return (
            <TouchableOpacity
              key={label}
              style={{ flex: 1, marginHorizontal: 5 }}
              onPressIn={() => setPressedButton(label)}
              onPressOut={() => setPressedButton(null)}
              onPress={() => {
                if (onPress && navigation) navigation.navigate(onPress);
                // Nếu là "Bắt đầu đo", bạn thêm logic ở đây nếu cần
              }}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={["#00E0D3", "#4A90E2"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ borderRadius: 8, padding: 1 }}
              >
                <View style={[localStyles.whiteButton, isPressed && localStyles.fillButton]}>
                  {isPressed ? (
                    <>
                      <GradientIcon name={icon} size={18} />
                      <Text style={[localStyles.buttonText, { color: "#fff" }]}>{label}</Text>
                    </>
                  ) : (
                    <>
                      <GradientIcon name={icon} size={18} />
                      <GradientText style={localStyles.buttonText}>{label}</GradientText>
                    </>
                  )}
                </View>
              </LinearGradient>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const localStyles = StyleSheet.create({
  whiteButton: {
    backgroundColor: "#fff",
    borderRadius: 7,
    paddingVertical: SCREEN_HEIGHT * 0.014,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  fillButton: { backgroundColor: "transparent" },
  buttonText: {
    fontWeight: "500",
    marginLeft: SCREEN_WIDTH * 0.01,
    fontSize: SCREEN_WIDTH * 0.04,
  },
});