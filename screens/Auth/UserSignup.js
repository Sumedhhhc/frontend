import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

export default function UserSignup({ navigation }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    number: '',
    password: '',
    address: '',
  });

  const [userType, setUserType] = useState('');

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.number || !form.password || !form.address || !userType) {
      alert("Please fill all fields including user type");
      return;
    }

    try {
      const res = await fetch('http://localhost:3000/api/auth/user-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, userType }),
      });

      const data = await res.json();

      if (data.success && data.user) {
        const userId = data.user._id;
        await AsyncStorage.setItem('userId', userId);

        alert('Signup successful!');
        navigation.navigate('UserDashboard');
      } else {
        alert(data.message || 'Signup failed');
      }
    } catch (err) {
      console.error('Signup error:', err);
      alert('Unable to signup, please try again');
    }
  };

  return (
    <View style={styles.container}>

      <View style={styles.formCard}>
        <Text style={styles.title}>User Registration</Text>

        {/* Input Fields */}
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

        {/* User Type Picker */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>User Type</Text>

          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={userType}
              onValueChange={(value) => setUserType(value)}
              style={styles.picker}
              dropdownIconColor="#666"   // Icon color matching your theme
            >
              <Picker.Item label="Select user type" value="" />
              <Picker.Item label="Individual" value="individual" />
              <Picker.Item label="Café" value="cafe" />
              <Picker.Item label="Restaurant" value="restaurant" />
              <Picker.Item label="Hostel" value="hostel" />
              <Picker.Item label="Hotel" value="hotel" />
              <Picker.Item label="Other Organization" value="organization" />
            </Picker>
          </View>
        </View>

        {/* Register Button */}
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>

        {/* Back to Login */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Login')}>
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
  },

  formCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.97)',
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 28,
    width: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 18,
    elevation: 10,
  },

  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 20,
  },

  inputContainer: {
    marginBottom: 14,
  },

  inputLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
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
  },

  pickerWrapper: {
  borderWidth: 2,
  borderColor: '#cdcdcdff',
  borderRadius: 10,
  backgroundColor: '#fafbfc',
  paddingHorizontal: 12,
  height: 52,
  justifyContent: 'center',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.05,
  shadowRadius: 3,
  elevation: 2,
},

picker: {
  color: '#333',
  fontSize: 16,
  width: '100%',
  height: '100%',
  backgroundColor: 'transparent',
},

  button: {
    backgroundColor: '#2575FC',
    paddingVertical: 16,
    borderRadius: 10,
    marginTop: 15,
    alignItems: 'center',
    elevation: 3,
  },

  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },

  backButton: {
    marginTop: 16,
    alignItems: 'center',
  },

  backButtonText: {
    color: '#666',
    fontSize: 14,
  },
});
