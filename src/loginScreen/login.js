import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Dimensions,
  Platform,
  Alert,
} from 'react-native';

export default function LoginPage({ navigation, route }) {
  // State to manage email, password, and errors
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Dummy credentials (Replace with API call)
  const validEmail = "admin";
  const validPassword = "admin";

  function handleLogin() {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both username and password.");
      return;
    }

    if (email === validEmail && password === validPassword) {
      Alert.alert("Success", "Login Successful!");
      navigation.navigate("Upload") 
    } else {
      Alert.alert("Error", "Invalid username or password.");
    }
  }

  return (
    <View style={styles.container}>
      {/* Main scrollable content */}
      <KeyboardAvoidingView
        style={styles.flexContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContentContainer}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          {/* Welcome section */}
          <Text style={styles.header}>Welcome !!!</Text>
          <Text style={styles.subheader}>Please log in to continue</Text>

          {/* Email input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your username"
              placeholderTextColor="#B0C4DE"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
            />
          </View>

          {/* Password input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor="#B0C4DE"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          {/* Login button */}
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Log In</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

// Get the width of the device screen to adjust styles
const { width } = Dimensions.get('window');

// Styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  flexContainer: {
    flex: 1,
  },
  scrollContentContainer: {
    flexGrow: 1,
    paddingTop: 50,
    paddingHorizontal: '8%',
  },
  header: {
    fontSize: 30,
    fontWeight: '700',
    color: '#2A2A72',
    marginBottom: 10,
    textAlign: 'center',
  },
  subheader: {
    fontSize: 16,
    fontWeight: '400',
    color: '#7A7A7A',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2A2A72',
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderColor: '#B0C4DE',
    borderWidth: 1.5,
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    color: '#2A2A72',
  },
  loginButton: {
    backgroundColor: '#2260FF',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 10,
    width: '80%',
    alignSelf: 'center',
    shadowColor: '#2260FF',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

