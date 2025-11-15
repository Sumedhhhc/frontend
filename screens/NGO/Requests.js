import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, FlatList, Alert } from 'react-native';

const vw = Dimensions.get('window').width / 100;
const vh = Dimensions.get('window').height / 100;

export default function NGODashboard() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    // Fetch donation requests from backend
    async function fetchRequests() {
      try {
        const res = await fetch('http://localhost:3000/api/donations/requests');
        const data = await res.json();
        setRequests(data.requests || []);
      } catch (err) {
        setRequests([]);
      }
    }
    fetchRequests();
  }, []);

  const handleDecision = async (id, decision) => {
    try {
      const res = await fetch(`http://localhost:3000/api/donations/${id}/${decision}`, {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success) {
        Alert.alert('Success', `Request ${decision}ed`);
        setRequests(prev => prev.filter(r => r._id !== id));
      } else {
        Alert.alert('Error', data.message || 'Failed');
      }
    } catch {
      Alert.alert('Error', 'Unable to process');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Donation Requests</Text>
      <FlatList
        data={requests}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.type} donation from {item.userName}</Text>
            <Text style={styles.cardDetail}>Address: {item.address}</Text>
            <View style={styles.actions}>
              <TouchableOpacity style={styles.accept} onPress={() => handleDecision(item._id, 'accept')}>
                <Text style={styles.actionText}>Accept</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.reject} onPress={() => handleDecision(item._id, 'reject')}>
                <Text style={styles.actionText}>Reject</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text>No requests found.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: vh * 6, alignItems: 'center', backgroundColor: '#fff' },
  title: { fontSize: vw * 7, fontWeight: 'bold', marginBottom: vh * 2, color: '#222' },
  card: { backgroundColor: '#f3f3f3', borderRadius: vw * 2, padding: vh * 2, marginVertical: vh * 1, width: vw * 85 },
  cardTitle: { fontWeight: 'bold', fontSize: vw * 4, marginBottom: vh * 1 },
  cardDetail: { fontSize: vw * 3.5, marginBottom: vh * 1 },
  actions: { flexDirection: 'row', justifyContent: 'flex-end' },
  accept: { backgroundColor: '#00d084', padding: vh * 1, borderRadius: vw * 2, marginRight: vw * 2 },
  reject: { backgroundColor: '#ff4444', padding: vh * 1, borderRadius: vw * 2 },
  actionText: { color: '#fff', fontWeight: 'bold' },
});