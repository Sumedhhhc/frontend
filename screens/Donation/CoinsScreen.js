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
  Dimensions,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ---------- Gift cards data (brand, icon, color gradients) ----------
const GIFT_CARDS = [
  { id: 1, name: "Amazon ₹100", coinsRequired: 10000, icon: "store", brand: "Amazon", colorFrom: "#fb923c", colorTo: "#f59e0b" },
  { id: 2, name: "Flipkart ₹200", coinsRequired: 20000, icon: "cart", brand: "Flipkart", colorFrom: "#3b82f6", colorTo: "#06b6d4" },
  { id: 3, name: "Amazon ₹500", coinsRequired: 50000, icon: "store", brand: "Amazon", colorFrom: "#fb923c", colorTo: "#f59e0b" },
  { id: 4, name: "Paytm ₹100", coinsRequired: 10000, icon: "wallet", brand: "Paytm", colorFrom: "#6366f1", colorTo: "#3b82f6" },
  { id: 5, name: "Paytm ₹200", coinsRequired: 20000, icon: "wallet", brand: "Paytm", colorFrom: "#6366f1", colorTo: "#3b82f6" },
  { id: 6, name: "Flipkart ₹500", coinsRequired: 50000, icon: "cart", brand: "Flipkart", colorFrom: "#3b82f6", colorTo: "#06b6d4" },
  { id: 7, name: "BookMyShow ₹100", coinsRequired: 10000, icon: "ticket-confirmation", brand: "BookMyShow", colorFrom: "#fb7185", colorTo: "#f43f5e" },
  { id: 8, name: "BookMyShow ₹200", coinsRequired: 20000, icon: "ticket-confirmation", brand: "BookMyShow", colorFrom: "#fb7185", colorTo: "#f43f5e" },
  { id: 9, name: "BookMyShow ₹500", coinsRequired: 50000, icon: "ticket-confirmation", brand: "BookMyShow", colorFrom: "#fb7185", colorTo: "#f43f5e" },
];

// card size constants
const CARD_W = 380;
const CARD_H = 260;

