import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Alert, Animated } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';

const vw = Dimensions.get('window').width / 100;
const vh = Dimensions.get('window').height / 100;

export default function NGOSignup({ navigation }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    number: '',
    password: '',
    address: '',
    documents: [],
  });

  const [selectedDocs, setSelectedDocs] = useState([]);

  // Animation values
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(50);
  const scaleAnim = new Animated.Value(0.9);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleFilePick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        multiple: false,
      });

      if (result.type === 'cancel') return;

      const files = result.assets || [result];

      setSelectedDocs(files);
      setForm({ ...form, documents: files });

      window.alert('Files Selected', `${files.length} document(s) selected`);
    } catch (err) {
      console.error('File Picker Error:', err);
      window.alert('Error', 'Unable to open file picker');
    }
  };

const handleSubmit = async () => {
  try {
    const formData = new FormData();

    formData.append('name', form.name);
    formData.append('email', form.email);
    formData.append('number', form.number);
    formData.append('password', form.password);
    formData.append('address', form.address);

    if (selectedDocs.length > 0) {
      selectedDocs.forEach((file, index) => {
        formData.append('documents', {
          uri: file.uri,
          name: file.name || `document_${index}.pdf`,
          type: file.mimeType || 'application/pdf',
        });
      });
    }

    const res = await fetch('http://localhost:3000/api/auth/ngo-signup', {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json',
      },
    });

    const data = await res.json();
    if (data.success) {
      window.alert('Success', 'Signup submitted! Await admin verification.');
      navigation.navigate('NGODashboard');
    } else {
      window.alert('Error', data.message || 'Signup failed');
    }
  } catch (err) {
    console.error(err);
    window.alert('Error', 'Unable to signup');
  }
};

  return (
    <View style={styles.container}>
      {/* Decorative background elements */}
      <View style={[styles.decorativeCircle1]} />
      <View style={[styles.decorativeCircle2]} />
      <View style={[styles.decorativeCircle3]} />
      
      <View style={[
        styles.formCard,
        {
          opacity: fadeAnim,
          transform: [
            { translateY: slideAnim },
            { scale: scaleAnim }
          ]
        }
      ]}>
        <View style={styles.header}>
          <Text style={styles.title}>NGO Registration</Text>
          <Text style={styles.subtitle}>Join our network of verified organizations</Text>
        </View>

        <View style={styles.formContainer}>
          {['name', 'email', 'number', 'address', 'password'].map((field) => (
            <View key={field} style={styles.inputContainer}>
              <Text style={styles.inputLabel}>
                {field === 'name' ? 'Organization Name' :
                 field === 'number' ? 'Contact Number' :
                 field.charAt(0).toUpperCase() + field.slice(1)}
              </Text>
              <TextInput
                style={styles.input}
                placeholder={`Enter your ${field === 'name' ? 'organization name' : 
                field === 'number' ? 'contact number' : field}`}
                placeholderTextColor="#999"
                value={form[field]}
                secureTextEntry={field === 'password'}
                onChangeText={text => handleChange(field, text)}
              />
            </View>
          ))}
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Documents</Text>
            <TouchableOpacity 
              style={styles.uploadButton} 
              onPress={handleFilePick}
              activeOpacity={0.8}
            >
              <Text style={styles.uploadButtonText}>Upload Verification Documents</Text>
            </TouchableOpacity>
            {selectedDocs.length > 0 && (
              <View style={styles.fileList}>
                {selectedDocs.map((file, index) => (
                  <Text key={index} style={styles.fileName}>• {file.name}</Text>
                ))}
              </View>
            )}
          </View>

          <TouchableOpacity 
            style={styles.button} 
            onPress={handleSubmit}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Register as NGO</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.navigate('Login')}
            activeOpacity={0.7}
          >
            <Text style={styles.backButtonText}>Already have an account? Log in</Text>
          </TouchableOpacity>
        </View>
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
    marginTop: -16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 20,
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
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
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
  uploadButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 2,
    borderColor: '#2575FC',
    borderStyle: 'dashed',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  uploadButtonText: {
    color: '#2575FC',
    fontSize: 14,
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#2575FC',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 10,
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
    fontSize: 18,
    letterSpacing: 0.5,
  },
  backButton: {
    backgroundColor: 'transparent',
    paddingVertical: 6,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
});
