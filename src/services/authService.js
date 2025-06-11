import { auth, firestore } from './firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Keys for storing auth data
const USER_DATA_KEY = '@GI Tracker:userData';
const AUTH_TOKEN_KEY = '@GI Tracker:authToken';

/**
 * Service for handling all authentication-related operations in the GI Tracker app
 */
class AuthService {
  /**
   * Register a new user with email and password
   * @param {string} email - User's email address
   * @param {string} password - User's chosen password
   * @param {object} userData - Additional user data (name, birthdate, diabetesType, etc.)
   * @returns {Promise<object>} - The user object
   */
  async register(email, password, userData) {
    try {
      // Create the user with Firebase Authentication
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      
      // Get the user object
      const user = userCredential.user;
      
      // Create a user profile document in Firestore
      await firestore()
        .collection('users')
        .doc(user.uid)
        .set({
          email: email,
          name: userData.name || '',
          birthdate: userData.birthdate || null,
          diabetesType: userData.diabetesType || '',
          createdAt: firestore.FieldValue.serverTimestamp(),
          lastLoginAt: firestore.FieldValue.serverTimestamp(),
        });
      
      // Store user data in AsyncStorage
      const userToStore = {
        uid: user.uid,
        email: user.email,
        ...userData
      };
      
      await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(userToStore));
      
      return user;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }
  
  /**
   * Log in an existing user with email and password
   * @param {string} email - User's email address
   * @param {string} password - User's password
   * @returns {Promise<object>} - The user object
   */
  async login(email, password) {
    try {
      // Sign in the user with Firebase Authentication
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      
      // Get the user object
      const user = userCredential.user;
      
      // Update the last login timestamp in Firestore
      await firestore()
        .collection('users')
        .doc(user.uid)
        .update({
          lastLoginAt: firestore.FieldValue.serverTimestamp(),
        });
      
      // Get user data from Firestore
      const userDoc = await firestore()
        .collection('users')
        .doc(user.uid)
        .get();
      
      if (userDoc.exists) {
        const userData = userDoc.data();
        
        // Store user data in AsyncStorage
        await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify({
          uid: user.uid,
          email: user.email,
          name: userData.name,
          birthdate: userData.birthdate,
          diabetesType: userData.diabetesType,
        }));
      }
      
      // Store authentication token for persistent login
      const token = await user.getIdToken();
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
      
      return user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }
  
  /**
   * Sign out the current user
   * @returns {Promise<void>}
   */
  async logout() {
    try {
      await auth().signOut();
      
      // Clear AsyncStorage data
      await AsyncStorage.removeItem(USER_DATA_KEY);
      await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }
  
  /**
   * Check if a user is currently logged in
   * @returns {Promise<boolean>} - True if a user is logged in
   */
  async isAuthenticated() {
    try {
      const currentUser = auth().currentUser;
      
      if (currentUser) {
        return true;
      }
      
      // Check if we have a stored token as fallback
      const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
      return token !== null;
    } catch (error) {
      console.error('Authentication check error:', error);
      return false;
    }
  }
  
  /**
   * Get the current user's data
   * @returns {Promise<object|null>} - User data or null if not logged in
   */
  async getCurrentUser() {
    try {
      // Check Firebase Auth first
      const currentUser = auth().currentUser;
      
      if (currentUser) {
        // Get the latest user data from Firestore
        const userDoc = await firestore()
          .collection('users')
          .doc(currentUser.uid)
          .get();
        
        if (userDoc.exists) {
          return {
            uid: currentUser.uid,
            email: currentUser.email,
            ...userDoc.data()
          };
        }
      }
      
      // Try to get from AsyncStorage as fallback
      const userDataString = await AsyncStorage.getItem(USER_DATA_KEY);
      if (userDataString) {
        return JSON.parse(userDataString);
      }
      
      return null;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }
  
  /**
   * Update the current user's profile data
   * @param {object} userData - New user data to update
   * @returns {Promise<void>}
   */
  async updateUserProfile(userData) {
    try {
      const currentUser = auth().currentUser;
      
      if (!currentUser) {
        throw new Error('No authenticated user found');
      }
      
      // Update the user document in Firestore
      await firestore()
        .collection('users')
        .doc(currentUser.uid)
        .update({
          ...userData,
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });
      
      // Update the stored user data
      const storedUserData = await this.getCurrentUser();
      await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify({
        ...storedUserData,
        ...userData
      }));
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }
  
  /**
   * Send a password reset email to the user
   * @param {string} email - The email address to send the reset link to
   * @returns {Promise<void>}
   */
  async resetPassword(email) {
    try {
      await auth().sendPasswordResetEmail(email);
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  }
  
  /**
   * Reauthenticate user before sensitive operations like password change
   * @param {string} password - Current password for verification
   * @returns {Promise<boolean>} - True if reauthentication was successful
   */
  async reauthenticate(password) {
    try {
      const currentUser = auth().currentUser;
      
      if (!currentUser || !currentUser.email) {
        throw new Error('No authenticated user found or email is missing');
      }
      
      const credential = auth.EmailAuthProvider.credential(
        currentUser.email,
        password
      );
      
      await currentUser.reauthenticateWithCredential(credential);
      return true;
    } catch (error) {
      console.error('Reauthentication error:', error);
      return false;
    }
  }
  
  /**
   * Change the user's password
   * @param {string} currentPassword - Current password for verification
   * @param {string} newPassword - New password to set
   * @returns {Promise<boolean>} - True if password change was successful
   */
  async changePassword(currentPassword, newPassword) {
    try {
      const reauthenticated = await this.reauthenticate(currentPassword);
      
      if (!reauthenticated) {
        throw new Error('Failed to reauthenticate user');
      }
      
      const currentUser = auth().currentUser;
      await currentUser.updatePassword(newPassword);
      
      return true;
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  }
}

export default new AuthService(); 