export default function CoinsScreen() {
  const [coins, setCoins] = useState(0);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState(false);
  const [userEmail, setUserEmail] = useState(null);
  const [recentlyRedeemed, setRecentlyRedeemed] = useState(null);

  // animated background orbs refs
  const orb1Anim = useRef(new Animated.Value(0)).current;
  const orb2Anim = useRef(new Animated.Value(0)).current;
  const orb3Anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    getUserEmail();
    // start background orbs animation
    animateOrb(orb1Anim, 0, 1, 15000);
    animateOrb(orb2Anim, 0, 1, 18000);
    animateOrb(orb3Anim, 0, 1, 12000);
  }, []);

  useEffect(() => {
    if (userEmail) fetchCoins();
    else {
      setLoading(false);
    }
  }, [userEmail]);

  async function getUserEmail() {
    try {
      // prefer AsyncStorage for native, localStorage for web
      const email = Platform.OS === "web" ? localStorage.getItem("userEmail") : await AsyncStorage.getItem("userEmail");
      setUserEmail(email);
      console.log("Loaded userEmail:", email);
    } catch (err) {
      console.error("Error reading userEmail:", err);
    }
  }

  async function fetchCoins() {
    try {
      setLoading(true);
      // Your existing endpoint (kept intact)
      const res = await fetch(`http://localhost:3000/api/users/?email=${userEmail}`);
      const data = await res.json();
      if (data.success && data.data) {
        // data.data might be list of users or single user - handle both ways
        const maybeUser = Array.isArray(data.data) ? data.data.find(u => u.email === userEmail) : data.data;
        if (maybeUser) setCoins(maybeUser.coins || 0);
        else {
          console.warn("User not found in response, using 0 coins");
          setCoins(0);
        }
      } else {
        console.warn("Fetch coins returned no data, keeping default or demo coins");
      }
    } catch (err) {
      console.error("Error fetching coins:", err);
    } finally {
      setLoading(false);
    }
  }

  function animateOrb(animRef, from, to, duration) {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animRef, { toValue: 1, duration: duration, useNativeDriver: true }),
        Animated.timing(animRef, { toValue: 0, duration: duration, useNativeDriver: true }),
      ])
    ).start();
  }

  // Redeem action — keeps your logic; demo-mode if no real endpoint
  const handleRedeem = async (card) => {
    if (coins < card.coinsRequired) {
      window.alert(`You need ${card.coinsRequired.toLocaleString()} coins to redeem ${card.name}.`);
      return;
    }

    try {
      setRedeeming(true);
      setRecentlyRedeemed(card.id);

      // Uncomment & replace when you have a real API:
      // const res = await fetch('http://localhost:3000/api/coins/redeem', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ userId: someUserId, amount: card.coinsRequired, giftCardName: card.name }) });
      // const result = await res.json();
      // if (result.success) { setCoins(result.coinsLeft); ... }

      // demo: small delay to simulate redeem
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCoins(prev => prev - card.coinsRequired);
      window.alert(`Redeemed ${card.name} successfully! 🎉`);

      // sparkle animation visible for 1.6s
      setTimeout(() => setRecentlyRedeemed(null), 1600);
    } catch (err) {
      console.error("Redeem error:", err);
      window.alert("Redeem failed. Try again.");
    } finally {
      setRedeeming(false);
    }
  };

  // Render gift card tile
  const GiftCard = ({ item, index }) => {
    const canRedeem = coins >= item.coinsRequired;
    const isRedeemed = recentlyRedeemed === item.id;

    // hover / lift animations for each card
    const hoverAnim = useRef(new Animated.Value(0)).current;

    const onHoverIn = () => {
      Animated.timing(hoverAnim, { toValue: 1, duration: 160, useNativeDriver: true }).start();
    };
    const onHoverOut = () => {
      Animated.timing(hoverAnim, { toValue: 0, duration: 160, useNativeDriver: true }).start();
    };

    const translateY = hoverAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -8] });
    const glowOpacity = hoverAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });
    const glowTranslateY = hoverAnim.interpolate({ inputRange: [0, 1], outputRange: [6, 14] });

    return (
      <Pressable onHoverIn={onHoverIn} onHoverOut={onHoverOut} onPress={() => canRedeem && !redeeming && handleRedeem(item)} style={{ width: CARD_W, marginBottom: 36 }}>
        <View style={{ width: CARD_W, height: CARD_H }}>
          {/* Glow behind (only visible for available items) */}
          {canRedeem && (
            <Animated.View style={[
              styles.cardGlow,
              {
                opacity: glowOpacity,
                transform: [{ translateY: glowTranslateY }],
              }
            ]} />
          )}

          {/* Card wrapper (lift together with glow) */}
          <Animated.View style={[styles.rewardCard, { transform: [{ translateY }] }]}>
            {/* top gradient bar - ALWAYS visible */}
            <View style={[
              styles.cardTopBar,
              Platform.OS === "web" && { backgroundImage: `linear-gradient(90deg, ${item.colorFrom}, ${item.colorTo})` }
            ]} />

            <View style={styles.cardContent}>
              {/* icon */}
              <Animated.View style={[
                styles.iconTile,
                Platform.OS === "web" ? { backgroundImage: `linear-gradient(135deg, ${item.colorFrom}, ${item.colorTo})` } : { backgroundColor: item.colorFrom },
                !canRedeem && styles.iconDisabled,
                isRedeemed && { transform: [{ scale: 1.15 }] }
              ]}>
                <MaterialCommunityIcons name={item.icon} size={28} color="#fff" />
              </Animated.View>

              {/* name & coins */}
              <Text style={[styles.giftName, !canRedeem && styles.textDisabled]} numberOfLines={2}>{item.name}</Text>

              <View style={{ height: 12 }} />

              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <Text style={[styles.coinText, !canRedeem && styles.textDisabled]}>{item.coinsRequired.toLocaleString()} Coins required</Text>
              </View>

              {/* bottom badge */}
              <View style={{ marginTop: 16, alignItems: "center" }}>
                {canRedeem ? (
                  <View style={styles.availablePill}>
                    <MaterialCommunityIcons name="flash" size={14} color="#059669" />
                    <Text style={styles.availableText}>Available</Text>
                  </View>
                ) : (
                  <View style={styles.lockedPill}>
                    <Text style={styles.lockedText}>Need {(item.coinsRequired - coins).toLocaleString()} more</Text>
                  </View>
                )}
              </View>

              {/* sparkle overlay when redeemed */}
              {isRedeemed && (
                <View style={styles.sparkleWrap}>
                  <View style={styles.sparkleCircle} />
                  <MaterialCommunityIcons name="star" size={36} color="#f59e0b" />
                </View>
              )}
            </View>
          </Animated.View>
        </View>
      </Pressable>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingWrap}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  // layout: centered grid with 3 columns (desktop Figma)
  return (
    <View style={styles.page}>
      {/* Animated background orbs */}
      <Animated.View style={[
        styles.orb1,
        {
          transform: [{
            translateX: orb1Anim.interpolate({ inputRange: [0, 1], outputRange: [0, 120] })
          },
          { translateY: orb1Anim.interpolate({ inputRange: [0, 1], outputRange: [0, -40] }) },
          { scale: orb1Anim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.08] }) }]
        }
      ]} />
      <Animated.View style={[
        styles.orb2,
        {
          transform: [{
            translateX: orb2Anim.interpolate({ inputRange: [0, 1], outputRange: [0, -80] })
          },
          { translateY: orb2Anim.interpolate({ inputRange: [0, 1], outputRange: [0, 80] }) },
          { scale: orb2Anim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.28] }) }]
        }
      ]} />
      <Animated.View style={[
        styles.orb3,
        {
          transform: [{
            scale: orb3Anim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.4] })
          }]
        }
      ]} />

      {/* Header card */}
      <View style={styles.headerCardWrap}>
        <View style={styles.headerGlass}>
          <View style={styles.headerLeft}>
            <View style={styles.headerIconWrap}>
              <MaterialCommunityIcons name="trophy" size={22} color="#fbbf24" />
            </View>
            <View>
              <Text style={styles.headerTitle}>Your Rewards</Text>
              <Text style={styles.headerSubtitle}>Redeem your coins for exciting gift cards and rewards!</Text>
            </View>
          </View>

          {/* coins box */}
          <Animated.View style={[styles.coinsBoxWrap]}>
            <View style={styles.coinsGlow} />
            <View style={styles.coinsBox}>
              <MaterialCommunityIcons name="currency-inr" size={26} color="#fff" />
              <View style={{ marginLeft: 10 }}>
                <Text style={styles.coinsSmall}>Available Coins</Text>
                <Text style={styles.coinsBig}>{coins.toLocaleString()}</Text>
              </View>
            </View>
          </Animated.View>
        </View>
      </View>

      {/* Grid */}
      <View style={styles.gridWrap}>
        <FlatList
          data={GIFT_CARDS}
          renderItem={({ item, index }) => <GiftCard item={item} index={index} />}
          keyExtractor={(item) => item.id.toString()}
          numColumns={3}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.gridContent}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* Footer info */}
      <View style={styles.footerWrap}>
        <View style={styles.footerCard}>
          <MaterialCommunityIcons name="gift" size={18} color="#f0abfc" />
          <Text style={styles.footerText}>Earn more coins by completing tasks and participating in events!</Text>
        </View>
      </View>
    </View>
  );
}

