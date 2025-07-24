// src/screens/LoginScreen.tsx
import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  RefreshControl,
  Animated,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient'; // Pudhu dependency
import { GoogleSignin, statusCodes } from '../config/firebase'; 
import { firebaseAuth, firestoreDb } from '../config/firebase';
import { GoogleAuthProvider, signInWithCredential } from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'; // Logo-kaga

const LoginScreen: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Animation-kaga
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Screen varum bodhu, content fade-in aagum
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    console.log('Screen is being refreshed!');
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  const onGoogleButtonPress = async () => {
    setLoading(true);
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      await GoogleSignin.signOut();
      
      const response = await GoogleSignin.signIn();

      if (!response.data || !response.data.idToken) {
        throw new Error('Google Sign-In failed to return a valid ID token.');
      }
      
      const googleCredential = GoogleAuthProvider.credential(response.data.idToken);
      const userCredential = await signInWithCredential(firebaseAuth, googleCredential);
      
      if (userCredential.user) {
        const { user } = userCredential;
        const userDocRef = firestoreDb.collection('users').doc(user.uid);
        await userDocRef.set(
          {
            uid: user.uid,
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
          },
          { merge: true },
        );
      }

    } catch (error: any) {
      if (error && error.code) {
        switch (error.code) {
          case statusCodes.SIGN_IN_CANCELLED:
            console.log('User cancelled the login flow');
            break;
          case statusCodes.IN_PROGRESS:
            Alert.alert('In Progress', 'Login is already in progress.');
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            Alert.alert('Play Services Error', 'Google Play services not available or outdated.');
            break;
          default:
            Alert.alert('Google Sign-In Error', `Code: ${error.code}\nMessage: ${error.message}`);
            break;
        }
      } else {
        Alert.alert('An Unexpected Error Occurred', error.message || 'Please check the console for more details.');
        console.error("A generic error was caught:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    // Background gradient-kaga LinearGradient use panrom
    <LinearGradient colors={['#0f0c29', '#302b63', '#24243e']} style={styles.gradient}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#fff']}
            tintColor={'#fff'}
          />
        }>
        <Animated.View style={[styles.contentContainer, { opacity: fadeAnim }]}>
          {/* App Logo */}
          <MaterialIcon name="movie-play-outline" size={80} color="#fff" style={styles.logo} />
          
          <Text style={styles.title}>Video App</Text>
          <Text style={styles.subtitle}>Discover. Watch. Share.</Text>
          
          <TouchableOpacity
            style={styles.googleButton}
            onPress={onGoogleButtonPress}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Icon name="google" size={20} color="#fff" style={styles.icon} />
                <Text style={styles.buttonText}>Sign in with Google</Text>
              </>
            )}
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  contentContainer: {
    width: '100%',
    alignItems: 'center',
  },
  logo: {
    marginBottom: 30,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10
  },
  title: {
    fontSize: 52,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    fontFamily: 'Helvetica Neue',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: {width: 0, height: 2},
    textShadowRadius: 4
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 60,
  },
  googleButton: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  icon: {
    marginRight: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LoginScreen;
