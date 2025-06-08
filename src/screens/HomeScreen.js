import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

const HomeScreen = () => {
  const { currentUser, logout } = useAuth();
  
  const handleLogout = async () => {
    try {
      await logout();
      // Navigation will be handled by the auth state listener in AppNavigator
    } catch (error) {
      Alert.alert('Error', 'Failed to log out');
    }
  };
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>
          Welcome, {currentUser?.name || 'User'}!
        </Text>
        <Text style={styles.subtitleText}>
          Track your food's glycemic index and manage your diabetes better
        </Text>
      </View>
      
      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>Your Profile</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Name:</Text>
          <Text style={styles.infoValue}>{currentUser?.name || 'Not set'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Email:</Text>
          <Text style={styles.infoValue}>{currentUser?.email || 'Not set'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Diabetes Type:</Text>
          <Text style={styles.infoValue}>{currentUser?.diabetesType || 'Not set'}</Text>
        </View>
      </View>
      
      <View style={styles.actionsContainer}>
        <Text style={styles.actionsTitle}>What would you like to do?</Text>
        
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Search Food GI</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Log a Meal</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Record Blood Glucose</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>View History</Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    padding: 20,
    backgroundColor: '#2E7D32',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  subtitleText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  infoBox: {
    backgroundColor: 'white',
    margin: 15,
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 16,
    color: '#555',
    width: 120,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    flex: 1,
  },
  actionsContainer: {
    backgroundColor: 'white',
    margin: 15,
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  actionButton: {
    backgroundColor: '#EEF7EF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#D4E7D6',
  },
  actionButtonText: {
    fontSize: 16,
    color: '#2E7D32',
    fontWeight: '500',
    textAlign: 'center',
  },
  logoutButton: {
    margin: 15,
    marginTop: 5,
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#D32F2F',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default HomeScreen; 