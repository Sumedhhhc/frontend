import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Linking,
  ActivityIndicator,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Celebrations() {
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNGOs();
  }, []);

  const fetchNGOs = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/users?type=ngo');
      const json = await res.json();
      const email = await AsyncStorage.getItem('userEmail');
      console.log('Loaded userEmail:', email);

      if (json.success && Array.isArray(json.data)) {
        setNgos(json.data);
      } else {
        setNgos([]);
      }
    } catch (err) {
      window.alert('Error', 'Unable to fetch NGO data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCall = (number) => {
    if (!number) {
      window.alert('Error', 'Contact number not available');
      return;
    }
    Linking.openURL(`tel:${number}`);
  };

  const renderNGOCard = ({ item }) => (
  <View style={styles.ngoCard}>
    <View style={styles.cardHeader}>
      <Text style={styles.ngoName}>{item.name}</Text>
      <View
        style={[
          styles.statusBadge,
          {
            backgroundColor:
              item.status === 'available'
                ? 'rgba(34,197,94,0.2)'
                : 'rgba(239,68,68,0.2)',
          },
        ]}
      >
        <Text
          style={[
            styles.statusText,
            { color: item.status === 'available' ? '#15803D' : '#B91C1C' },
          ]}
        >
          {item.status === 'available' ? 'Available' : 'Occupied'}
        </Text>
      </View>
    </View>
    <Text style={styles.emailText}>{item.email || 'No email available'}</Text>

    <View style={styles.detailRow}>
      <MaterialIcons name="call" size={18} color="#2563EB" />
      <Text style={styles.contactText}>
        {item.number || 'No contact available'}
      </Text>
    </View>

    <TouchableOpacity
      style={[
        styles.callButton,
        { backgroundColor: item.status === 'available' ? '#2563EB' : '#9CA3AF' },
      ]}
      onPress={() =>
        item.status === 'available'
          ? handleCall(item.number)
          : window.alert('Not Available', 'This NGO is currently occupied.')
      }
    >
      <MaterialIcons name="phone-in-talk" size={20} color="#fff" />
      <Text style={styles.callButtonText}>
        {item.status === 'available' ? 'Call NGO' : 'Occupied'}
      </Text>
    </TouchableOpacity>
  </View>
);

  return (
    <View style={styles.container}>
      {/* Decorative background shapes */}
      <View style={styles.decorativeCircle1} />
      <View style={styles.decorativeCircle2} />
      <View style={styles.decorativeCircle3} />

      <View style={styles.card}>
        <Text style={styles.title}>🎊 Celebrate with NGOs!</Text>
        <Text style={styles.subtitle}>
          Connect with registered NGOs to organize celebration events.
        </Text>

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#2563EB"
            style={{ marginTop: 40 }}
          />
        ) : ngos.length === 0 ? (
          <Text style={styles.noData}>No NGOs found</Text>
        ) : (
          <FlatList
            data={ngos}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderNGOCard}
            contentContainerStyle={styles.listContainer}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6A11CB',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
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
  card: {
    width: '85%',
    height: '80%',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  listContainer: {
    paddingBottom: 40,
  },
  ngoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 3 },
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ngoName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  contactText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 6,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontWeight: '600',
    fontSize: 12,
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    justifyContent: 'center',
    marginTop: 8,
  },
  callButtonText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 6,
  },
  noData: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    marginTop: 40,
  },
});
