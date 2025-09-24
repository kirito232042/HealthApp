import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LandingScreen from './src/screens/LandingScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import ManualMeasurement from './src/screens/ManualMeasurement';
import ProfileDetailScreen from './src/screens/ProfileDetailScreen';
import NewProfileScreen from './src/screens/NewProfileScreen';
import MainTabs from './src/screens/MainTabs';
import SplashScreen from './src/screens/SplashScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Landing"
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right", 
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Landing" component={LandingScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        {/* MainTabs đã bao gồm Home, Stats, History, Profile */}
        <Stack.Screen name="MainTabs" component={MainTabs} /> 
        <Stack.Screen name="ManualMeasurement" component={ManualMeasurement} />
        <Stack.Screen name="ProfileDetail" component={ProfileDetailScreen} />
        <Stack.Screen name="NewProfile" component={NewProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}