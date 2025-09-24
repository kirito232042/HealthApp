import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Import các màn hình của bạn
import HomeScreen from './HomeScreen';
import StatScreen from './StatScreen';
import HistoryScreen from './HistoryScreen';
import ProfileScreen from './ProfileScreen';

// Import component giao diện BottomNav của bạn
import BottomNav from '../components/BottomNav';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      // Dùng tabBar prop để chỉ định component giao diện tùy chỉnh
      tabBar={props => <BottomNav {...props} />}
      screenOptions={{
        headerShown: false, // Ẩn header mặc định của từng tab
      }}
    >
      {/* Các màn hình giờ là Tab.Screen */}
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Stats" component={StatScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}