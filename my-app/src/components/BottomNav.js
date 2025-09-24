import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import GradientIcon from "./GradientIcon";
import Icon from "react-native-vector-icons/MaterialIcons";
import { SafeAreaView } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Component giờ nhận props từ Tab.Navigator
export default function BottomNav({ state, descriptors, navigation }) {
    const items = [
        { route: "Home", label: "Trang chủ", icon: "home" },
        { route: "Stats", label: "Thống kê", icon: "insert-chart" },
        { route: "History", label: "Lịch sử", icon: "history" },
        { route: "Profile", label: "Hồ sơ", icon: "person" },
    ];
    
    return (
        <SafeAreaView edges={['bottom']} style={styles.container}>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const item = items.find(i => i.route === route.name);

                if (!item) return null; // Bỏ qua nếu không tìm thấy item tương ứng

                // `state.index` là index của tab đang active
                const isActive = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isActive && !event.defaultPrevented) {
                        navigation.navigate(route.name);
                    }
                };

                return (
                    <TouchableOpacity
                        key={index}
                        accessibilityRole="button"
                        accessibilityState={isActive ? { selected: true } : {}}
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        testID={options.tabBarTestID}
                        onPress={onPress}
                        style={styles.item}
                    >
                        {isActive ? (
                            <GradientIcon name={item.icon} size={SCREEN_WIDTH * 0.065} />
                        ) : (
                            <Icon name={item.icon} size={SCREEN_WIDTH * 0.065} color="#999" />
                        )}

                        <Text style={[
                            styles.label,
                            { 
                                color: isActive ? "#000" : "#999",
                                fontWeight: isActive ? "bold" : "normal",
                            }
                        ]}>
                            {item.label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-around",
        paddingTop: SCREEN_HEIGHT * 0.012, 
        borderTopWidth: 1,
        borderColor: "#ddd",
        backgroundColor: "#fff",
    },
    item: {
        alignItems: "center",
        minWidth: SCREEN_WIDTH * 0.18,
        paddingBottom: 5, // Thêm chút padding dưới cho đẹp
    },
    label: {
        fontSize: SCREEN_WIDTH * 0.03,
        marginTop: SCREEN_HEIGHT * 0.003,
    },
});