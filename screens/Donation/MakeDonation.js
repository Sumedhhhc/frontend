import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Platform,
  ScrollView,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import WebLeafletMap from "../WebLeafletMap.js";

export default function MakeDonation({ navigation }) {
  const [donationType, setDonationType] = useState("");
  const [address, setAddress] = useState("");

  const [foodQuantity, setFoodQuantity] = useState("");
  const [foodItem, setFoodItem] = useState("");
  const [foodType, setFoodType] = useState("");
  const [expirytime, setExpirytime] = useState("");
  const [clothesDescription, setClothesDescription] = useState("");
  const [moneyAmount, setMoneyAmount] = useState("");

  const donationTypes = [
    { id: "Food", iconName: "silverware-fork-knife", grad: ["#ef4444", "#f97316"] },
    { id: "Clothes", iconName: "tshirt-crew", grad: ["#10b981", "#14b8a6"] },
    { id: "Money", iconName: "cash", grad: ["#f59e0b", "#fbbf24"] },
  ];

  const foodTypeOptions = ["Vegetarian", "Non-Vegetarian", "Vegan"];
  const expiryOptions = ["1hr", "4hrs", "8hrs", "12hrs", "24hrs"];

  const showMap = donationType !== "";

  // Load Address
  useEffect(() => {
    const loadUserAddress = async () => {
      try {
        const email =
          Platform.OS === "web"
            ? localStorage.getItem("userEmail")
            : await AsyncStorage.getItem("userEmail");

        if (!email) return;

        const res = await fetch(
          `http://localhost:3000/api/users/by-email?email=${email}`
        );
        const data = await res.json();

        if (data.success && data.data?.address?.formatted) {
          setAddress(data.data.address.formatted);
        }
      } catch (err) {
        console.log("Error fetching user:", err);
      }
    };

    loadUserAddress();
  }, []);

  // Submit Donation
  const handleSubmit = async () => {
    try {
      if (!donationType || !address) {
        alert("Please fill required fields");
        return;
      }

      let donationDetails = {};

      if (donationType === "Food") {
        if (!foodQuantity || !foodItem || !foodType || !expirytime) {
          return alert("Please fill all food fields");
        }
        donationDetails = { foodQuantity, foodItem, foodType, expirytime };
      }

      if (donationType === "Clothes") {
        if (!clothesDescription) return alert("Enter clothes description");
        donationDetails = { clothesDescription };
      }

      if (donationType === "Money") {
        if (!moneyAmount) return alert("Enter amount");
        donationDetails = { moneyAmount };
      }

      const email =
        Platform.OS === "web"
          ? localStorage.getItem("userEmail")
          : await AsyncStorage.getItem("userEmail");

      if (!email) return alert("Login again");

      const userRes = await fetch(
        `http://localhost:3000/api/users/by-email?email=${email}`
      );
      const userData = await userRes.json();

      if (!userData.success) {
        alert("Unable to load your user profile");
        return;
      }

      const userId = userData.data._id;

      const res = await fetch("http://localhost:3000/api/donations/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          type: donationType,
          address,
          details: donationDetails,
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert("Donation Successful! 🎉");
        navigation.goBack();
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Something went wrong.");
    }
  };

  return (
    <View style={styles.screen}>
      {/* 🌈 Floating Background Blobs */}
      <View style={styles.pinkBlob} />
      <View style={styles.cyanBlob} />
      <View style={styles.yellowBlob} />

      {/* MAIN CONTENT */}
      <ScrollView contentContainerStyle={styles.scrollWrap}>
        <View style={styles.container}>

          {/* HEADER */}
          <View style={styles.headerWrap}>
            <MaterialCommunityIcons
              name="heart"
              size={32}
              color="#f9a8d4"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.headerText}>Make a Difference</Text>
            <MaterialCommunityIcons
              name="heart"
              size={32}
              color="#f9a8d4"
              style={{ marginLeft: 8 }}
            />
          </View>
          <Text style={styles.subText}>
            Your generosity can change lives. Choose what you'd like to donate and we'll connect you with those in need.
          </Text>

          {/* SPLIT ROW */}
          <View style={[styles.splitRow, showMap && { justifyContent: "flex-start" }]}>
            
            {/* LEFT CARD */}
            <View style={[styles.leftCardOuter, showMap && { marginRight: 24 }]}>
              <View style={styles.leftCardInner}>
                {/* ADDRESS */}
                <View style={styles.inputBlock}>
                  <Text style={styles.label}>
                    <MaterialCommunityIcons name="map-marker" size={16} color="#6A11CB" />
                    {"  "}
                    Pickup Address
                  </Text>

                  <View style={styles.inputWithIcon}>
                    <MaterialCommunityIcons
                      name="map-marker"
                      size={20}
                      color="#6A11CB"
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your address"
                      value={address}
                      onChangeText={setAddress}
                    />
                  </View>
                </View>

                {/* DONATION TYPE */}
                <Text style={styles.label}>Choose Donation Type</Text>

                <View style={styles.typeRow}>
                  {donationTypes.map((type) => {
                    const active = donationType === type.id;
                    return (
                      <TouchableOpacity
                        key={type.id}
                        onPress={() => setDonationType(type.id)}
                        style={[
                          styles.typeBox,
                          active && {
                            backgroundColor: type.grad[0],
                            borderColor: "transparent",
                          },
                        ]}
                      >
                        <MaterialCommunityIcons
                          name={type.iconName}
                          size={28}
                          color={active ? "#fff" : "#666"}
                        />
                        <Text style={[styles.typeLabel, active && { color: "#fff" }]}>
                          {type.id}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* FOOD */}
                {donationType === "Food" && (
                  <View style={styles.dynamicSection}>
                    <TextInput
                      style={styles.dynamicInput}
                      placeholder="e.g., 5 plates"
                      value={foodQuantity}
                      onChangeText={setFoodQuantity}
                    />
                    <TextInput
                      style={styles.dynamicInput}
                      placeholder="e.g., Rice & Curry"
                      value={foodItem}
                      onChangeText={setFoodItem}
                    />

                    <View style={styles.dropdown}>
                      <Picker selectedValue={foodType} onValueChange={setFoodType}>
                        <Picker.Item label="Select Food Type" value="" />
                        {foodTypeOptions.map((t) => (
                          <Picker.Item key={t} label={t} value={t} />
                        ))}
                      </Picker>
                    </View>

                    <View style={styles.dropdown}>
                      <Picker selectedValue={expirytime} onValueChange={setExpirytime}>
                        <Picker.Item label="Select Expiry Time" value="" />
                        {expiryOptions.map((t) => (
                          <Picker.Item key={t} label={t} value={t} />
                        ))}
                      </Picker>
                    </View>
                  </View>
                )}

                {/* CLOTHES */}
                {donationType === "Clothes" && (
                  <TextInput
                    style={styles.dynamicInput}
                    placeholder="Describe the clothes"
                    value={clothesDescription}
                    onChangeText={setClothesDescription}
                  />
                )}

                {/* MONEY */}
                {donationType === "Money" && (
                  <TextInput
                    style={styles.dynamicInput}
                    placeholder="Enter amount"
                    keyboardType="numeric"
                    value={moneyAmount}
                    onChangeText={setMoneyAmount}
                  />
                )}

                {/* SUBMIT */}
                <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
                  <Text style={styles.submitBtnText}>Submit Donation Request</Text>
                </TouchableOpacity>

                {/* COIN INFO */}
                <View style={styles.infoBox}>
                  <MaterialCommunityIcons
                    name="check-circle"
                    size={20}
                    color="#059669"
                  />
                  <Text style={styles.infoText}>
                    You'll earn <Text style={{ fontWeight: "bold" }}>+50 coins</Text> once an NGO accepts your donation!
                  </Text>
                </View>
              </View>
            </View>

            {/* RIGHT MAP */}
            {showMap && (
              <View style={styles.mapCardOuter}>
                <View style={styles.mapCardInner}>
                  <WebLeafletMap address={address} />
                </View>
              </View>
            )}

          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#6A11CB",
    ...(Platform.OS === "web" && {
      backgroundImage: "linear-gradient(135deg,#6A11CB,#7e34db,#4f46e5)",
    }),
  },

  scrollWrap: { paddingVertical: 40, alignItems: "center" },
  container: { width: "100%", maxWidth: 1200, alignItems: "center" },

  // HEADER
  headerWrap: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
    marginTop: '-2vw',
  },
  headerText: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
  },
  subText: {
    color: "#e9d5ff",
    fontSize: 15,
    textAlign: "center",
    marginBottom: 30,
  },

  // BLOBS
  pinkBlob: {
    position: "absolute",
    top: -80,
    left: -60,
    width: 300,
    height: 300,
    backgroundColor: "rgba(236,72,153,0.25)",
    borderRadius: 300,
    filter: "blur(120px)",
  },
  cyanBlob: {
    position: "absolute",
    bottom: -100,
    right: -40,
    width: 400,
    height: 400,
    backgroundColor: "rgba(34,211,238,0.25)",
    borderRadius: 400,
    filter: "blur(150px)",
  },
  yellowBlob: {
    position: "absolute",
    top: "40%",
    right: "35%",
    width: 240,
    height: 240,
    backgroundColor: "rgba(251,191,36,0.18)",
    borderRadius: 240,
    filter: "blur(100px)",
  },

  // SPLIT
  splitRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
    marginTop: '-1vw',
  },

  // LEFT CARD (glass)
  leftCardOuter: {
    width: 480,
    padding: 6,
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  leftCardInner: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
  },

  // Inputs
  label: {
    color: "#444",
    fontWeight: "600",
    marginBottom: 8,
  },
  inputBlock: { marginBottom: 22 },
  inputWithIcon: { position: "relative" },
  inputIcon: { position: "absolute", top: 15, left: 14, zIndex: 2 },
  input: {
    paddingLeft: 44,
    borderWidth: 2,
    borderColor: "#e5e7eb",
    paddingVertical: 12,
    borderRadius: 14,
  },

  // Donation Types
  typeRow: { flexDirection: "row", gap: 12, marginVertical: 10 },
  typeBox: {
    flex: 1,
    padding: 16,
    borderRadius: 20,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#ddd",
  },
  typeLabel: { marginTop: 6, fontSize: 14, fontWeight: "600" },

  // Dynamic Fields
  dynamicSection: { marginTop: 20 },
  dynamicInput: {
    borderWidth: 2,
    borderColor: "#e5e7eb",
    backgroundColor: "#fafafa",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },

  dropdown: {
    borderWidth: 2,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: "#fafafa",
  },

  // Submit Button
  submitBtn: {
    backgroundColor: "#6A11CB",
    padding: 16,
    borderRadius: 16,
    marginTop: 20,
  },
  submitBtnText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 17,
    fontWeight: "700",
  },

  // Info Box
  infoBox: {
    marginTop: 16,
    backgroundColor: "#ecfdf5",
    padding: 14,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#bbf7d0",
  },
  infoText: { color: "#065f46", fontSize: 13, flex: 1 },

  // MAP
  mapCardOuter: {
    flex: 1,
    minHeight: 600,
    padding: 6,
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  mapCardInner: {
    flex: 1,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
});
