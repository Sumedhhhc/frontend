import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function MakeDonation({ navigation }) {
  const [donationType, setDonationType] = useState('');
  const [address, setAddress] = useState('');
  const [selectedNGO, setSelectedNGO] = useState(null);

  const donationTypes = [
    { id: 'Food', iconName: 'food-apple', color: '#e53935' },    // Red
    { id: 'Clothes', iconName: 'tshirt-crew', color: '#009688' }, // Teal
    { id: 'Money', iconName: 'cash', color: '#fbc02d' },         // Gold
  ];

  const handleSubmit = async () => {
    if (!donationType || !address) {
      window.alert('Missing Information: Please fill in all required fields.');
      return;
    }
    try {
      const res = await fetch('http://localhost:3000/api/donations/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: donationType,
          address,
          ngo: selectedNGO,
        }),
      });
      const data = await res.json();
      if (data.success) {
        window.alert('Donation request submitted!');
        navigation.goBack();
      } else {
        window.alert('Error: ' + (data.message || 'Failed to submit'));
      }
    } catch (err) {
      window.alert('Error: Unable to submit donation');
    }
  };

  const isSubmitEnabled = donationType && address;

  return (
    <View style={styles.container}>
      {/* Decorative Circles */}
      <View style={styles.circle1} />
      <View style={styles.circle2} />
      <View style={styles.circle3} />

      <View style={styles.card}>
        <Text style={styles.title}>Make a Donation</Text>

        <View style={styles.inputContainer}>
          <MaterialCommunityIcons
            name="map-marker"
            size={20}
            color="#6A11CB"
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter your address for pickup"
            placeholderTextColor="#999"
            value={address}
            onChangeText={setAddress}
          />
        </View>

        <View style={styles.donationTypes}>
          {donationTypes.map((type) => {
            const isActive = donationType === type.id;
            return (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.typeButton,
                  isActive && {
                    backgroundColor: type.color,
                    borderColor: type.color,
                  },
                ]}
                onPress={() => setDonationType(type.id)}
              >
                <MaterialCommunityIcons
                  name={type.iconName}
                  size={28}
                  color={isActive ? '#fff' : '#666'}
                  style={{ marginBottom: 6 }}
                />
                <Text
                  style={[
                    styles.typeText,
                    isActive && { color: '#fff' },
                  ]}
                >
                  {type.id}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          style={[
            styles.submitButton,
            !isSubmitEnabled && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={!isSubmitEnabled}
        >
          <Text style={styles.submitButtonText}>Submit Donation Request</Text>
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
    paddingHorizontal: 24,
    paddingVertical: 40,
    position: 'relative',
  },

  // Decorative circles
  circle1: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.1)',
    top: 40,
    left: -30,
  },
  circle2: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.07)',
    bottom: 80,
    right: 40,
  },
  circle3: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.06)',
    top: 200,
    right: 100,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingVertical: 32,
    paddingHorizontal: 28,
    width: '100%',
    maxWidth: 420,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    alignItems: 'center',
    zIndex: 10,
  },

  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#6A11CB',
    marginBottom: 24,
    textAlign: 'center',
  },

  inputContainer: {
    width: '100%',
    marginBottom: 24,
    position: 'relative',
  },

  inputIcon: {
    position: 'absolute',
    top: 14,
    left: 14,
  },

  input: {
    backgroundColor: '#f9f9f9',
    paddingVertical: 14,
    paddingHorizontal: 42,
    fontSize: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    color: '#222',
  },

  donationTypes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },

  typeButton: {
    flex: 1,
    marginHorizontal: 6,
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
  },

  typeText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#666',
  },

  submitButton: {
    marginTop: 32,
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 18,
    alignItems: 'center',
    backgroundColor: '#6A11CB',
  },

  submitButtonDisabled: {
    backgroundColor: '#999',
  },

  submitButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
});
