import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Platform,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import WebLeafletMap from "../WebLeafletMap.js";

export default function MakeDonation({ navigation }) {
  const [donationType, setDonationType] = useState("");
  const [address, setAddress] = useState("");

  // dynamic fields
  const [foodQuantity, setFoodQuantity] = useState("");
  const [foodItem, setFoodItem] = useState("");
  const [foodType, setFoodType] = useState("");
  const [expirytime, setExpirytime] = useState("");
  const [clothesDescription, setClothesDescription] = useState("");
  const [moneyAmount, setMoneyAmount] = useState("");

  const donationTypes = [
    { id: "Food", iconName: "food-apple", color: "#e53935" },
    { id: "Clothes", iconName: "tshirt-crew", color: "#009688" },
    { id: "Money", iconName: "cash", color: "#fbc02d" },
  ];

  const foodTypeOptions = ["Vegetarian", "Non-Vegetarian", "Vegan"];
  const expiryOptions = ["1hr", "4hrs", "8hrs", "12hrs", "24hrs"];

  const showMap = donationType !== "";

useEffect(() => {
  const loadUserAddress = async () => {
    try {
      const email =
        Platform.OS === "web"
          ? localStorage.getItem("userEmail")
          : await AsyncStorage.getItem("userEmail");

      if (!email) {
        console.log("No email found in storage");
        return;
      }

      console.log("Fetching user with email:", email);

      const res = await fetch(`http://localhost:3000/api/users/by-email?email=${email}`);
      const data = await res.json();

      if (data.success && data.data?.address?.formatted) {
        setAddress(data.data.address.formatted);
        console.log("Loaded address:", data.data.address.formatted);
      } else {
        console.log("User found but no formatted address saved.");
      }
    } catch (err) {
      console.log("Error fetching user:", err);
    }
  };

  loadUserAddress();
}, []);

const handleSubmit = async () => {
  try {
    // Basic validation
    if (!donationType || !address) {
      alert("Please fill required fields");
      return;
    }

    let donationDetails = {};

    // FOOD
    if (donationType === "Food") {
      if (!foodQuantity || !foodItem || !foodType || !expirytime) {
        return alert("Please fill all food fields");
      }
      donationDetails = {
        foodQuantity,
        foodItem,
        foodType,
        expirytime
      };
    }

    // CLOTHES
    if (donationType === "Clothes") {
      if (!clothesDescription) return alert("Enter clothes description");
      donationDetails = { clothesDescription };
    }

    // MONEY
    if (donationType === "Money") {
      if (!moneyAmount) return alert("Enter amount");
      donationDetails = { moneyAmount };
    }

    // 1️⃣ Get logged-in user's email
    const email =
      Platform.OS === "web"
        ? localStorage.getItem("userEmail")
        : await AsyncStorage.getItem("userEmail");

    if (!email) {
      alert("User email not found. Please login again.");
      return;
    }

    // 2️⃣ Fetch full user data to get userId
    const userRes = await fetch(
      `http://localhost:3000/api/users/by-email?email=${email}`
    );
    const userData = await userRes.json();

    if (!userData.success) {
      alert("Unable to load your user profile");
      return;
    }

    const userId = userData.data._id;

    // 3️⃣ Submit donation request to backend
    const res = await fetch("http://localhost:3000/api/donations/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        type: donationType,
        address,
        details: donationDetails
      })
    });

    const data = await res.json();

    if (data.success) {
      window.alert("Donation Successful! 🎉\nYou earned +50 coins once NGO accepts!");
      navigation.goBack();
    } else {
      alert("Donation failed: " + data.message);
    }
  } catch (err) {
    console.log("Donation error:", err);
    alert("Something went wrong while submitting donation.");
  }
};

  return (
    <View style={styles.rootContainer}>
      <View
        style={[
          styles.splitRow,
          showMap && { justifyContent: "flex-start" },
        ]}
      >

        {/* LEFT CARD */}
        <View style={[styles.cardContainer, showMap && styles.cardLeft]}>
          <View style={styles.card}>
            <Text style={styles.title}>Make a Donation</Text>

            {/* Address */}
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons
                name="map-marker"
                size={20}
                color="#6A11CB"
                style={styles.inputIcon}
              />

              <TextInput
                style={styles.input}
                placeholder="Enter pickup address"
                value={address}
                onChangeText={setAddress}
              />
            </View>

            {/* DONATION TYPES */}
            <View style={styles.donationTypes}>
              {donationTypes.map((type) => {
                const isActive = donationType === type.id;

                return (
                  <TouchableOpacity
                    key={type.id}
                    style={[
                      styles.typeButton,
                      isActive && { backgroundColor: type.color },
                    ]}
                    onPress={() => setDonationType(type.id)}
                  >
                    <MaterialCommunityIcons
                      name={type.iconName}
                      size={28}
                      color={isActive ? "#fff" : "#666"}
                    />

                    <Text
                      style={[
                        styles.typeText,
                        isActive && { color: "#fff" },
                      ]}
                    >
                      {type.id}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* FOOD FIELDS */}
            {donationType === "Food" && (
              <View style={{ width: "100%", marginTop: 20 }}>
                <TextInput
                  style={styles.dynamicInput}
                  placeholder="Food Quantity"
                  value={foodQuantity}
                  onChangeText={setFoodQuantity}
                />

                <TextInput
                  style={styles.dynamicInput}
                  placeholder="What food?"
                  value={foodItem}
                  onChangeText={setFoodItem}
                />

                {/* Food Type */}
                <View style={styles.dropdown}>
                  <Picker
                    selectedValue={foodType}
                    onValueChange={setFoodType}
                  >
                    <Picker.Item label="Select Food Type" value="" />
                    {foodTypeOptions.map((t) => (
                      <Picker.Item key={t} label={t} value={t} />
                    ))}
                  </Picker>
                </View>

                {/* Expiry */}
                <View style={styles.dropdown}>
                  <Picker
                    selectedValue={expirytime}
                    onValueChange={setExpirytime}
                  >
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
                style={[styles.dynamicInput, { marginTop: 20 }]}
                placeholder="Describe the clothes"
                value={clothesDescription}
                onChangeText={setClothesDescription}
              />
            )}

            {/* MONEY */}
            {donationType === "Money" && (
              <TextInput
                style={[styles.dynamicInput, { marginTop: 20 }]}
                placeholder="Enter amount"
                keyboardType="numeric"
                value={moneyAmount}
                onChangeText={setMoneyAmount}
              />
            )}

            {/* SUBMIT */}
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>
                Submit Donation Request
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* RIGHT MAP */}
        {showMap && (
          <View style={styles.mapPane}>
            <WebLeafletMap address={address} />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: "#6A11CB",
    padding: 20,
  },

  splitRow: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "center",
  },

  cardContainer: {
    width: 420,
  },

  cardLeft: {
    marginRight: 20,
  },

  mapPane: {
    flex: 1,
    height: "100%",
    backgroundColor: "#ddd",
    borderRadius: 16,
    overflow: "hidden",
  },

  card: {
    backgroundColor: "#fff",
    padding: 30,
    borderRadius: 20,
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#6A11CB",
    textAlign: "center",
    marginBottom: 20,
  },

  inputContainer: { position: "relative", marginBottom: 20 },

  inputIcon: { position: "absolute", top: 14, left: 14 },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 42,
  },

  donationTypes: { flexDirection: "row", marginTop: 10 },

  typeButton: {
    flex: 1,
    marginHorizontal: 5,
    padding: 12,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },

  typeText: {
    marginTop: 5,
    fontWeight: "600",
  },

  dynamicInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#f9f9f9",
    marginBottom: 12,
  },

  dropdown: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    backgroundColor: "#f9f9f9",
    marginBottom: 12,
  },

  submitButton: {
    backgroundColor: "#6A11CB",
    marginTop: 25,
    padding: 16,
    borderRadius: 12,
  },

  submitButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
  },
});
