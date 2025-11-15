import React, { useEffect, useState } from 'react';
import { 
  View, Text, TouchableOpacity, StyleSheet, 
  FlatList, Alert, Platform 
} from 'react-native';

export default function NGODashboard() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
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

        if (Platform.OS === "web") {
          window.alert(`Donation ${decision}ed successfully!`);
        }

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

      {/* Decorative Circles */}
      <View style={styles.circle1} />
      <View style={styles.circle2} />
      <View style={styles.circle3} />

      <Text style={styles.title}>Donation Requests</Text>

      <FlatList
        data={requests}
        keyExtractor={item => item._id}
        showsVerticalScrollIndicator={false}
        style={{ width: "100%" }}
        contentContainerStyle={{
          paddingBottom: "10vh",
          alignItems: "center",
        }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              {item.type} donation from {item.userName}
            </Text>

            <Text style={styles.cardDetail}>Address: {item.address}</Text>

            <View style={styles.actions}>
              <TouchableOpacity 
                style={styles.accept}
                onPress={() => handleDecision(item._id, "accept")}
              >
                <Text style={styles.actionText}>Accept</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.reject}
                onPress={() => handleDecision(item._id, "reject")}
              >
                <Text style={styles.actionText}>Reject</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ marginTop: "2vh", fontSize: "3vw", color: "#fff" }}>
            No requests found.
          </Text>
        }
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    paddingTop: "6vh",
    alignItems: 'center',
    backgroundColor: '#6A11CB',
    position: "relative",
    overflow: "hidden",
  },

  /* Decorative Circles */
  circle1: {
    position: "absolute",
    width: "45vw",
    height: "45vw",
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.15)",
    top: "-10vh",
    left: "-10vw",
  },
  circle2: {
    position: "absolute",
    width: "30vw",
    height: "30vw",
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.08)",
    top: "20vh",
    right: "-8vw",
  },
  circle3: {
    position: "absolute",
    width: "20vw",
    height: "20vw",
    borderRadius: 999,
    backgroundColor: "rgba(0,0,0,0.07)",
    top: "38vh",
    left: "15vw",
  },

  title: { 
    fontSize: "4vw",
    fontWeight: "bold",
    marginBottom: "3vh",
    color: "#fff",
    zIndex: 10,
  },

  /* Smaller Card */
  card: { 
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 16,
    paddingVertical: "2vh",
    paddingHorizontal: "2vw",
    marginVertical: "1.5vh",
    width: "70vw",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },

  cardTitle: { 
    fontWeight: "bold", 
    fontSize: "2.5vw", 
    marginBottom: "1vh",
    color: "#222",
  },

  cardDetail: { 
    fontSize: "2vw",
    marginBottom: "1.2vh",
    color: "#555",
  },

  actions: { 
    flexDirection: "row", 
    justifyContent: "flex-end",
    marginTop: "1vh",
  },

  accept: { 
    backgroundColor: "#00d084",
    paddingVertical: "1vh",
    paddingHorizontal: "2vw",
    borderRadius: 10,
    marginRight: "2vw",
  },

  reject: { 
    backgroundColor: "#ff4444",
    paddingVertical: "1vh",
    paddingHorizontal: "2vw",
    borderRadius: 10,
  },

  actionText: { 
    color: "#fff", 
    fontWeight: "bold",
    fontSize: "2vw",
  },
});
