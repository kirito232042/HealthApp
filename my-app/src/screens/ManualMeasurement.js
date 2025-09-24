import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Dimensions,
  ActivityIndicator, // Thêm ActivityIndicator để hiển thị khi đang tải
  TextInput
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialIcons";
import { LinearGradient } from "expo-linear-gradient";

// Import các phần đã được tách
import { MEASUREMENT_CONFIG } from "../config/measurementConfig";
import MeasurementInput from "../components/manualmeasurement/MeasurementInput";
import { useMeasurementSubmit } from "../hooks/useMeasurementSubmit";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Hàm helper để tạo state ban đầu cho form
const createInitialState = (config, params) => {
    const initialState = {};
    console.log(config)
    config.forEach(field => {
        console.log('Field:', field.key);
        initialState[field.key] = params[field.key] || "";
    });
    // Thêm các trường không có trong config
    initialState.note = params.note || "";
    // Thêm date/time nếu cần
    return initialState;
};


export default function ManualMeasurement({ navigation, route }) {
    const measurementParams = route?.params?.measurement || {};
    console.log('Received measurement params:', measurementParams);
    
    // 1. Dùng một state duy nhất cho toàn bộ form
    const [formState, setFormState] = useState(
        createInitialState(MEASUREMENT_CONFIG, measurementParams)
    );

    // Hàm cập nhật state khi người dùng nhập liệu
    const { submitMeasurements, loading } = useMeasurementSubmit();

    const handleInputChange = (key, value) => {
        setFormState(prevState => ({
            ...prevState,
            [key]: value,
        }));
    };

    const handleSave = async () => {
        try {
            // 3. Gọi hàm submit từ hook
            await submitMeasurements(formState, MEASUREMENT_CONFIG);
            Alert.alert("Thành công", "Đã lưu các chỉ số!");
            navigation.goBack();
        } catch (err) {
            // Lỗi đã được ném ra từ hook và được bắt ở đây
            Alert.alert("Lỗi", err.message || "Không thể lưu chỉ số");
        }
    };


    // Hàm render các cặp ô nhập liệu
    const renderInputPairs = () => {
        const pairs = [];
        for (let i = 0; i < MEASUREMENT_CONFIG.length; i += 2) {
            const field1 = MEASUREMENT_CONFIG[i];
            const field2 = MEASUREMENT_CONFIG[i + 1];
            
            const { key: key1, ...otherField1Props } = field1;
            pairs.push(
                <View style={styles.row} key={field1.key}>
                    <MeasurementInput
                        styles={styles}
                        {...otherField1Props}
                        value={formState[field1.key]}
                        onChangeText={(text) => handleInputChange(field1.key, text)}
                    />
                    {field2 ? (
                        (() => {
                            const { key: key2, ...otherField2Props } = field2;
                            return (
                                <MeasurementInput
                                    styles={styles}
                                    {...otherField2Props}
                                    value={formState[field2.key]}
                                    onChangeText={(text) => handleInputChange(field2.key, text)}
                                />
                            );
                        })()
                    ) : <View style={styles.col} /> /* Placeholder để giữ layout */}
                </View>
            );
        }
        return pairs;
    };

    return (
        <SafeAreaView style={styles.safe}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Chi tiết</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.container}>
                {/* 3. Render form từ config */}
                {renderInputPairs()}

                {/* Các trường không có trong config (ghi chú, ngày, giờ) */}
                <Text style={styles.label}>Ghi chú</Text>
                <TextInput
                    style={[styles.input, { height: 80, textAlignVertical: "top" }]}
                    value={formState.note}
                    onChangeText={(text) => handleInputChange('note', text)}
                    multiline
                    placeholder="Ghi chú thêm..."
                    placeholderTextColor="#ccc"
                />
            </ScrollView>

            {/* Button Lưu */}
            <View style={styles.bottomButtonWrapper}>
                {/* 4. Cập nhật nút Lưu để sử dụng trạng thái `loading` */}
                <TouchableOpacity onPress={handleSave} disabled={loading}>
                    <LinearGradient
                        colors={loading ? ["#aaa", "#888"] : ["#00E0D3", "#4A90E2"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.saveButton}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.saveText}>Lưu</Text>
                        )}
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}


// Giữ nguyên toàn bộ styles
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F5F9FF" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SCREEN_WIDTH * 0.04,
    paddingVertical: SCREEN_HEIGHT * 0.012,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: { fontSize: SCREEN_WIDTH * 0.05, fontWeight: "600" },
  container: { padding: SCREEN_WIDTH * 0.04 },
  row: { flexDirection: "row", marginBottom: SCREEN_HEIGHT * 0.01 },
  col: { flex: 1, marginHorizontal: SCREEN_WIDTH * 0.015 },
  label: {
    fontSize: SCREEN_WIDTH * 0.037,
    color: "#444",
    marginBottom: SCREEN_HEIGHT * 0.008,
    fontWeight: '500'
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: SCREEN_WIDTH * 0.02,
    paddingVertical: SCREEN_HEIGHT * 0.012,
    paddingHorizontal: SCREEN_WIDTH * 0.03,
    fontSize: SCREEN_WIDTH * 0.045,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  bottomButtonWrapper: {
    padding: SCREEN_WIDTH * 0.04,
    backgroundColor: "#F5F9FF",
    borderTopWidth: 1,
    borderTopColor: '#eee'
  },
  saveButton: {
    borderRadius: SCREEN_WIDTH * 0.025,
    paddingVertical: SCREEN_HEIGHT * 0.018,
    alignItems: "center",
  },
  saveText: { color: "#fff", fontWeight: "600", fontSize: SCREEN_WIDTH * 0.045 },
});