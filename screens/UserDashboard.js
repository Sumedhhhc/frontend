import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default function UserDashboard({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Background Decorations */}
      <View style={styles.decorativeCircle1} />
      <View style={styles.decorativeCircle2} />
      <View style={styles.decorativeCircle3} />

      <View style={styles.card}>
        <Text style={styles.title}>Welcome to Your Dashboard!</Text>
        <Text style={styles.subtitle}>Choose an action to get started</Text>

        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, { backgroundColor: '#2575FC' }]}
            onPress={() => navigation.navigate('MakeDonation')}
          >
            <MaterialIcons name="favorite" size={24} color="#fff" style={styles.icon} />
            <Text style={styles.tabText}>Make Donation</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.tab, { backgroundColor: '#9333EA' }]}
          onPress={() => navigation.navigate('Celebrations')}
          >
            <MaterialIcons name="celebration" size={24} color="#fff" style={styles.icon} />
            <Text style={styles.tabText}>Celebrations</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.tab, { backgroundColor: '#F59E0B' }]}
          onPress={() => navigation.navigate('CoinsScreen')}
          >
            <MaterialIcons name="monetization-on" size={24} color="#fff" style={styles.icon} />
            <Text style={styles.tabText}>Your Coins</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.tab, { backgroundColor: '#6366F1' }]}>
            <MaterialIcons name="history" size={24} color="#fff" style={styles.icon} />
            <Text style={styles.tabText}>Donation History</Text>
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
    width: '40%',
    height: '70%',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    color: '#555',
    textAlign: 'center',
    marginBottom: 28,
  },
  tabs: {
    width: '90%',
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 24,
    justifyContent: 'flex-start',
    elevation: 4,
  },
  icon: {
    marginRight: 12,
  },
  tabText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