/* ---------------------- Styles ---------------------- */

const styles = StyleSheet.create({
  page: {
    flex: 1,
    minHeight: "100vh",
    backgroundColor: "#6B21A8", // fallback for RN
    // full-screen gradient via web-only properties
    ...(Platform.OS === "web" ? {
      backgroundImage: "linear-gradient(180deg, #6b21a8 0%, #7c3aed 40%, #4f46e5 100%)"
    } : {}),
    alignItems: "center",
    paddingTop: 36,
    paddingBottom: 80,
    position: "relative"
  },

  /* background orbs */
  orb1: {
    position: "absolute",
    left: -60,
    top: 140,
    width: 420,
    height: 420,
    borderRadius: 210,
    ...(Platform.OS === "web" ? { backgroundImage: "radial-gradient(circle at 30% 30%, rgba(236,72,153,0.12), transparent)" } : { backgroundColor: "rgba(236,72,153,0.12)" }),
    filter: "blur(40px)",
    zIndex: 0
  },
  orb2: {
    position: "absolute",
    right: -80,
    bottom: -120,
    width: 500,
    height: 500,
    borderRadius: 250,
    ...(Platform.OS === "web" ? { backgroundImage: "radial-gradient(circle at 60% 60%, rgba(34,211,238,0.12), transparent)" } : { backgroundColor: "rgba(34,211,238,0.12)" }),
    filter: "blur(40px)",
    zIndex: 0
  },
  orb3: {
    position: "absolute",
    right: "30%",
    top: "45%",
    width: 260,
    height: 260,
    borderRadius: 130,
    ...(Platform.OS === "web" ? { backgroundImage: "radial-gradient(circle at 50% 50%, rgba(244,63,94,0.08), transparent)" } : { backgroundColor: "rgba(244,63,94,0.08)" }),
    filter: "blur(24px)",
    zIndex: 0
  },

  /* Header glass */
  headerCardWrap: {
    width: "92%",
    maxWidth: 1200,
    zIndex: 3,
    marginBottom: 28,
  },
  headerGlass: {
    width: "100%",
    borderRadius: 18,
    padding: 20,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(10px)",
    overflow: "hidden",
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 14 },
  headerIconWrap: { width: 44, height: 44, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.03)", alignItems: "center", justifyContent: "center" },
  headerTitle: { color: "#fff", fontWeight: "800", fontSize: 20 },
  headerSubtitle: { color: "rgba(255,255,255,0.9)" },

  coinsBoxWrap: {
    width: 220,
    alignItems: "flex-end",
  },
  coinsGlow: {
    position: "absolute",
    inset: -8,
    borderRadius: 14,
    ...(Platform.OS === "web" ? { backgroundImage: "linear-gradient(90deg,#facc15,#fb923c)" } : { backgroundColor: "#f59e0b" }),
    filter: "blur(18px)",
    opacity: 0.45,
    zIndex: 0
  },
  coinsBox: {
    zIndex: 2,
    backgroundColor: "linear-gradient(90deg,#facc15,#fb923c)", // fallback
    ...(Platform.OS === "web" ? { backgroundImage: "linear-gradient(90deg,#facc15,#fb923c)" } : { backgroundColor: "#f59e0b" }),
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    boxShadow: "0 8px 30px rgba(0,0,0,0.2)"
  },
  coinsSmall: { color: "rgba(255,255,255,0.85)", fontSize: 12 },
  coinsBig: { color: "#fff", fontWeight: "800", fontSize: 20 },

  /* Grid */
  gridWrap: {
    width: "92%",
    maxWidth: 1280,
    zIndex: 2,
    alignItems: "center",
    flexGrow: 1,
    maxHeight: "62vh",   
    minHeight: 300,      
    overflow: "hidden",
  },
  gridContent: {
    paddingBottom: 80,
    paddingTop: 6,
  },
  columnWrapper: {
    justifyContent: "center",
    gap: 40
  },

  /* Card glow (behind card) */
  cardGlow: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: CARD_H,
    borderRadius: 22,
    ...(Platform.OS === "web" ? { backgroundImage: "linear-gradient(90deg,#7c3aed,#ec4899,#4f46e5)" } : { backgroundColor: "#7c3aed" }),
    filter: "blur(26px)",
    zIndex: 0
  },

  /* Reward Card */
  rewardCard: {
    width: "100%",
    height: "100%",
    borderRadius: 22,
    overflow: "hidden",
    backgroundColor: "#fff",
    zIndex: 2,
    boxShadow: "0 18px 40px rgba(10,10,10,0.12)"
  },
  cardTopBar: {
    height: 6,
    backgroundColor: "#7c3aed",
  },
  cardContent: {
    padding: 18,
    alignItems: "center",
    justifyContent: "flex-start",
    flex: 1,
  },

  iconTile: {
    width: 78,
    height: 78,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -36,
    marginBottom: 10,
    zIndex: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
  },
  iconDisabled: {
    opacity: 0.5,
  },

  giftName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center"
  },
  coinText: {
    color: "#8b5cf6",
    fontWeight: "600"
  },

  textDisabled: {
    color: "#9ca3af"
  },

  availablePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#ecfdf5",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
  },
  availableText: {
    color: "#059669",
    fontWeight: "700"
  },

  lockedPill: {
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center"
  },
  lockedText: {
    color: "#6b7280",
    fontWeight: "700"
  },

  /* sparkle overlay */
  sparkleWrap: {
    position: "absolute",
    inset: 0,
    zIndex: 8,
    alignItems: "center",
    justifyContent: "center",
    pointerEvents: "none"
  },
  sparkleCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    ...(Platform.OS === "web" ? { backgroundImage: "radial-gradient(circle,#fef3c7, rgba(255,255,255,0))" } : { backgroundColor: "#fef3c7" }),
    opacity: 0.9,
    transform: [{ scale: 1 }],
    marginBottom: 6
  },

  /* Footer */
  footerWrap: {
    width: "92%",
    maxWidth: 1000,
    alignItems: "center",
    marginTop: 20,
  },
  footerCard: {
    width: "100%",
    borderRadius: 14,
    padding: 16,
    backgroundColor: "rgba(255,255,255,0.06)",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)"
  },
  footerText: { color: "rgba(255,255,255,0.9)" },

  /* loading fallback */
  loadingWrap: { flex: 1, minHeight: "100vh", alignItems: "center", justifyContent: "center", backgroundColor: "#6B21A8" }
});
