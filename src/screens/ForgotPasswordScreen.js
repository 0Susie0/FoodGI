import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  
  const { resetPassword } = useAuth();
  
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  const handleResetPassword = async () => {
    // Validate input
    if (!email.trim() || !validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await resetPassword(email);
      setIsEmailSent(true);
    } catch (error) {
      let errorMessage = 'Failed to send password reset email';
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email format';
      }
      
      Alert.alert('Reset Password Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  const navigateToLogin = () => {
    navigation.navigate('Login');
  };
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Reset Password</Text>
          
          {isEmailSent ? (
            <>
              <View style={styles.successContainer}>
                <Text style={styles.successTitle}>Email Sent!</Text>
                <Text style={styles.successMessage}>
                  We've sent a password reset link to your email address. Please check your inbox and follow the instructions to reset your password.
                </Text>
              </View>
              
              <TouchableOpacity
                style={styles.button}
                onPress={navigateToLogin}
              >
                <Text style={styles.buttonText}>Back to Login</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.subtitle}>
                Enter your email address and we'll send you a link to reset your password
              </Text>
              
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
              
              <TouchableOpacity
                style={styles.button}
                onPress={handleResetPassword}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Send Reset Link</Text>
                )}
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.backButton}
                onPress={navigateToLogin}
              >
                <Text style={styles.backButtonText}>Back to Login</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f9f9f9',
    padding: 20,
    justifyContent: 'center',
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E7D32',
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#444',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  button: {
    backgroundColor: '#2E7D32',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    alignItems: 'center',
    padding: 15,
  },
  backButtonText: {
    color: '#2E7D32',
    fontSize: 16,
  },
  successContainer: {
    backgroundColor: '#EEF7EF',
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 10,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default ForgotPasswordScreen; 