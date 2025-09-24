import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

export default function CustomDateModal({ visible, onClose, onConfirm, initialDate }) {
  const [date, setDate] = useState(initialDate);

  const handleConfirm = (selectedDate) => {
    setDate(selectedDate);
    onConfirm(selectedDate);
  };

  return (
    <DateTimePickerModal
      isVisible={visible}
      mode="date"
      date={date}
      onConfirm={handleConfirm}
      onCancel={onClose}
      headerTextIOS="Chọn ngày"
      confirmTextIOS="Xác nhận"
      cancelTextIOS="Hủy"
    />
  );
}