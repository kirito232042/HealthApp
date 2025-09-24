import React, { useState } from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Components
import CustomDateModal from '../components/CustomDateModal';
import InfoBox from '../components/home/InfoBox';
import SummaryCard from '../components/home/SummaryCard';
import ActionButtons from '../components/home/ActionButtons';

// Hook
import { useHomeScreenData } from '../hooks/useHomeScreenData';

export default function HomeScreen({ navigation }) {
  const [isDateModalVisible, setIsDateModalVisible] = useState(false);
  const data = useHomeScreenData(); 

  if (data.isLoading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text>Đang tải dữ liệu...</Text>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container}>
        {/* Chọn ngày */}
        <TouchableOpacity style={styles.dateRow} onPress={() => setIsDateModalVisible(true)}>
          <Text style={styles.dateText}>{data.dateStr}</Text>
          <Icon name="keyboard-arrow-down" size={20} color="#000" />
        </TouchableOpacity>

        <CustomDateModal
          visible={isDateModalVisible}
          initialDate={data.date}
          onClose={() => setIsDateModalVisible(false)}
          onConfirm={(newDate) => {
            data.setDate(newDate);
            setIsDateModalVisible(false);
          }}
        />

        {/* Các component con */}
        <InfoBox data={data} />
        <ActionButtons navigation={navigation} />
        <SummaryCard data={data} onWeekChange={data.setWeeksAgo} />
      </ScrollView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F9FF' },
  container: { flex: 1, padding: 16 },
  dateRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  dateText: { fontSize: 16, marginRight: 5, fontWeight: '500' },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F9FF',
  }
});