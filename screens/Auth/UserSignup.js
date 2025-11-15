import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function UserSignup({ navigation }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    number: '',
    password: '',
    address: '',
  });

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/auth/user-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.success && data.user) {
        const userId = data.user._id;
        await AsyncStorage.setItem('userId', userId);
        console.log('User ID saved to AsyncStorage:', userId);

        Alert.alert('Signup successful!');
        navigation.navigate('UserDashboard');
      } else {
        Alert.alert('Signup failed', data.message || 'Unknown error');
      }
    } catch (err) {
      console.error('Signup error:', err);
      Alert.alert('Unable to signup', 'Please try again');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formCard}>
        <Text style={styles.title}>User Registration</Text>
        {['name', 'email', 'number', 'address', 'password'].map((field) => (
          <View key={field} style={styles.inputContainer}>
            <Text style={styles.inputLabel}>
              {field === 'name'
                ? 'Full Name'
                : field === 'number'
                ? 'Contact Number'
                : field.charAt(0).toUpperCase() + field.slice(1)}
            </Text>
            <TextInput
              style={styles.input}
              placeholder={`Enter your ${field}`}
              placeholderTextColor="#999"
              value={form[field]}
              secureTextEntry={field === 'password'}
              onChangeText={(text) => handleChange(field, text)}
            />
          </View>
        ))}

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.backButtonText}>Already have an account? Log in</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6A11CB',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: '5%',
    paddingVertical: 24,
  },
  decorativeCircle1: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    top: '10%',
    left: '-15%',
  },
  decorativeCircle2: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(37, 117, 252, 0.3)',
    top: '70%',
    right: '-10%',
  },
  decorativeCircle3: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    top: '25%',
    right: '20%',
  },
  formCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 28,
    width: '60%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: 6,
    textAlign: 'center',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  formContainer: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  input: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: '#e1e5e9',
    borderRadius: 10,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fafbfc',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  button: {
    backgroundColor: '#2575FC',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 12,
    alignItems: 'center',
    shadowColor: '#2575FC',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  backButton: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 14,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
});
