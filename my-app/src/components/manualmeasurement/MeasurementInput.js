import React from "react";
import { View, Text, TextInput } from "react-native";

export default function MeasurementInput({
    label,
    value,
    onChangeText,
    placeholder,
    keyboardType = "default",
    styles,
}) {
    return (
        <View style={styles.col}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChangeText}
                keyboardType={keyboardType}
                placeholder={placeholder}
                placeholderTextColor="#ccc"
            />
        </View>
    );
}