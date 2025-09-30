import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Dimensions, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import GradientIcon from '../GradientIcon';
import GradientText from '../GradientText';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const buttons = [
  { route: "Report", label: "Báo cáo", icon: "description" },
  { route: "History", label: "Lịch sử", icon: "history" },
];

export default function ActionButtons({ navigation }) {
  const [pressedButton, setPressedButton] = useState(null);

  return (
    <View style={styles.buttonRow}>
      {buttons.map(({ route, label, icon }) => {
        const isPressed = pressedButton === route;
        return (
          <TouchableOpacity
            key={route}
            style={{ flex: 1, marginHorizontal: 5 }}
            onPressIn={() => {
              if(route === "Report") {
                setPressedButton(null);
                Alert.alert("Thông báo", "Chức năng này sẽ được cập nhật sớm. Vui lòng thử lại sau!");
                
                return;
              }
              setPressedButton(route)
            }}
            onPressOut={() => setPressedButton(null)}
            onPress={() =>{
              if(route === "Report") {
                return; 
              }
              navigation.navigate(route)
            }}
          >
            <LinearGradient
              colors={["#00E0D3", "#4A90E2"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ borderRadius: 8, padding: 1 }}
            >
              <View style={[styles.whiteButton, isPressed && styles.fillButton]}>
                {isPressed ? (
                  <>
                    <Icon name={icon} size={18} color="#fff" style={{ marginRight: 6 }} />
                    <Text style={[styles.buttonText, { color: "#fff" }]}>{label}</Text>
                  </>
                ) : (
                  <>
                    <GradientIcon name={icon} size={18} />
                    <GradientText style={styles.buttonText}>{label}</GradientText>
                  </>
                )}
              </View>
            </LinearGradient>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  buttonRow: { flexDirection: "row", marginBottom: SCREEN_HEIGHT * 0.015 },
  whiteButton: {
    backgroundColor: "#fff",
    borderRadius: 7, // slight adjustment to fit inside the gradient border
    paddingVertical: SCREEN_HEIGHT * 0.014,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    overflow: 'hidden',
  },
  fillButton: { backgroundColor: "transparent" },
  buttonText: { fontWeight: "500", marginLeft: SCREEN_WIDTH * 0.01, fontSize: SCREEN_WIDTH * 0.04 },
});