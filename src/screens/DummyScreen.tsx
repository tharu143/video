// src/screens/DummyScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const DummyScreen: React.FC = () => {
  return (
    <LinearGradient colors={['#0f0c29', '#302b63', '#24243e']} style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Icon name="progress-wrench" size={60} color="rgba(255, 255, 255, 0.5)" />
      <Text style={styles.text}>Coming Soon!</Text>
      <Text style={styles.subtext}>This feature is under construction.</Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 20,
  },
  subtext: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 16,
    marginTop: 8,
  },
});

export default DummyScreen;
