import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

import { useAuth } from '../contexts/AuthContext';

// Auth Screens
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';

// App Screens (placeholder for now)
import HomeScreen from '../screens/HomeScreen';

// Create Stack Navigators
const AuthStack = createNativeStackNavigator();
const AppStack = createNativeStackNavigator();

const AuthNavigator = () => {
  return (
    <AuthStack.Navigator 
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#f9f9f9' }
      }}
    >
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
      <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </AuthStack.Navigator>
  );
};

const AppNavigator = () => {
  const { currentUser, loading } = useAuth();
  const [initializing, setInitializing] = useState(true);
  
  // Handle initial app loading
  useEffect(() => {
    // Wait a bit for auth to initialize
    const timer = setTimeout(() => {
      setInitializing(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Show loading screen while auth state is being determined
  if (initializing || loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2E7D32" />
      </View>
    );
  }
  
  return (
    <NavigationContainer>
      {currentUser ? (
        // User is signed in - show app screens
        <AppStack.Navigator>
          <AppStack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{ 
              title: 'FoodGI',
              headerTintColor: '#2E7D32',
              headerTitleStyle: { fontWeight: 'bold' },
            }}
          />
        </AppStack.Navigator>
      ) : (
        // User is not signed in - show auth flow
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
});

export default AppNavigator; 