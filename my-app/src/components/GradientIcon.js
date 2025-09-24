import React from 'react';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function GradientIcon({ name, size }) {
  return (
    <MaskedView maskElement={<Icon name={name} size={size} color="black" />}>
      <LinearGradient
        colors={["#00E0D3", "#4A90E2"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{ width: size, height: size }}
      />
    </MaskedView>
  );
}