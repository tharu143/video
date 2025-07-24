// src/navigation/AppNavigator.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';

// Screens
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import DummyScreen from '../screens/DummyScreen';

const Tab = createBottomTabNavigator();

// Custom "Upload" button
const CustomUploadButton = () => (
  <View style={styles.uploadButtonContainer}>
    <View style={styles.uploadButton}>
      <Icon name="add" size={30} color="#000" />
    </View>
  </View>
);

const AppNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string = '';
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
            return <Icon name={iconName} size={size} color={color} />;
          } else if (route.name === 'Discover') {
            iconName = focused ? 'compass' : 'compass-outline';
            return <MaterialIcon name={iconName} size={size} color={color} />;
          } else if (route.name === 'Notifications') {
            iconName = focused ? 'heart' : 'heart-outline';
            return <Icon name={iconName} size={size} color={color} />;
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person-circle' : 'person-circle-outline';
            return <Icon name={iconName} size={size} color={color} />;
          }
          return null;
        },
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          position: 'absolute',
          bottom: 25,
          left: 20,
          right: 20,
          elevation: 0,
          backgroundColor: 'rgba(22, 22, 22, 0.8)',
          borderRadius: 15,
          height: 60,
          borderTopWidth: 0,
        },
        tabBarShowLabel: false,
        headerShown: false,
      })}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Discover" component={DummyScreen} />
      <Tab.Screen
        name="Upload"
        component={DummyScreen}
        options={{
          tabBarIcon: () => <CustomUploadButton />,
        }}
      />
      <Tab.Screen name="Notifications" component={DummyScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  uploadButtonContainer: {
    top: -25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
});

export default AppNavigator;
