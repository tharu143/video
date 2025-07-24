// App.tsx
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { firebaseAuth } from './src/config/firebase';
import AppNavigator from './src/navigation/AppNavigator';
import LoginScreen from './src/screens/LoginScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
// Pudhu modular function-ah import panrom
import { onAuthStateChanged } from '@react-native-firebase/auth';
import type { FirebaseAuthTypes } from '@react-native-firebase/auth';

const App: React.FC = () => {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  useEffect(() => {
    // Pudhu modular style-la onAuthStateChanged-ah use panrom
    const subscriber = onAuthStateChanged(firebaseAuth, (user) => {
      setUser(user);
      if (initializing) {
        setInitializing(false);
      }
    });
    return subscriber; // unsubscribe on unmount
  }, [initializing]);

  if (initializing) {
    return null; // or a loading screen
  }

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <NavigationContainer>
        {user ? <AppNavigator /> : <LoginScreen />}
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
