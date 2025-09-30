import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Import các màn hình của bạn
import HomeScreen from './HomeScreen';
import StatScreen from './StatScreen';
import HistoryScreen from './HistoryScreen';
import ProfileScreen from './ProfileScreen';

// Import các component cần thiết cho tính năng AI
import BottomNav from '../components/BottomNav';
import FloatingAIButton from '../components/FloatingAIButton';
import ChatModal from '../components/ChatModal';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  // State để điều khiển việc hiển thị/ẩn cửa sổ chat
  const [isChatVisible, setChatVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Tab.Navigator
        // Dùng tabBar prop để chỉ định component giao diện tùy chỉnh
        tabBar={props => <BottomNav {...props} />}
        screenOptions={{
          headerShown: false, // Ẩn header mặc định của từng tab
        }}
      >
        {/* Các màn hình chính của bạn */}
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Stats" component={StatScreen} />
        <Tab.Screen name="History" component={HistoryScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
      
      {/* Nút AI nổi, được đặt bên ngoài Tab.Navigator để hiển thị trên tất cả các tab */}
      <FloatingAIButton onPress={() => setChatVisible(true)} />
      
      {/* Cửa sổ chat, chỉ hiển thị khi isChatVisible là true */}
      <ChatModal
        visible={isChatVisible}
        onClose={() => setChatVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative', // Cần thiết để các thành phần con có `position: 'absolute'` hoạt động đúng
  },
});