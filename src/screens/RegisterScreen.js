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

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [diabetesType, setDiabetesType] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();
  
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  const validatePassword = (password) => {
    return password.length >= 6;
  };
  
  const handleRegister = async () => {
    // Validate input
    if (!name.trim()) {
      Alert.alert('Error', 'Name is required');
      return;
    }
    
    if (!email.trim() || !validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }
    
    if (!validatePassword(password)) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }
    
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    
    if (!diabetesType.trim()) {
      Alert.alert('Error', 'Please select your diabetes type');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const userData = {
        name,
        diabetesType,
        createdAt: new Date().toISOString(),
      };
      
      await register(email, password, userData);
      // Navigation will be handled by the auth state listener
    } catch (error) {
      let errorMessage = 'Failed to create account';
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already in use';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email format';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak';
      }
      
      Alert.alert('Registration Error', errorMessage);
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
          <Text style={styles.title}>FoodGI</Text>
          <Text style={styles.subtitle}>Create your account</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              value={name}
              onChangeText={setName}
            />
          </View>
          
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
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Create a password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Confirm your password"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Diabetes Type</Text>
            <View style={styles.diabetesTypeContainer}>
              <TouchableOpacity
                style={[
                  styles.diabetesTypeButton,
                  diabetesType === 'Type 1' && styles.selectedDiabetesType,
                ]}
                onPress={() => setDiabetesType('Type 1')}
              >
                <Text
                  style={[
                    styles.diabetesTypeText,
                    diabetesType === 'Type 1' && styles.selectedDiabetesTypeText,
                  ]}
                >
                  Type 1
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.diabetesTypeButton,
                  diabetesType === 'Type 2' && styles.selectedDiabetesType,
                ]}
                onPress={() => setDiabetesType('Type 2')}
              >
                <Text
                  style={[
                    styles.diabetesTypeText,
                    diabetesType === 'Type 2' && styles.selectedDiabetesTypeText,
                  ]}
                >
                  Type 2
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.diabetesTypeButton,
                  diabetesType === 'Gestational' && styles.selectedDiabetesType,
                ]}
                onPress={() => setDiabetesType('Gestational')}
              >
                <Text
                  style={[
                    styles.diabetesTypeText,
                    diabetesType === 'Gestational' && styles.selectedDiabetesTypeText,
                  ]}
                >
                  Gestational
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.diabetesTypeButton,
                  diabetesType === 'Prediabetes' && styles.selectedDiabetesType,
                ]}
                onPress={() => setDiabetesType('Prediabetes')}
              >
                <Text
                  style={[
                    styles.diabetesTypeText,
                    diabetesType === 'Prediabetes' && styles.selectedDiabetesTypeText,
                  ]}
                >
                  Prediabetes
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <TouchableOpacity
            style={styles.button}
            onPress={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Create Account</Text>
            )}
          </TouchableOpacity>
          
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={navigateToLogin}>
              <Text style={styles.loginLink}>Log In</Text>
            </TouchableOpacity>
          </View>
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
    marginVertical: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2E7D32',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
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
  diabetesTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  diabetesTypeButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    width: '48%',
    alignItems: 'center',
  },
  selectedDiabetesType: {
    borderColor: '#2E7D32',
    backgroundColor: '#EEF7EF',
  },
  diabetesTypeText: {
    color: '#666',
    fontSize: 14,
  },
  selectedDiabetesTypeText: {
    color: '#2E7D32',
    fontWeight: 'bold',
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
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginText: {
    color: '#666',
    fontSize: 16,
  },
  loginLink: {
    color: '#2E7D32',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RegisterScreen; 