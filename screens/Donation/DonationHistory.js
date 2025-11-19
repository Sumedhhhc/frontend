import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Platform, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function DonationHistory() {

  const [history, setHistory] = useState([]);

 useEffect(() => {
  async function fetchHistory() {
    try {
      const email =
        Platform.OS === "web"
          ? localStorage.getItem("userEmail")
          : await AsyncStorage.getItem("userEmail");

      if (!email) return;

      console.log("Fetching history for email:", email);

      const res = await fetch(
        `http://localhost:3000/api/donations/history/email/${email}`
      );

      const data = await res.json();

      if (!data.success) {
        console.log("History fetch failed:", data.message);
        return;
      }

      setHistory(data.history || []);

    } catch (err) {
      console.log("History load error:", err);
    }
  }

  fetchHistory();
}, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "accepted":
        return "#22c55e";
      case "rejected":
        return "#ef4444";
      default:
        return "#f59e0b";
    }
  };

  return (
    <View style={styles.container} contentContainerStyle={{ alignItems: "center" }}>
      
      {/* Background Circles */}
      <View style={styles.circle1} />
      <View style={styles.circle2} />
      <View style={styles.circle3} />

      <Text style={[styles.title, { textAlign: "center" }]}>Your Donation History</Text>

      <ScrollView style={{ width: "100%", height: "60vh", paddingBottom: "10vh" }}>
        <View style={{alignItems: "center"}}>
        {history.length === 0 ? (
          <Text style={{ color: "#fff", marginTop: "3vh", fontSize: "2.4vw" }}>
            No donation records yet.
          </Text>
        ) : (
          history.map((item) => (
            <View key={item._id} style={styles.card}>
              
              {/* Status badge */}
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(item.status) },
                ]}
              >
                <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
              </View>

              <Text style={styles.cardTitle}>{item.type} Donation</Text>

              <Text style={styles.cardDetail}>Address: {item.address}</Text>

              {/* NGO Name */}
              {item.ngoName && (
                <Text style={styles.cardDetail}>NGO: {item.ngoName}</Text>
              )}

              {/* Coins Earned */}
              {item.status === "accepted" && (
                <Text style={styles.cardDetail}>
                  Coins Earned: {item.coinsEarned}
                </Text>
              )}

              {/* Food Details */}
              {item.type === "Food" && (
                <>
                  <Text style={styles.cardDetail}>
                    Food: {item.details.foodItem}
                  </Text>
                  <Text style={styles.cardDetail}>
                    Qty: {item.details.foodQuantity}
                  </Text>
                  <Text style={styles.cardDetail}>
                    Expiry: {item.details.expirytime}
                  </Text>
                </>
              )}

              {item.type === "Clothes" && (
                <Text style={styles.cardDetail}>
                  Clothes: {item.details.clothesDescription}
                </Text>
              )}

              {item.type === "Money" && (
                <Text style={styles.cardDetail}>
                  Donated Amount: ₹{item.details.moneyAmount}
                </Text>
              )}

              <Text style={styles.dateText}>
                Date: {new Date(item.createdAt).toLocaleString()}
              </Text>

            </View>
          ))
        )}
        </View>
      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#6A11CB",
    paddingTop: "6vh",
    position: "relative",
    overflow: "hidden",
  },

  circle1: {
    position: "absolute",
    width: "45vw",
    height: "45vw",
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.15)",
    top: "-12vh",
    left: "-12vw",
  },
  circle2: {
    position: "absolute",
    width: "30vw",
    height: "30vw",
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.08)",
    top: "28vh",
    right: "-10vw",
  },
  circle3: {
    position: "absolute",
    width: "20vw",
    height: "20vw",
    borderRadius: 999,
    backgroundColor: "rgba(0,0,0,0.08)",
    top: "60vh",
    left: "18vw",
  },

  title: {
    fontSize: "4vw",
    fontWeight: "800",
    color: "#fff",
    marginBottom: "3vh",
  },

  card: {
  width: "50vw",
  backgroundColor: "rgba(255,255,255,0.95)",
  paddingVertical: "2vh",
  paddingHorizontal: "2vw",
  borderRadius: 16,
  marginVertical: "1.5vh",
  shadowColor: "#000",
  shadowOpacity: 0.15,
  shadowOffset: { width: 0, height: 4 },
  elevation: 6,
},

  statusBadge: {
    position: "absolute",
    right: "2vw",
    top: "1vh",
    paddingVertical: "0.6vh",
    paddingHorizontal: "1vw",
    borderRadius: 8,
  },

  statusText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: "1vw",
  },

  cardTitle: {
    fontWeight: "bold",
    fontSize: "2vw",
    marginBottom: "1vh",
    color: "#222",
  },

  cardDetail: {
    fontSize: "1vw",
    marginBottom: "0.8vh",
    color: "#444",
  },

  dateText: {
    marginTop: "1vh",
    fontSize: "1vw",
    color: "#666",
  },
});
