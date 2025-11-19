import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
  Animated,
  StyleSheet,
  Platform,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Celebrations() {
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNGOs();
  }, []);

  const fetchNGOs = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/users?type=ngo");
      const json = await res.json();

      const email = await AsyncStorage.getItem("userEmail");
      console.log("Loaded userEmail:", email);

      if (json.success && Array.isArray(json.data)) setNgos(json.data);
      else setNgos([]);
    } catch (err) {
      console.error(err);
      alert("Unable to fetch NGO data");
    } finally {
      setLoading(false);
    }
  };

  const handleCall = (number) => {
    if (!number) return alert("Contact number not available");
    window.open(`tel:${number}`);
  };

  /* ============================================================
      PERFECT FIGMA CARD — fixed width, fixed glow, true hover
  ============================================================ */

  const NGOCard = ({ item }) => {
    const anim = useRef(new Animated.Value(0)).current;

    const onHoverIn = () => {
      Animated.timing(anim, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }).start();
    };

    const onHoverOut = () => {
      Animated.timing(anim, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }).start();
    };

    // lift card
    const translateY = anim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -8],
    });

    // glow fade-in
    const glowOpacity = anim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });

    // glow downward shift for figma effect
    const glowTranslate = anim.interpolate({
      inputRange: [0, 1],
      outputRange: [6, 14],
    });

    return (
      <Pressable onHoverIn={onHoverIn} onHoverOut={onHoverOut}>
        <View style={{ width: 380, height: 250, marginBottom: 40 }}>
          {/* Glow (behind card, never covering top bar) */}
          <Animated.View
            style={[
              styles.cardGlow,
              {
                opacity: glowOpacity,
                transform: [{ translateY: glowTranslate }],
              },
            ]}
          />

          {/* The card itself */}
          <Animated.View
            style={[
              styles.cardWrapper,
              { transform: [{ translateY }] },
            ]}
          >
            {/* Gradient top bar */}
            <View
              style={[
                styles.topBar,
                Platform.OS === "web" && {
                  backgroundImage:
                    "linear-gradient(90deg, #7c3aed, #ec4899, #4f46e5)",
                },
              ]}
            />

            {/* Card content */}
            <View style={styles.cardInner}>
              {/* Header row */}
              <View style={styles.cardHeader}>
                <Text style={styles.ngoName}>{item.name}</Text>

                <View
                  style={[
                    styles.statusBadge,
                    item.status === "available"
                      ? styles.availableBadge
                      : styles.occupiedBadge,
                  ]}
                >
                  <MaterialIcons
                    name={
                      item.status === "available"
                        ? "check-circle"
                        : "cancel"
                    }
                    size={16}
                    color={
                      item.status === "available" ? "#15803D" : "#B91C1C"
                    }
                  />
                  <Text
                    style={[
                      styles.statusText,
                      {
                        color:
                          item.status === "available" ? "#15803D" : "#B91C1C",
                      },
                    ]}
                  >
                    {item.status === "available"
                      ? "Available"
                      : "Occupied"}
                  </Text>
                </View>
              </View>

              {/* Email */}
              <View style={styles.row}>
                <MaterialIcons name="mail" size={18} color="#7c3aed" />
                <Text style={styles.contactText}>{item.email}</Text>
              </View>

              {/* Number */}
              <View style={styles.row}>
                <MaterialIcons name="call" size={18} color="#7c3aed" />
                <Text style={styles.contactText}>{item.number}</Text>
              </View>

              {/* Call button */}
              <Pressable
                onPress={() =>
                  item.status === "available"
                    ? handleCall(item.number)
                    : alert("This NGO is currently occupied")
                }
                style={[
                  styles.callButton,
                  item.status === "available"
                    ? styles.callAvailable
                    : styles.callDisabled,
                ]}
              >
                <MaterialIcons
                  name="phone-in-talk"
                  size={20}
                  color={item.status === "available" ? "#fff" : "#666"}
                />
                <Text
                  style={[
                    styles.callButtonText,
                    {
                      color:
                        item.status === "available" ? "#fff" : "#666",
                    },
                  ]}
                >
                  {item.status === "available"
                    ? "Call NGO"
                    : "Currently Occupied"}
                </Text>
              </Pressable>
            </View>
          </Animated.View>
        </View>
      </Pressable>
    );
  };

  /* ============================================================ */

  return (
    <View style={styles.page}>
      {/* Header */}
      <View style={styles.headerWrap}>
        <Text style={styles.headerTitle}>🎉 Celebrate with NGOs!</Text>
        <Text style={styles.headerSubtitle}>
          Connect with registered NGOs to organize meaningful celebration events.
        </Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#fff" />
      ) : (
        <FlatList
          data={ngos}
          renderItem={({ item }) => <NGOCard item={item} />}
          keyExtractor={(item, i) => i.toString()}
          numColumns={3}
          contentContainerStyle={{
            paddingBottom: 120,
            alignItems: "center",
            gap: 40,
          }}
          columnWrapperStyle={{
            justifyContent: "center",
            gap: 40,
            marginTop: 40,
          }}
        />
      )}
    </View>
  );
}

/* ======================== STYLES ======================== */

const styles = StyleSheet.create({
  page: {
    flex: 1,
    minHeight: "100vh",
    paddingTop: 50,
    backgroundColor: "#5b21b6",
  },

  headerWrap: {
    alignItems: "center",
    marginBottom: 50,
  },
  headerTitle: {
    fontSize: 36,
    color: "#fff",
    fontWeight: "900",
  },
  headerSubtitle: {
    marginTop: 8,
    fontSize: 16,
    color: "rgba(255,255,255,0.85)",
    textAlign: "center",
    maxWidth: 700,
  },

  /* Glow behind card */
  cardGlow: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 250,
    borderRadius: 24,
    backgroundImage:
      "linear-gradient(90deg, #7c3aed, #ec4899, #4f46e5)",
    filter: "blur(26px)",
  },

  /* Card wrapper */
  cardWrapper: {
    width: "100%",
    height: "100%",
    backgroundColor: "#fff",
    borderRadius: 22,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 18,
    overflow: "hidden",
  },

  topBar: {
    height: 6,
    backgroundColor: "#7c3aed",
  },

  cardInner: {
    padding: 20,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  ngoName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    width: "65%",
  },

  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  availableBadge: {
    backgroundColor: "#dcfce7",
  },
  occupiedBadge: {
    backgroundColor: "#fee2e2",
  },
  statusText: {
    fontSize: 13,
    fontWeight: "700",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  contactText: {
    marginLeft: 8,
    color: "#374151",
  },

  callButton: {
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  callAvailable: {
    backgroundImage:
      Platform.OS === "web"
        ? "linear-gradient(90deg, #7c3aed, #4f46e5)"
        : undefined,
    backgroundColor: Platform.OS !== "web" ? "#7c3aed" : "transparent",
  },
  callDisabled: {
    backgroundColor: "#e5e7eb",
  },
  callButtonText: {
    fontSize: 15,
    fontWeight: "700",
  },
});
