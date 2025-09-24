import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet, FlatList } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function WeekSelector({ weeksAgo, onChange }) {
  const [visible, setVisible] = useState(false);
  const options = [
    { label: "Trước 1 tuần", value: 1 },
    { label: "Trước 2 tuần", value: 2 },
    { label: "Trước 3 tuần", value: 3 },
    { label: "Trước 4 tuần", value: 4 },
  ];

  const handleSelect = (value) => {
    onChange(value);
    setVisible(false);
  };

  return (
    <>
      <TouchableOpacity style={styles.selector} onPress={() => setVisible(true)}>
        <Text style={styles.selectorText}>
          {options.find((o) => o.value === weeksAgo)?.label || "Chọn tuần"}
        </Text>
        <Icon name="keyboard-arrow-down" size={18} color="#00C6D3" />
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPressOut={() => setVisible(false)}
        >
          <View style={styles.modalContent}>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => handleSelect(item.value)}
                >
                  <Text style={styles.optionText}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  selector: {
    flexDirection: "row",
    alignItems: "center",
  },
  selectorText: {
    color: "#00C6D3",
    marginRight: 4,
    fontWeight: "500",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingVertical: 10,
    width: 200,
    elevation: 5,
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  optionText: {
    fontSize: 16,
  },
});
